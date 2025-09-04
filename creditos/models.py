from django.db import models
from clientes.models import Cliente

class MovimientoCredito(models.Model):
    TIPO = (('cargo','Cargo'),('abono','Abono'))
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='movimientos')
    monto = models.DecimalField(max_digits=12, decimal_places=2)
    tipo = models.CharField(max_length=10, choices=TIPO)
    creado = models.DateTimeField(auto_now_add=True)
    nota = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f"{self.cliente} {self.tipo} {self.monto}"
