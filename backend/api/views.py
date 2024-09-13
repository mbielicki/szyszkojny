from rest_framework.response import Response
from rest_framework.decorators import api_view
from firebase_admin import initialize_app, credentials, auth
from firebase_admin.auth import verify_id_token

from .models import User
from .serializers import UserSerializer

from dotenv import load_dotenv
import os

load_dotenv()
cred = credentials.Certificate(os.environ.get('GOOGLE_SERVICE_ACCOUNT_KEY'))
firebase_app = initialize_app(cred)

@api_view(['POST'])
def authenticate(request):
    id_token = request.data['id_token']
    decoded_token = verify_id_token(id_token, clock_skew_seconds=5)
    uid = decoded_token['uid']
    auth.get_user(uid)  # check if user exists
    return Response(decoded_token)

@api_view(['POST'])
def log_in(request):
    id_token = request.data['id_token']
    decoded_token = verify_id_token(id_token, clock_skew_seconds=5)
    uid = decoded_token['uid']
    auth.get_user(uid) # check if user exists
    user, created =User.objects.get_or_create(uid=uid, defaults={'username': decoded_token['name']})
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
