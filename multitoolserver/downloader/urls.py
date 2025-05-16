from django.urls import path
from .views import  InstagramView
from .instagram import proxy_thumbnail

urlpatterns = [
    path('instagram/', InstagramView.as_view(), name='instagram'),
    path('instagram/thumbnail/', proxy_thumbnail, name='instagram-proxy-thumbnail'),
] 