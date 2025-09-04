from django.contrib import admin
from .models import Proveedor
@admin.register(Proveedor)
class ProveedorAdmin(admin.ModelAdmin):
    list_display = ('id','nombre','tienda','rut')
    search_fields = ('nombre','rut')
    list_filter = ('tienda',)
