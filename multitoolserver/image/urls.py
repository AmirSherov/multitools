from django.urls import path
from .views import RemoveBackgroundView

urlpatterns = [
    path('removebg/', RemoveBackgroundView.as_view(), name='remove-background'),
] 