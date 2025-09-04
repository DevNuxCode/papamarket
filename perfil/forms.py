from django import forms
from .models import Perfil
from core.forms_mixins import TailwindModelForm

class PerfilForm(TailwindModelForm):
    class Meta:
        model = Perfil
        fields = ['user','rol','direccion','telefono']
        
   
        
