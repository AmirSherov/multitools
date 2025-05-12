from django.urls import path
from .views import LoginView, VerifyTokenView, LogoutView, RegisterView, EmailVerificationView, ResendVerificationCodeView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-email/', EmailVerificationView.as_view(), name='verify-email'),
    path('resend-code/', ResendVerificationCodeView.as_view(), name='resend-code'),
    path('verify-token/', VerifyTokenView.as_view(), name='verify-token'),
    path('logout/', LogoutView.as_view(), name='logout'),
] 