from django.contrib import admin
from .models import Producto
@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('id','nombre','tienda','codigo','precio_venta','stock')
    search_fields = ('nombre','codigo')
    list_filter = ('tienda',)
