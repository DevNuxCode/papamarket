from django.urls import path
from . import views

app_name = "ventas"

urlpatterns = [
    path("", views.pos_view, name="pos"),
    path("agregar-carrito/", views.agregar_al_carrito, name="agregar_carrito"),
    path("quitar-carrito/", views.quitar_del_carrito, name="quitar_carrito"),
    path("actualizar-cantidad/", views.actualizar_cantidad_carrito, name="actualizar_cantidad"),
    path("info-cliente/", views.obtener_info_cliente, name="info_cliente"),
    path("procesar-venta/", views.procesar_venta, name="procesar_venta"),
    path("ticket/<int:pk>/", views.ticket_view, name="ticket"),
    path("mis-ventas/", views.mis_ventas, name="mis_ventas"),
    path("mis-compras/", views.mis_compras, name="mis_compras"),
    path("reporte-vendedores/", views.reporte_ventas_vendedor, name="reporte_vendedores"),
    path("reporte-vendedores/<int:vendedor_id>/", views.reporte_ventas_vendedor, name="reporte_vendedor"),
]