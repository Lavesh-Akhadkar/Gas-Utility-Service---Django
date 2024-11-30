from rest_framework import serializers
from .models import ServiceRequest, StatusUpdate

class StatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = StatusUpdate
        fields = ['service_request','status', 'updated_at']
        read_only_fields = ['updated_at']  # Ensure `updated_at` is read-only

class ServiceRequestSerializer(serializers.ModelSerializer):
    status_updates = StatusUpdateSerializer(many=True, read_only=True)

    # Don't include customer_id in the serializer fields as it's automatically set in the view
    class Meta:
        model = ServiceRequest
        fields = ['request_id', 'title', 'description', 'status', 'request_type', 'image', 'created_at', 'status_updates']
        # Ensure customer_id is not required here since it's set by the view
        extra_kwargs = {
            'customer_id': {'required': False}
        }

