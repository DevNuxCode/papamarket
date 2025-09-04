from django.contrib import admin
from .models import SesionCaja
@admin.register(SesionCaja)
class SesionCajaAdmin(admin.ModelAdmin):
    list_display = ('id','tienda','usuario','apertura','abierta')
    list_filter = ('tienda','abierta')
