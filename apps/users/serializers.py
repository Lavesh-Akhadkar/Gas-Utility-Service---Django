from rest_framework import serializers
from .models import User
from rest_framework.authtoken.models import Token

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, default="customer")

    class Meta:
        model = User
        fields = ["user_id", "username", "email", "password", "first_name", "last_name", "role"]

    def create(self, validated_data):
        role = validated_data.get("role", "customer")

        if role == "admin":
            raise serializers.ValidationError("Admin users can only be created by a superuser.")
        elif role == "support" and not self.context["request"].user.role == "admin":
            raise serializers.ValidationError("Only admins can create customer support users.")

        user = User(
            username=validated_data["username"],
            email=validated_data["email"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            role=role,
        )
        user.set_password(validated_data["password"])
        user.save()
        Token.objects.create(user=user)  # Automatically create token
        return user

class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = ["key"]
