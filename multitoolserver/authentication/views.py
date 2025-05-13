from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserLoginSerializer, UserTokenSerializer, UserRegistrationSerializer, EmailVerificationSerializer
from .models import UserToken, EmailVerification
from django.utils import timezone
from django.contrib.auth.models import User


class LoginView(APIView):
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            UserToken.objects.filter(
                user=user, 
                is_active=True, 
                expires_at__lt=timezone.now()
            ).update(is_active=False)
            token = UserToken(user=user)
            token.save()
            token_serializer = UserTokenSerializer(token)
            return Response({
                'user_id': user.id,
                'email': user.email,
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'token': token_serializer.data['token'],
                'expires_at': token_serializer.data['expires_at']
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegisterView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'user_id': user.id,
                'email': user.email,
                'message': 'Пользователь успешно зарегистрирован. Пожалуйста, подтвердите ваш email'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EmailVerificationView(APIView):
    def post(self, request):
        serializer = EmailVerificationSerializer(data=request.data)
        if serializer.is_valid():
            verification = serializer.validated_data['verification']
            user = verification.user
            verification.is_verified = True
            verification.save()
            user.is_active = True
            user.save()
            token = UserToken(user=user)
            token.save()
            token_serializer = UserTokenSerializer(token)
            
            return Response({
                'user_id': user.id,
                'email': user.email,
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'token': token_serializer.data['token'],
                'expires_at': token_serializer.data['expires_at'],
                'message': 'Email успешно подтвержден'
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResendVerificationCodeView(APIView):
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email не предоставлен'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email, is_active=False)
            verification = EmailVerification.objects.create(
                user=user,
                email=user.email
            )
            serializer = UserRegistrationSerializer()
            serializer._send_verification_email(verification)
            
            return Response({
                'message': 'Новый код подтверждения отправлен на ваш email'
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response({
                'error': 'Пользователь с таким email не найден или уже активирован'
            }, status=status.HTTP_404_NOT_FOUND)

class VerifyTokenView(APIView):
    def post(self, request):
        token_key = request.data.get('token')
        if not token_key:
            return Response({'error': 'Токен не предоставлен'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            token = UserToken.objects.get(token=token_key, is_active=True)
            if token.is_valid():
                return Response({'valid': True, 'user_id': token.user.id}, status=status.HTTP_200_OK)
            else:
                token.is_active = False
                token.save()
                return Response({'valid': False, 'error': 'Токен просрочен'}, status=status.HTTP_401_UNAUTHORIZED)
                
        except UserToken.DoesNotExist:
            return Response({'valid': False, 'error': 'Недействительный токен'}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    def post(self, request):
        token_key = request.data.get('token')
        if not token_key:
            return Response({'error': 'Токен не предоставлен'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            token = UserToken.objects.get(token=token_key, is_active=True)
            token.is_active = False
            token.save()
            return Response({'success': 'Успешный выход'}, status=status.HTTP_200_OK)
                
        except UserToken.DoesNotExist:
            return Response({'error': 'Недействительный токен'}, status=status.HTTP_401_UNAUTHORIZED)
