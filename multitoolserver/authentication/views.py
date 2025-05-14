from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserLoginSerializer, UserTokenSerializer, UserRegistrationSerializer, EmailVerificationSerializer
from .models import UserToken, EmailVerification, LoginAttempt
from django.utils import timezone
from django.contrib.auth.models import User


class LoginView(APIView):
    def post(self, request):
        ip_address = self.get_client_ip(request)
        username = request.data.get('email', '')
        if LoginAttempt.is_ip_blocked(ip_address):
            return Response({
                'non_field_errors': ['Слишком много попыток входа. Попробуйте позже.']
            }, status=status.HTTP_429_TOO_MANY_REQUESTS)
        if username and LoginAttempt.is_user_blocked(ip_address, username):
            return Response({
                'non_field_errors': ['Слишком много неудачных попыток входа для этого пользователя. Попробуйте позже.']
            }, status=status.HTTP_429_TOO_MANY_REQUESTS)
            
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            LoginAttempt.objects.create(
                ip_address=ip_address,
                username=user.email if user.email else user.username,
                successful=True
            )
            UserToken.objects.filter(
                user=user, 
                is_active=True, 
                expires_at__lt=timezone.now()
            ).update(is_active=False)
            token = UserToken(
                user=user,
                user_agent=request.META.get('HTTP_USER_AGENT', ''),
                ip_address=ip_address
            )
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
        LoginAttempt.objects.create(
            ip_address=ip_address,
            username=username,
            successful=False
        )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

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
            if verification.attempts >= verification.max_attempts:
                return Response({
                    'code': ['Превышено максимальное количество попыток. Запросите новый код.']
                }, status=status.HTTP_400_BAD_REQUEST)
            
            user = verification.user
            verification.is_verified = True
            verification.save()
            user.is_active = True
            user.save()
            ip_address = self.get_client_ip(request)
            token = UserToken(
                user=user,
                user_agent=request.META.get('HTTP_USER_AGENT', ''),
                ip_address=ip_address
            )
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
        email = request.data.get('email')
        if email:
            try:
                verification = EmailVerification.objects.get(
                    email=email, 
                    is_verified=False,
                    expires_at__gt=timezone.now()
                )
                verification.increment_attempts()
                
                remaining_attempts = verification.max_attempts - verification.attempts
                if remaining_attempts <= 0:
                    return Response({
                        'code': ['Превышено максимальное количество попыток. Запросите новый код.']
                    }, status=status.HTTP_400_BAD_REQUEST)
                serializer.errors['remaining_attempts'] = remaining_attempts
            except EmailVerification.DoesNotExist:
                pass
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

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

class UserMeView(APIView):
    def get(self, request):
        auth_header = request.headers.get('Authorization', '')
        
        if not auth_header.startswith('Token '):
            return Response({'detail': 'Неверный формат токена авторизации'}, status=status.HTTP_401_UNAUTHORIZED)
        
        token_key = auth_header.split(' ')[1]
        
        try:
            token = UserToken.objects.get(token=token_key, is_active=True)
            
            if not token.is_valid():
                token.is_active = False
                token.save()
                return Response({'detail': 'Токен просрочен'}, status=status.HTTP_401_UNAUTHORIZED)
            
            user = token.user
            return Response({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'is_staff': user.is_staff,
                'date_joined': user.date_joined
            }, status=status.HTTP_200_OK)
                
        except UserToken.DoesNotExist:
            return Response({'detail': 'Недействительный токен'}, status=status.HTTP_401_UNAUTHORIZED)
