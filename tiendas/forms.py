from django import forms
from .models import Tienda
from core.forms_mixins import TailwindModelForm

class TiendaForm(TailwindModelForm):
    class Meta:
        model = Tienda
        fields = ['nombre','rut','direccion','telefono','correo']
        
        
