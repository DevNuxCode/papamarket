from django.contrib import admin
from .models import Cliente
@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ('id','nombre','tienda','tiene_credito','saldo_credito','limite_credito')
    list_filter = ('tienda','tiene_credito')
    search_fields = ('nombre','correo','telefono')
