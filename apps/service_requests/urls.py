from django.urls import path
from .views import (
    ServiceRequestCreateView,
    CustomerServiceRequestListView,
    ServiceRequestListView,
    StatusUpdateView,
    ServiceRequestDeleteView,
)
urlpatterns = [
    # Endpoint for creating a service request (Only for Customers)
    path('service_requests/', ServiceRequestCreateView.as_view(), name='service_request_create'),
    
    # Endpoint for getting the service requests of the logged-in customer (Only their own)
    path('service_requests/my_requests/', CustomerServiceRequestListView.as_view(), name='customer_service_request_list'),

    # Endpoint for listing all service requests (Only for Customer Service)
    path('service_requests/all/', ServiceRequestListView.as_view(), name='service_request_list'),

    # Endpoint for updating the status of a service request (Only for Customer Service)
    path('service_requests/<uuid:pk>/status_update/', StatusUpdateView.as_view(), name='status_update'),

    path('service_requests/<uuid:pk>/delete/', ServiceRequestDeleteView.as_view(), name='service_request_delete'),  # New delete endpoint

]
