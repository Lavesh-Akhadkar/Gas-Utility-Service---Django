import uuid
from django.contrib.auth.models import AbstractUser, Group
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ("customer", "Customer"),
        ("support", "Customer Support"),
        ("admin", "Admin"),
    ]
    email = models.EmailField(unique=True)
    user_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="customer")
    date_joined = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        is_new = self._state.adding  # Check if the instance is new
        super().save(*args, **kwargs)

        if is_new:  # Assign groups only for new users
            if self.role == "customer":
                group_name = "Customer"
            elif self.role == "support":
                group_name = "Customer Service"
            elif self.role == "admin":
                group_name = "Admin"
            else:
                raise ValueError("Invalid role specified.")

            group, created = Group.objects.get_or_create(name=group_name)
            self.groups.add(group)

    def __str__(self):
        return f"{self.username} ({self.role})"
