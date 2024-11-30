from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from .serializers import UserRegistrationSerializer


class UserRegistrationView(APIView):
    """
    View to register users based on roles:
    - Customer: Anyone can register.
    - Support: Only admins can register.
    - Admin: Only superuser can register via Django admin.
    """
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            user = serializer.save()
            token = Token.objects.get(user=user)
            return Response(
                {"message": "User registered successfully.", "token": token.key},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomAuthToken(ObtainAuthToken):
    """
    Custom login view that returns user-specific data.
    """
    def post(self, request):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        token, created = Token.objects.get_or_create(user=user)
        return Response(
            {
                "token": token.key,
                "user_id": user.user_id,
                "username": user.username,
                "role": user.role,
            }
        )


class UserProfileView(APIView):
    """
    View to retrieve user profile information.
    Available to authenticated users only.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response(
            {
                "user_id": user.user_id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": user.role,
                "date_joined": user.date_joined,
            }
        )


class SupportRegistrationView(APIView):
    """
    View to register customer support users.
    Only available to admin users.
    """
    permission_classes = [IsAuthenticated]

    # Check if user is an admin
    def has_permission(self, request):
        return request.user.role == "admin"

    def post(self, request):
        data = request.data
        data["role"] = "support"  # Force role to 'support'
        serializer = UserRegistrationSerializer(data=data, context={"request": request})
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {"message": "Customer Support registered successfully."},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
