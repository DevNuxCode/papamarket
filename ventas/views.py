from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from .models import Venta, VentaItem
from productos.models import Producto
from clientes.models import Cliente
from tiendas.models import Tienda
from django.db import transaction
from django.contrib.auth.decorators import login_required
from django.db.models import Sum
from django.utils import timezone
from datetime import timedelta


@login_required
def pos_view(request):
    # Últimas 10 ventas
    ultimas_ventas = Venta.objects.order_by("-fecha")[:10]
    productos = Producto.objects.all()

    # Fechas de referencia
    hoy = timezone.now().date()
    inicio_semana = hoy - timedelta(days=hoy.weekday())  # lunes
    inicio_mes = hoy.replace(day=1)

    # Totales de ventas
    ventas_dia = Venta.objects.filter(fecha__date=hoy).aggregate(Sum("total"))["total__sum"] or 0
    ventas_semana = Venta.objects.filter(fecha__date__gte=inicio_semana).aggregate(Sum("total"))["total__sum"] or 0
    ventas_mes = Venta.objects.filter(fecha__date__gte=inicio_mes).aggregate(Sum("total"))["total__sum"] or 0

    return render(request, "ventas/pos.html", {
        "productos": productos,
        "ultimas_ventas": ultimas_ventas,
        "ventas_dia": ventas_dia,
        "ventas_semana": ventas_semana,
        "ventas_mes": ventas_mes,
    })


@transaction.atomic
@login_required
def checkout(request):
    if request.method == "POST":
        tienda = Tienda.objects.first()  # luego se filtra según usuario logueado
        cliente_id = request.POST.get("cliente")
        cliente = Cliente.objects.filter(id=cliente_id).first() if cliente_id else None

        venta = Venta.objects.create(
            tienda=tienda,
            cliente=cliente,
            metodo_pago=request.POST.get("metodo_pago", "efectivo"),
            recibido=request.POST.get("recibido", 0) or 0,
        )

        total = 0
        carrito = request.session.get("carrito", {})

        for pid, item in carrito.items():
            producto = Producto.objects.get(id=pid)
            cantidad = int(item["cantidad"])
            precio = producto.precio_venta
            VentaItem.objects.create(
                venta=venta,
                producto=producto,
                cantidad=cantidad,
                precio=precio,
            )
            producto.stock -= cantidad
            producto.save()
            total += cantidad * precio

        venta.total = total
        venta.vuelto = float(venta.recibido) - float(total)
        venta.save()

        request.session["carrito"] = {}  # limpiar carrito

        return redirect(reverse("ventas:ticket", args=[venta.id]))

    return redirect("ventas:pos")


@login_required
def ticket_view(request, pk):
    venta = get_object_or_404(Venta, pk=pk)
    return render(request, "ventas/ticket.html", {"venta": venta})
