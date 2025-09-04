from django.db import models
from django.contrib.auth.models import User
from tiendas.models import Tienda

class SesionCaja(models.Model):
    tienda = models.ForeignKey(Tienda, on_delete=models.CASCADE)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    apertura = models.DateTimeField(auto_now_add=True)
    efectivo_inicial = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    cierre = models.DateTimeField(null=True, blank=True)
    efectivo_final = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    notas = models.TextField(blank=True)
    abierta = models.BooleanField(default=True)

    def __str__(self):
        return f"Caja {self.tienda.nombre} {self.apertura:%Y-%m-%d}"
