from django.db import models
from django.contrib.auth.models import User

class Tienda(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mis_tiendas')
    nombre = models.CharField(max_length=120)
    rut = models.CharField(max_length=20, blank=True)
    direccion = models.CharField(max_length=200, blank=True)
    telefono = models.CharField(max_length=30, blank=True)
    correo = models.EmailField(blank=True)

    class Meta:
        verbose_name = 'Tienda'
        verbose_name_plural = 'Tiendas'

    def __str__(self):
        return self.nombre
