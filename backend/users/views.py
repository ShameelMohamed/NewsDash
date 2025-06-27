from rest_framework import generics, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
import requests

from .serializers import SignupSerializer, UserSerializer
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    user = request.user

    if request.method == "GET":
        data = {
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
        }
        return Response(data)

    elif request.method == "PUT":
        username = request.data.get("username", "").strip()
        first_name = request.data.get("first_name", "").strip()
        last_name = request.data.get("last_name", "").strip()

        # Check if username is changed and unique
        if username and username != user.username:
            from django.contrib.auth.models import User
            if User.objects.filter(username=username).exists():
                return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)
            user.username = username

        user.first_name = first_name
        user.last_name = last_name
        user.save()
        return Response({"success": "Profile updated successfully"})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password_view(request):
    user = request.user
    old_password = request.data.get("old_password")
    new_password = request.data.get("new_password")

    if not user.check_password(old_password):
        return Response({"error": "Old password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        validate_password(new_password, user)
    except ValidationError as e:
        return Response({"error": e.messages}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_password)
    user.save()
    # Important to keep user logged in after password change
    update_session_auth_hash(request, user)
    return Response({"success": "Password changed successfully"})

class SignupView(generics.CreateAPIView):
    serializer_class = SignupSerializer
    permission_classes = [permissions.AllowAny]

class UsersListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

# Optional server-rendered dashboard
@login_required
def dashboard(request):
    return render(request, "dashboard.html")

@api_view(['GET'])
@permission_classes([AllowAny])
def proxy_news(request):
    url = "https://api.currentsapi.services/v1/latest-news"
    params = {
        "apiKey": "URBeuUT1YANLLlgDMEFja_erkmtiQm7gqC6mxmH1Sa6UC3kv",
        "language": "en",
        "country": "US"
    }
    r = requests.get(url, params=params)
    return Response(r.json())