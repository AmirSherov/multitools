from django.urls import path
from .views import YouTubeView, InstagramView
from .instagram import proxy_thumbnail

urlpatterns = [
    path('youtube/', YouTubeView.as_view(), name='youtube'),
    path('instagram/', InstagramView.as_view(), name='instagram'),
    path('instagram/thumbnail/', proxy_thumbnail, name='instagram-proxy-thumbnail'),
] 