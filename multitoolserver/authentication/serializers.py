from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import UserToken, EmailVerification
from django.core.mail import send_mail
from django.conf import settings

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(style={'input_type': 'password'})

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                raise serializers.ValidationError("Пользователь с таким email не найден")
            user = authenticate(username=user.username, password=password)
            if not user:
                raise serializers.ValidationError("Неверный пароль")

            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError("Требуются email и пароль")

class UserTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserToken
        fields = ['token', 'expires_at']

class UserRegistrationSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    password_confirm = serializers.CharField(write_only=True, style={'input_type': 'password'})
    first_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Пользователь с таким именем уже существует")
        return value
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Пользователь с таким email уже существует")
        return value
    
    def validate(self, attrs):
        password = attrs.get('password')
        password_confirm = attrs.get('password_confirm')
        
        if password != password_confirm:
            raise serializers.ValidationError({"password_confirm": "Пароли не совпадают"})
        
        if len(password) < 8:
            raise serializers.ValidationError({"password": "Пароль должен быть не менее 8 символов"})
        
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            is_active=False  
        )
        
        user.set_password(password)
        user.save()
        verification = EmailVerification.objects.create(
            user=user,
            email=user.email
        )
        self._send_verification_email(verification)
        return user
    def _send_verification_email(self, verification):
        subject = 'Подтверждение регистрации MultiTools'
        plain_message = f'Ваш код подтверждения: {verification.code}'
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [verification.email]
        
        # HTML версия письма
        html_message = f'''
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Подтверждение регистрации</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }}
                .container {{ border: 1px solid #ddd; border-radius: 5px; padding: 20px; background-color: #f9f9f9; }}
                .header {{ text-align: center; margin-bottom: 20px; }}
                .logo {{ font-size: 24px; font-weight: bold; color: #5046e5; }}
                .code {{ font-size: 32px; font-weight: bold; text-align: center; letter-spacing: 5px; margin: 30px 0; color: #5046e5; }}
                .footer {{ margin-top: 30px; font-size: 12px; color: #777; text-align: center; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">MultiTools</div>
                    <h2>Подтверждение регистрации</h2>
                </div>
                <p>Здравствуйте!</p>
                <p>Спасибо за регистрацию в MultiTools. Для подтверждения вашего email, введите следующий код на странице верификации:</p>
                <div class="code">{verification.code}</div>
                <p>Этот код действителен в течение 30 минут.</p>
                <p>Если вы не регистрировались в MultiTools, просто проигнорируйте это письмо.</p>
                <div class="footer">
                    &copy; 2025 MultiTools. Все права защищены.
                </div>
            </div>
        </body>
        </html>
        '''
        
        try:
            send_mail(subject, plain_message, from_email, recipient_list, html_message=html_message)
        except Exception as e:
            print(f"Ошибка отправки email: {e}")

class EmailVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6)
    def validate(self, attrs):
        email = attrs.get('email')
        code = attrs.get('code')
        try:
            verification = EmailVerification.objects.filter(
                email=email, 
                is_verified=False
            ).order_by('-created_at').first()
            
            if not verification:
                raise serializers.ValidationError({"email": "Код подтверждения не найден"})
            
            if not verification.is_valid():
                raise serializers.ValidationError({"code": "Код подтверждения истек. Запросите новый"})
            
            if verification.code != code:
                raise serializers.ValidationError({"code": "Неверный код подтверждения"})
            
            attrs['verification'] = verification
            return attrs
            
        except EmailVerification.DoesNotExist:
            raise serializers.ValidationError({"email": "Код подтверждения не найден"}) 