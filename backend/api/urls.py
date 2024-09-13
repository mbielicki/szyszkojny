from django.urls import path
from . import views

urlpatterns = [
    path('sign-up/', views.add_user, name='sign-up'),
    path('get-user/<str:uid>/', views.get_user, name='get-user'),
    path('authenticate/', views.authenticate, name='authenticate'),
]
