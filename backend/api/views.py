from django.db import transaction
from pytz import timezone
from rest_framework.response import Response
from rest_framework.decorators import api_view
from firebase_admin import initialize_app, credentials, auth
from firebase_admin.auth import verify_id_token, InvalidIdTokenError
from api.utils import uuid
from szyszkojny.settings import TESTING, TIME_ZONE

from .models import Code, Transaction, User, user_may_make_code
from .serializers import CodeSerializer, UserSerializer

from dotenv import load_dotenv
import os

load_dotenv()
cred = credentials.Certificate(os.environ.get('GOOGLE_SERVICE_ACCOUNT_KEY'))
firebase_app = initialize_app(cred)

# TODO: raise AuthenticationFailed
def authenticate(id_token: str) -> dict:
    if TESTING and id_token == 'test_id_token':
        user, _ = User.objects.get_or_create(uid='test_uid', defaults={'username': 'test_name'})
        return {'uid': user.uid, 'name': user.username}
    user_info = verify_id_token(id_token, clock_skew_seconds=5)
    uid = user_info['uid']
    auth.get_user(uid)  # check if user exists
    return user_info


@api_view(['POST'])
def my_codes(request):
    id_token = request.data['id_token']
    try:
        user_info = authenticate(id_token)
    except InvalidIdTokenError as e:
        return Response(str(e), status=400)
    uid = user_info['uid']
    codes = Code.objects.filter(issuer__uid=uid)
    serializer = CodeSerializer(codes, many=True)
    res_body = {
        'results': serializer.data
    }
    return Response(res_body)

@api_view(['POST'])
def make_qr(request):
    id_token = request.data['id_token']
    try:
        user_info = authenticate(id_token)
    except InvalidIdTokenError as e:
        return Response(str(e), status=400)
    uid = user_info['uid']

    code_params = request.data['code_params']
    code_params['issuer'] = uid
    code_params['code'] = uuid()
    serializer = CodeSerializer(data=code_params)

    if not serializer.is_valid():
        return Response(serializer.errors, status=400)
    if not user_may_make_code(uid, code_params):
        return Response(status=403)
    else:
        serializer.save()
        return Response(serializer.data, status=201)

@api_view(['POST'])
def log_in(request):
    id_token = request.data['id_token']
    try:
        user_info = authenticate(id_token)
    except InvalidIdTokenError as e:
        return Response(str(e), status=400)
    uid = user_info['uid']
    username = user_info['name']
    user, created = User.objects.get_or_create(uid=uid, defaults={'username': username})
    serializer = UserSerializer(user)
    if created:
        return Response(serializer.data, status=201)
    else:
        return Response(serializer.data, status=200)


@api_view(['GET'])
def get_user(request, uid):
    try:
        user = User.objects.get(uid=uid)
    except User.DoesNotExist:
        return Response(status=404)
    serializer = UserSerializer(user)
    return Response(serializer.data)


@api_view(['GET'])
def get_code(request, code):
    try:
        code = Code.objects.get(code=code)
    except Code.DoesNotExist:
        return Response(status=404)
    serializer = CodeSerializer(code)
    return Response(serializer.data)

@transaction.atomic
@api_view(['POST'])
def use_code(request):
    id_token = request.data['id_token']
    try:
        user_info = authenticate(id_token)
    except InvalidIdTokenError as e:
        return Response(str(e), status=400)
    uid = user_info['uid']
    user = User.objects.get(uid=uid)
    try:
        code = Code.objects.get(code=request.data['code'])
    except Code.DoesNotExist:
        return Response({'error': 'Code not found'}, status=404)
    
    if code.expired():
        error_message = 'Code expired'
        error_data = {
            'error': error_message,
            'expires': code.expires.astimezone(timezone(TIME_ZONE)).isoformat()
        }
        return Response(error_data, status=400)
    
    if not code.activated():
        error_message = 'Code not activated'
        error_data = {
            'error': error_message,
            'activates': code.activates.astimezone(timezone(TIME_ZONE)).isoformat()
        }
        return Response(error_data, status=400)
    
    if code.is_used_up():
        error_message = 'Code used up'
        error_data = {
            'error': error_message,
            'use_limit': code.use_limit,
            'use_count': code.use_count
        }
        return Response(error_data, status=400)
    
    used_by_this_user = code.use_by_count(user)
    if code.per_person_limit is not None and used_by_this_user >= code.per_person_limit:
        error_message = 'Code used up for you'
        error_data = {
            'error': error_message,
            'per_person_limit': code.per_person_limit,
            'used_by_you': used_by_this_user
        }
        return Response(error_data, status=400)
    
    user_money_after = user.money + code.money
    if user_money_after < 0:
        error_message = 'Not enough money'
        error_data = {
            'error': error_message,
            'your_money': user.money,
            'code_money': code.money
        }
        return Response(error_data, status=400)

    code.use_count += 1
    code.save()

    user.money = user_money_after
    user.save()

# TODO: check if user has enough money
    issuer = code.issuer
    issuer.money -= code.money
    issuer.save()

    Transaction.objects.create(
        receiver=user,
        code=code
    )
    return Response(status=200)
