from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class AwakeView(APIView):
    def get(self, request):
        return Response({"message": "Server is awake"}, status=status.HTTP_200_OK)
