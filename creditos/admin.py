from django.contrib import admin
from .models import MovimientoCredito
@admin.register(MovimientoCredito)
class MovimientoCreditoAdmin(admin.ModelAdmin):
    list_display = ('id','cliente','tipo','monto','creado')
    list_filter = ('tipo',)
