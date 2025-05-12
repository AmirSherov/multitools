from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import secrets
import datetime
import random

# Create your models here.

class UserToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tokens')
    token = models.CharField(max_length=64, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_active = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        if not self.token:
            self.token = secrets.token_hex(32)  # 64 символа в hex-виде
        if not self.expires_at:
            self.expires_at = timezone.now() + datetime.timedelta(days=1)
        super().save(*args, **kwargs)

    def is_valid(self):
        return self.is_active and timezone.now() < self.expires_at

    def __str__(self):
        return f"Token {self.token[:8]}... для {self.user.username}"

class EmailVerification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='email_verifications')
    email = models.EmailField()
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_verified = models.BooleanField(default=False)
    
    def save(self, *args, **kwargs):
        if not self.code:
            self.code = ''.join(random.choices('0123456789', k=6))
        if not self.expires_at:
            self.expires_at = timezone.now() + datetime.timedelta(minutes=30)
        super().save(*args, **kwargs)
    
    def is_valid(self):
        return not self.is_verified and timezone.now() < self.expires_at
    
    def __str__(self):
        return f"Код подтверждения для {self.email} {'(подтвержден)' if self.is_verified else '(не подтвержден)'}"
