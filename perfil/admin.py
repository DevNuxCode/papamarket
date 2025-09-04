from django.contrib import admin
from .models import Perfil
@admin.register(Perfil)
class PerfilAdmin(admin.ModelAdmin):
    list_display = ('user','rol','direccion','telefono')
    search_fields = ('user','rol')
