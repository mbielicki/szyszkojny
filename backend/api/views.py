from rest_framework.response import Response
from rest_framework.decorators import api_view

from api.models import User

from .serializers import UserSerializer

@api_view(['POST'])
def add_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    else:
        return Response(serializer.errors, status=400)
    return Response(serializer.data, status=201)

@api_view(['GET'])
def get_user(request, uid):
    try:
        user = User.objects.get(uid=uid)
    except User.DoesNotExist:
        return Response(status=404)
    serializer = UserSerializer(user)
    return Response(serializer.data)
