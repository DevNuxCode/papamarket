from django import forms
from .models import Producto
from core.forms_mixins import TailwindModelForm

class ProductoForm(TailwindModelForm):
    class Meta:
        model = Producto
        fields =  ['tienda','nombre','codigo','precio_compra','precio_venta','stock','stock_minimo',
                  'alto','ancho','largo','peso','imagen','proveedores']
        widgets = {
            'imagen': forms.FileInput(attrs={
                'class': 'block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100',
                'accept': 'image/*'
            })
        }
