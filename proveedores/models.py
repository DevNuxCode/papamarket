from django.db import models
from tiendas.models import Tienda

class Proveedor(models.Model):
    tienda = models.ForeignKey(Tienda, on_delete=models.CASCADE, related_name='proveedores')
    nombre = models.CharField(max_length=150)
    rut = models.CharField(max_length=20, blank=True)
    telefono = models.CharField(max_length=30, blank=True)
    correo = models.EmailField(blank=True)

    def __str__(self):
        return self.nombre
