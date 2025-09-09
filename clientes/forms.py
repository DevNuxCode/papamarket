from django import forms
from .models import Cliente
from core.forms_mixins import TailwindModelForm

class ClienteForm(TailwindModelForm):
    class Meta:
        model = Cliente
        fields = ['tienda','nombre','correo','telefono','tiene_credito','limite_credito', 'saldo_credito']
