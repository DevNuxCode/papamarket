from django.db import models
from tiendas.models import Tienda
from proveedores.models import Proveedor

class Producto(models.Model):
    tienda = models.ForeignKey(Tienda, on_delete=models.CASCADE, related_name='productos')
    nombre = models.CharField(max_length=150)
    codigo = models.CharField(max_length=50, blank=True)
    precio_compra = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    precio_venta = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    stock = models.IntegerField(default=0)
    stock_minimo = models.IntegerField(default=0)
    alto = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    ancho = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    largo = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    peso = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    imagen = models.URLField(blank=True)
    proveedores = models.ManyToManyField(Proveedor, blank=True, related_name='productos')

    def __str__(self):
        return f"{self.nombre} ({self.tienda.nombre})"
