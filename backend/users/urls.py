from .views import SignupView, UsersListView, dashboard, profile_view, change_password_view
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.urls import path
urlpatterns = [
    path("signup/", SignupView.as_view(), name="signup"),
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("users/", UsersListView.as_view(), name="users_list"),
    path("dashboard/", dashboard, name="dashboard"),

    path("profile/", profile_view, name="profile"),
    path("change-password/", change_password_view, name="change_password"),
]