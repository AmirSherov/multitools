from rest_framework.views import APIView
from rest_framework.response import Response

class TestView(APIView):
    def get(self, request):
        return Response({"message": "Hello, World! bro it works"})

    def post(self, request):
        data = request.data.get("message")
        return Response({"message": "Hello post , World! bro it works", "data": data})
