from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from django.http import JsonResponse
from django.contrib import messages
from django.contrib.auth.models import User
from .models import Venta, VentaItem, MovimientoCredito
from productos.models import Producto
from clientes.models import Cliente
from tiendas.models import Tienda
from django.db import transaction, models
from django.contrib.auth.decorators import login_required, permission_required
from django.db.models import Sum, Q, Count, Avg
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal
import json


@login_required
@permission_required('ventas.can_sell', raise_exception=True)
def pos_view(request):
    # Obtener tienda del usuario (asumiendo que el usuario tiene una tienda asignada)
    try:
        tienda = Tienda.objects.filter(owner=request.user).first()
        if not tienda:
            messages.error(request, "No tienes una tienda asignada.")
            return redirect('dashboard')
    except:
        messages.error(request, "Error al obtener la tienda.")
        return redirect('dashboard')
    
    # Productos disponibles (con stock > 0)
    productos = Producto.objects.filter(tienda=tienda, stock__gt=0).select_related('tienda')
    
    # Clientes de la tienda
    clientes = Cliente.objects.filter(tienda=tienda, tiene_credito=True)
    
    # Estadísticas del día
    hoy = timezone.now().date()
    ventas_hoy = Venta.objects.filter(
        tienda=tienda, 
        fecha__date=hoy,
        vendedor=request.user
    )
    
    total_ventas_hoy = ventas_hoy.aggregate(Sum("total"))["total__sum"] or 0
    cantidad_ventas_hoy = ventas_hoy.count()
    
    # Últimas ventas del vendedor
    ultimas_ventas = Venta.objects.filter(
        tienda=tienda,
        vendedor=request.user
    ).order_by("-fecha")[:5]

    return render(request, "ventas/pos.html", {
        "productos": productos,
        "clientes": clientes,
        "tienda": tienda,
        "ultimas_ventas": ultimas_ventas,
        "total_ventas_hoy": total_ventas_hoy,
        "cantidad_ventas_hoy": cantidad_ventas_hoy,
    })


@login_required
def agregar_al_carrito(request):
    """Agregar producto al carrito via AJAX"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            producto_id = data.get('producto_id')
            cantidad = int(data.get('cantidad', 1))
            
            producto = get_object_or_404(Producto, id=producto_id)
            
            # Verificar stock
            if producto.stock < cantidad:
                return JsonResponse({
                    'success': False,
                    'message': f'Stock insuficiente. Disponible: {producto.stock}'
                })
            
            # Obtener carrito de la sesión
            carrito = request.session.get('carrito', {})
            
            if producto_id in carrito:
                carrito[producto_id]['cantidad'] += cantidad
            else:
                carrito[producto_id] = {
                    'cantidad': cantidad,
                    'precio': float(producto.precio_venta),
                    'nombre': producto.nombre,
                    'stock': producto.stock
                }
            
            request.session['carrito'] = carrito
            
            return JsonResponse({
                'success': True,
                'message': f'{producto.nombre} agregado al carrito',
                'carrito': carrito
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error: {str(e)}'
            })
    
    return JsonResponse({'success': False, 'message': 'Método no permitido'})


@login_required
def quitar_del_carrito(request):
    """Quitar producto del carrito via AJAX"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            producto_id = data.get('producto_id')
            
            carrito = request.session.get('carrito', {})
            
            if producto_id in carrito:
                del carrito[producto_id]
                request.session['carrito'] = carrito
                
                return JsonResponse({
                    'success': True,
                    'message': 'Producto eliminado del carrito',
                    'carrito': carrito
                })
            else:
                return JsonResponse({
                    'success': False,
                    'message': 'Producto no encontrado en el carrito'
                })
                
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error: {str(e)}'
            })
    
    return JsonResponse({'success': False, 'message': 'Método no permitido'})


@login_required
def actualizar_cantidad_carrito(request):
    """Actualizar cantidad de producto en el carrito via AJAX"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            producto_id = data.get('producto_id')
            cantidad = int(data.get('cantidad', 1))
            
            producto = get_object_or_404(Producto, id=producto_id)
            
            # Verificar stock
            if producto.stock < cantidad:
                return JsonResponse({
                    'success': False,
                    'message': f'Stock insuficiente. Disponible: {producto.stock}'
                })
            
            carrito = request.session.get('carrito', {})
            
            if producto_id in carrito:
                carrito[producto_id]['cantidad'] = cantidad
                request.session['carrito'] = carrito
                
                return JsonResponse({
                    'success': True,
                    'message': 'Cantidad actualizada',
                    'carrito': carrito
                })
            else:
                return JsonResponse({
                    'success': False,
                    'message': 'Producto no encontrado en el carrito'
                })
                
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error: {str(e)}'
            })
    
    return JsonResponse({'success': False, 'message': 'Método no permitido'})


@login_required
def obtener_info_cliente(request):
    """Obtener información del cliente via AJAX"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            cliente_id = data.get('cliente_id')
            
            if cliente_id:
                cliente = get_object_or_404(Cliente, id=cliente_id)
                return JsonResponse({
                    'success': True,
                    'cliente': {
                        'id': cliente.id,
                        'nombre': cliente.nombre,
                        'saldo_credito': float(cliente.saldo_credito),
                        'limite_credito': float(cliente.limite_credito),
                        'tiene_credito': cliente.tiene_credito
                    }
                })
            else:
                return JsonResponse({
                    'success': True,
                    'cliente': None
                })
                
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error: {str(e)}'
            })
    
    return JsonResponse({'success': False, 'message': 'Método no permitido'})


@transaction.atomic
@login_required
@permission_required('ventas.can_sell', raise_exception=True)
def procesar_venta(request):
    """Procesar la venta completa"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Obtener datos de la venta
            cliente_id = data.get('cliente_id')
            metodo_pago = data.get('metodo_pago', 'efectivo')
            recibido = Decimal(str(data.get('recibido', 0)))
            carrito = data.get('carrito', {})
            
            # Obtener tienda del usuario
            tienda = Tienda.objects.filter(owner=request.user).first()
            if not tienda:
                return JsonResponse({
                    'success': False,
                    'message': 'No tienes una tienda asignada'
                })
            
            # Obtener cliente si se especificó
            cliente = None
            if cliente_id:
                cliente = get_object_or_404(Cliente, id=cliente_id, tienda=tienda)
            
            # Validar carrito
            if not carrito:
                return JsonResponse({
                    'success': False,
                    'message': 'El carrito está vacío'
                })
            
            # Calcular total y validar stock
            total = Decimal('0')
            for producto_id, item in carrito.items():
                producto = get_object_or_404(Producto, id=producto_id, tienda=tienda)
                cantidad = int(item['cantidad'])
                
                if producto.stock < cantidad:
                    return JsonResponse({
                        'success': False,
                        'message': f'Stock insuficiente para {producto.nombre}. Disponible: {producto.stock}'
                    })
                
                total += Decimal(str(item['precio'])) * cantidad
            
            # Validar método de pago
            if metodo_pago == 'credito':
                if not cliente or not cliente.tiene_credito:
                    return JsonResponse({
                        'success': False,
                        'message': 'Cliente no tiene crédito habilitado'
                    })
                
                if cliente.saldo_credito < total:
                    return JsonResponse({
                        'success': False,
                        'message': f'Saldo insuficiente. Disponible: ${cliente.saldo_credito}'
                    })
            elif metodo_pago == 'efectivo':
                if recibido < total:
                    return JsonResponse({
                        'success': False,
                        'message': f'Dinero insuficiente. Faltan: ${total - recibido}'
                    })
            
            # Crear la venta
            venta = Venta.objects.create(
                tienda=tienda,
                vendedor=request.user,
                cliente=cliente,
                metodo_pago=metodo_pago,
                recibido=recibido,
                total=total
            )
            
            # Crear items de la venta y actualizar stock
            descuento_credito = Decimal('0')
            for producto_id, item in carrito.items():
                producto = Producto.objects.get(id=producto_id)
                cantidad = int(item['cantidad'])
                precio = Decimal(str(item['precio']))
                
                VentaItem.objects.create(
                    venta=venta,
                    producto=producto,
                    cantidad=cantidad,
                    precio=precio
                )
                
                # Actualizar stock
                producto.stock -= cantidad
                producto.save()
            
            # Manejar crédito si aplica
            if metodo_pago == 'credito' and cliente:
                descuento_credito = total
                cliente.saldo_credito -= descuento_credito
                cliente.save()
                
                # Registrar movimiento de crédito
                MovimientoCredito.objects.create(
                    cliente=cliente,
                    venta=venta,
                    tipo='compra',
                    monto=-descuento_credito,
                    descripcion=f'Compra #{venta.id}'
                )
            
            venta.descuento_credito = descuento_credito
            venta.save()
            
            # Limpiar carrito
            request.session['carrito'] = {}
            
            return JsonResponse({
                'success': True,
                'message': 'Venta procesada exitosamente',
                'venta_id': venta.id,
                'total': float(total),
                'vuelto': float(venta.vuelto)
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error al procesar la venta: {str(e)}'
            })
    
    return JsonResponse({'success': False, 'message': 'Método no permitido'})


@login_required
def ticket_view(request, pk):
    venta = get_object_or_404(Venta, pk=pk)
    return render(request, "ventas/ticket.html", {"venta": venta})


@login_required
@permission_required('ventas.view_own_sales', raise_exception=True)
def mis_ventas(request):
    """Ventas realizadas por el vendedor actual"""
    ventas = Venta.objects.filter(vendedor=request.user).order_by('-fecha')
    
    # Filtros
    fecha_desde = request.GET.get('fecha_desde')
    fecha_hasta = request.GET.get('fecha_hasta')
    
    if fecha_desde:
        ventas = ventas.filter(fecha__date__gte=fecha_desde)
    if fecha_hasta:
        ventas = ventas.filter(fecha__date__lte=fecha_hasta)
    
    # Estadísticas
    total_ventas = ventas.aggregate(Sum('total'))['total__sum'] or 0
    cantidad_ventas = ventas.count()
    
    # Ventas por método de pago
    ventas_por_metodo = ventas.values('metodo_pago').annotate(
        total=Sum('total'),
        cantidad=models.Count('id')
    )
    
    context = {
        'ventas': ventas[:50],  # Limitar a 50 para rendimiento
        'total_ventas': total_ventas,
        'cantidad_ventas': cantidad_ventas,
        'ventas_por_metodo': ventas_por_metodo,
        'fecha_desde': fecha_desde,
        'fecha_hasta': fecha_hasta,
    }
    
    return render(request, 'ventas/mis_ventas.html', context)


@login_required
@permission_required('ventas.view_own_purchases', raise_exception=True)
def mis_compras(request):
    """Compras realizadas por el cliente actual"""
    # Asumiendo que el cliente está vinculado al usuario
    try:
        cliente = Cliente.objects.get(user=request.user)
        compras = Venta.objects.filter(cliente=cliente).order_by('-fecha')
        
        # Filtros
        fecha_desde = request.GET.get('fecha_desde')
        fecha_hasta = request.GET.get('fecha_hasta')
        
        if fecha_desde:
            compras = compras.filter(fecha__date__gte=fecha_desde)
        if fecha_hasta:
            compras = compras.filter(fecha__date__lte=fecha_hasta)
        
        # Estadísticas
        total_compras = compras.aggregate(Sum('total'))['total__sum'] or 0
        cantidad_compras = compras.count()
        
        # Movimientos de crédito
        movimientos = MovimientoCredito.objects.filter(cliente=cliente).order_by('-fecha')
        
        context = {
            'cliente': cliente,
            'compras': compras[:50],
            'total_compras': total_compras,
            'cantidad_compras': cantidad_compras,
            'movimientos': movimientos[:20],
            'fecha_desde': fecha_desde,
            'fecha_hasta': fecha_hasta,
        }
        
        return render(request, 'ventas/mis_compras.html', context)
        
    except Cliente.DoesNotExist:
        messages.error(request, "No tienes un perfil de cliente asociado.")
        return redirect('dashboard')


@login_required
def reporte_ventas_vendedor(request, vendedor_id=None):
    """Reporte de ventas por vendedor (solo para administradores)"""
    if not request.user.is_staff:
        messages.error(request, "No tienes permisos para ver este reporte.")
        return redirect('dashboard')
    
    # Si no se especifica vendedor, mostrar todos
    if vendedor_id:
        vendedor = get_object_or_404(User, id=vendedor_id)
        ventas = Venta.objects.filter(vendedor=vendedor)
    else:
        vendedor = None
        ventas = Venta.objects.all()
    
    # Filtros
    fecha_desde = request.GET.get('fecha_desde')
    fecha_hasta = request.GET.get('fecha_hasta')
    
    if fecha_desde:
        ventas = ventas.filter(fecha__date__gte=fecha_desde)
    if fecha_hasta:
        ventas = ventas.filter(fecha__date__lte=fecha_hasta)
    
    # Estadísticas por vendedor
    ventas_por_vendedor = ventas.values('vendedor__username', 'vendedor__first_name', 'vendedor__last_name').annotate(
        total_ventas=Sum('total'),
        cantidad_ventas=models.Count('id'),
        promedio_venta=models.Avg('total')
    ).order_by('-total_ventas')
    
    context = {
        'vendedor': vendedor,
        'ventas_por_vendedor': ventas_por_vendedor,
        'fecha_desde': fecha_desde,
        'fecha_hasta': fecha_hasta,
    }
    
    return render(request, 'ventas/reporte_ventas_vendedor.html', context)
