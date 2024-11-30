from django.urls import path
from .views import UserRegistrationView, SupportRegistrationView, UserProfileView, CustomAuthToken

urlpatterns = [
    path("register/", UserRegistrationView.as_view(), name="customer_register"),
    path("login/", CustomAuthToken.as_view(), name="user_login"),
    path("profile/", UserProfileView.as_view(), name="user_profile"),
    path('support/register/', SupportRegistrationView.as_view(), name='support-register'),

]
