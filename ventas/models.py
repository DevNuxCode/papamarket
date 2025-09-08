from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from productos.models import Producto
from clientes.models import Cliente
from tiendas.models import Tienda


class Venta(models.Model):
    METODO_PAGO_CHOICES = [
        ('efectivo', 'Efectivo'),
        ('tarjeta', 'Tarjeta'),
        ('credito', 'Crédito'),
    ]
    
    tienda = models.ForeignKey(Tienda, on_delete=models.CASCADE, related_name='ventas')
    vendedor = models.ForeignKey(User, on_delete=models.PROTECT, related_name='ventas_realizadas')
    cliente = models.ForeignKey(Cliente, null=True, blank=True, on_delete=models.SET_NULL, related_name='compras')
    fecha = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    metodo_pago = models.CharField(max_length=20, choices=METODO_PAGO_CHOICES, default="efectivo")
    recibido = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    vuelto = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    descuento_credito = models.DecimalField(max_digits=12, decimal_places=2, default=0, help_text="Monto descontado del crédito del cliente")
    
    class Meta:
        ordering = ['-fecha']
        permissions = [
            ("can_sell", "Puede realizar ventas"),
            ("view_own_sales", "Puede ver sus propias ventas"),
            ("view_own_purchases", "Puede ver sus propias compras"),
        ]

    def __str__(self):
        return f"Venta #{self.id} - {self.tienda.nombre} - {self.fecha.strftime('%d/%m/%Y %H:%M')}"
    
    def save(self, *args, **kwargs):
        # Calcular vuelto automáticamente
        if self.metodo_pago == 'efectivo':
            self.vuelto = max(0, float(self.recibido) - float(self.total))
        else:
            self.vuelto = 0
        super().save(*args, **kwargs)


class VentaItem(models.Model):
    venta = models.ForeignKey(Venta, on_delete=models.CASCADE, related_name="items")
    producto = models.ForeignKey(Producto, on_delete=models.PROTECT)
    cantidad = models.PositiveIntegerField(default=1)
    precio = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        unique_together = ['venta', 'producto']

    @property
    def subtotal(self):
        return self.cantidad * self.precio

    def __str__(self):
        return f"{self.cantidad} x {self.producto.nombre} - ${self.subtotal}"


class MovimientoCredito(models.Model):
    """Registra movimientos de crédito de clientes"""
    TIPO_CHOICES = [
        ('compra', 'Compra'),
        ('recarga', 'Recarga'),
        ('devolucion', 'Devolución'),
    ]
    
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='movimientos_credito')
    venta = models.ForeignKey(Venta, on_delete=models.CASCADE, null=True, blank=True, related_name='movimientos_credito')
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    monto = models.DecimalField(max_digits=12, decimal_places=2)
    descripcion = models.CharField(max_length=200)
    fecha = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-fecha']
    
    def __str__(self):
        return f"{self.cliente.nombre} - {self.tipo} - ${self.monto}"