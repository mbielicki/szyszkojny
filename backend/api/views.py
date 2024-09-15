from uuid import uuid4
from rest_framework.response import Response
from rest_framework.decorators import api_view
from firebase_admin import initialize_app, credentials, auth
from firebase_admin.auth import verify_id_token, InvalidIdTokenError
from szyszkojny.settings import TESTING

from .models import Code, User, user_may_make_code
from .serializers import CodeSerializer, UserSerializer

from dotenv import load_dotenv
import os

load_dotenv()
cred = credentials.Certificate(os.environ.get('GOOGLE_SERVICE_ACCOUNT_KEY'))
firebase_app = initialize_app(cred)

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
    code_params['code'] = str(uuid4()).replace('-', '')
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
