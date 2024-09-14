from django.urls import path
from . import views

urlpatterns = [
    path('log-in/', views.log_in, name='log-in'),
    path('make-qr/', views.make_qr, name='make-qr'),
    path('get-user/<str:uid>/', views.get_user, name='get-user'),
    path('authenticate/', views.authenticate, name='authenticate'),
]
