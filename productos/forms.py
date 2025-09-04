from django import forms
from .models import Producto
from core.forms_mixins import TailwindModelForm

class ProductoForm(TailwindModelForm):
    class Meta:
        model = Producto
        fields =  ['tienda','nombre','codigo','precio_compra','precio_venta','stock','stock_minimo',
                  'alto','ancho','largo','peso','imagen','proveedores']
