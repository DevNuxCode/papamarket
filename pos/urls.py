from django.contrib import admin
from django.urls import path, include
from core.views import dashboard

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', dashboard, name='dashboard'),
    path('accounts/', include('django.contrib.auth.urls')),
    path('tiendas/', include('tiendas.urls')),
    path('proveedores/', include('proveedores.urls')),
    path('productos/', include('productos.urls')),
    path('clientes/', include('clientes.urls')),
    path('ventas/', include('ventas.urls')),
    path('caja/', include('caja.urls')),
    path('creditos/', include('creditos.urls')),
    path('perfil/', include('perfil.urls')),
    
    
    
    
]
