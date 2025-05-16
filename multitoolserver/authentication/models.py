from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import secrets
import datetime
import random
import uuid
import string
from datetime import timedelta
from django.core.exceptions import ValidationError
from django.db.models import JSONField

# Create your models here.

class LoginAttempt(models.Model):
    """Модель для отслеживания попыток входа для защиты от брутфорс-атак"""
    ip_address = models.GenericIPAddressField()
    username = models.CharField(max_length=150, blank=True)
    successful = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    @classmethod
    def get_login_attempts(cls, ip_address, username=None, minutes=30):
        """Получает количество попыток входа за указанный период времени"""
        time_threshold = timezone.now() - timedelta(minutes=minutes)
        
        if username:
            return cls.objects.filter(
                ip_address=ip_address,
                username=username,
                timestamp__gt=time_threshold
            ).count()
        
        return cls.objects.filter(
            ip_address=ip_address,
            timestamp__gt=time_threshold
        ).count()
    
    @classmethod
    def is_ip_blocked(cls, ip_address, max_attempts=5, minutes=30):
        """Проверяет, заблокирован ли IP из-за слишком большого количества попыток входа"""
        attempts = cls.get_login_attempts(ip_address, minutes=minutes)
        return attempts >= max_attempts

    @classmethod
    def is_user_blocked(cls, ip_address, username, max_attempts=5, minutes=30):
        """Проверяет, заблокирован ли пользователь из-за слишком большого количества попыток входа"""
        attempts = cls.get_login_attempts(ip_address, username, minutes=minutes)
        return attempts >= max_attempts

    def __str__(self):
        status = "Успешно" if self.successful else "Неудачно"
        return f"{self.username} - {self.ip_address} - {status}"

class UserToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=64, unique=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    last_used_at = models.DateTimeField(auto_now=True)
    user_agent = models.CharField(max_length=512, blank=True, null=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    
    def save(self, *args, **kwargs):
        if not self.token:
            self.token = self.generate_token()
        
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(days=1)
            
        super().save(*args, **kwargs)
    
    def generate_token(self):
        return uuid.uuid4().hex
    
    def is_valid(self):
        return self.is_active and timezone.now() < self.expires_at
    
    def refresh(self):
        """Обновляет срок действия токена"""
        self.expires_at = timezone.now() + timedelta(days=1)
        self.save()
    
    def __str__(self):
        return f"{self.user.username} - {self.token[:8]}... - {'Активен' if self.is_active else 'Неактивен'}"

class EmailVerification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    email = models.EmailField()
    code = models.CharField(max_length=6, editable=False)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    attempts = models.IntegerField(default=0)
    max_attempts = models.IntegerField(default=5)
    
    def save(self, *args, **kwargs):
        if not self.code:
            self.code = self.generate_code()
        
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(hours=24)
            
        super().save(*args, **kwargs)
    
    def generate_code(self):
        return ''.join(random.choices(string.digits, k=6))
    
    def is_valid(self):
        if self.is_verified:
            return False
        
        if self.attempts >= self.max_attempts:
            return False
            
        if timezone.now() > self.expires_at:
            return False
            
        return True
    
    def increment_attempts(self):
        """Увеличивает счетчик попыток верификации"""
        self.attempts += 1
        self.save()
    
    def __str__(self):
        return f"{self.user.username} - {self.email} - {'Подтвержден' if self.is_verified else 'Не подтвержден'}"

class UserStats(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='stats')
    total_requests = models.PositiveIntegerField(default=0)
    last_tool = models.CharField(max_length=100, blank=True)
    last_active = models.DateTimeField(null=True, blank=True)
    top_tools = JSONField(default=dict, blank=True)  # {'tool_name': count, ...}

    def update_tool(self, tool_name):
        self.last_tool = tool_name
        self.last_active = timezone.now()
        self.total_requests += 1
        if not self.top_tools:
            self.top_tools = {}
        self.top_tools[tool_name] = self.top_tools.get(tool_name, 0) + 1
        self.save()

    def get_top3(self):
        if not self.top_tools:
            return []
        return sorted(self.top_tools.items(), key=lambda x: -x[1])[:3]

    def __str__(self):
        return f"Статистика {self.user.username}"
