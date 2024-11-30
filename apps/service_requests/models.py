from django.db import models
from apps.users.models import User
import uuid


class ServiceRequest(models.Model):
    class Status(models.TextChoices):
        CREATED = 'Created', 'Created'
        IN_PROGRESS = 'Inprogress', 'In Progress'
        RESOLVED = 'Resolved', 'Resolved'   

    class RequestType(models.TextChoices):
        INSTALLATION = 'Installation', 'Installation'
        REPAIR = 'Repair', 'Repair'
        MAINTENANCE = 'Maintenance', 'Maintenance'
        BILLING_ISSUE = 'Billing Issue', 'Billing Issue'

    
    request_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    customer_id = models.ForeignKey(User, to_field="user_id", on_delete=models.CASCADE)
    status = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.CREATED
    )
    request_type = models.CharField(
        max_length=20,
        choices=RequestType.choices,
        default=RequestType.INSTALLATION
    )
    image = models.ImageField(upload_to='service_images/', null=True, blank=True)  # Adjusted the upload_to path

    def __str__(self):
        return self.title


class StatusUpdate(models.Model):
    service_request = models.ForeignKey(ServiceRequest, related_name='status_updates', on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=ServiceRequest.Status.choices)
    updated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.service_request.title} - {self.status} at {self.updated_at}"
