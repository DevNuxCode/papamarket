from django.db import models
from tiendas.models import Tienda

class Cliente(models.Model):
    tienda = models.ForeignKey(Tienda, on_delete=models.CASCADE, related_name='clientes')
    nombre = models.CharField(max_length=150)
    correo = models.EmailField(blank=True)
    telefono = models.CharField(max_length=30, blank=True)
    tiene_credito = models.BooleanField(default=False)
    limite_credito = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    saldo_credito = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    def __str__(self):
        return self.nombre
