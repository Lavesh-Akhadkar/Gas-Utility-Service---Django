from rest_framework.permissions import BasePermission

class IsCustomer(BasePermission):
    """
    Custom permission to only allow customers to access their own service requests.
    """
    def has_permission(self, request, view):
        return request.user.role == "customer"
    
class IsCustomerService(BasePermission):
    """
    Custom permission to allow only 'Customer Service' users to change the status of service requests.
    """
    def has_permission(self, request, view):
        return request.user.role == "support" or request.user.role == "admin"
    
class IsAdmin(BasePermission):
    """
    Custom permission to allow only 'Admin' users to access certain views.
    """
    def has_permission(self, request, view):
        return request.user.role == "admin"
