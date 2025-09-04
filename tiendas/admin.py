from django.contrib import admin
from .models import Tienda
@admin.register(Tienda)
class TiendaAdmin(admin.ModelAdmin):
    list_display = ('id','nombre','owner','rut')
    search_fields = ('nombre','rut')
