from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import ServiceRequest, StatusUpdate
from .serializers import ServiceRequestSerializer, StatusUpdateSerializer
from .permissions import IsCustomer, IsCustomerService, IsAdmin

# View to create a new service request (Only for Customers)
class ServiceRequestCreateView(APIView):
    permission_classes = [IsAuthenticated, IsCustomer]

    def post(self, request, *args, **kwargs):
        # Create the service request and associate it with the logged-in customer
        serializer = ServiceRequestSerializer(data=request.data)
        if serializer.is_valid():
            service_request = serializer.save(customer_id=request.user)
            return Response(ServiceRequestSerializer(service_request).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# View to get all service requests of the logged-in customer (Only their own)
class CustomerServiceRequestListView(APIView):
    permission_classes = [IsAuthenticated, IsCustomer]

    def get(self, request, *args, **kwargs):
        # Filter service requests to only show the logged-in user's service requests
        service_requests = ServiceRequest.objects.filter(customer_id=request.user)
        serializer = ServiceRequestSerializer(service_requests, many=True)
        return Response(serializer.data)
    
class ServiceRequestListView(APIView):
    permission_classes = [IsAuthenticated, IsCustomerService]

    def get(self, request, *args, **kwargs):
        # Get all service requests
        service_requests = ServiceRequest.objects.all()
        serializer = ServiceRequestSerializer(service_requests, many=True)
        return Response(serializer.data)

class StatusUpdateView(APIView):
    permission_classes = [IsAuthenticated, IsCustomerService]

    def post(self, request, *args, **kwargs):
        # Get the service request by its ID
        service_request_id = kwargs.get('pk')
        try:
            service_request = ServiceRequest.objects.get(request_id=service_request_id)
        except ServiceRequest.DoesNotExist:
            return Response({'detail': 'Service request not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Update the status of the service request
        new_status = request.data.get('status')
        if new_status:
            service_request.status = new_status
            service_request.save()  # Save the updated service request status

            # Optionally create a status update entry
            status_data = {
                'service_request': service_request.request_id,
                'status': new_status,
            }
            serializer = StatusUpdateSerializer(data=status_data)
            if serializer.is_valid():
                serializer.save()

            return Response({
                'detail': 'Status updated successfully.',
                'status': new_status
            }, status=status.HTTP_200_OK)

        return Response({'detail': 'Invalid status provided.'}, status=status.HTTP_400_BAD_REQUEST)

class ServiceRequestDeleteView(APIView):
    permission_classes = [IsAuthenticated, IsCustomer]

    def get(self, request, *args, **kwargs):
        # Get the service request ID from the URL parameters
        service_request_id = kwargs.get('pk')

        # Try to get the service request by its ID
        try:
            service_request = ServiceRequest.objects.get(request_id=service_request_id)
        except ServiceRequest.DoesNotExist:
            return Response({'detail': 'Service request not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Check if the service request belongs to the logged-in customer
        if service_request.customer_id != request.user:
            return Response({'detail': 'You do not have permission to delete this service request.'}, status=status.HTTP_403_FORBIDDEN)

        # Delete the service request
        service_request.delete()
        return Response({'detail': 'Service request deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)