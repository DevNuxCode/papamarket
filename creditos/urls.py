from django.urls import path
from . import views
app_name = 'creditos'
urlpatterns = [
    path('', views.panel, name='panel'),
]
