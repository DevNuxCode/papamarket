from django.urls import path
from . import views

app_name = "ventas"

urlpatterns = [
    path("", views.pos_view, name="pos"),
    path("checkout/", views.checkout, name="checkout"),
    path("ticket/<int:pk>/", views.ticket_view, name="ticket"),
]