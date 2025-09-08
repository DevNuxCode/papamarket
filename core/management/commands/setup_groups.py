from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from ventas.models import Venta, VentaItem
from productos.models import Producto
from clientes.models import Cliente
from tiendas.models import Tienda


class Command(BaseCommand):
    help = 'Crea grupos de usuarios y asigna permisos'

    def handle(self, *args, **options):
        # Crear grupos
        vendedores_group, created = Group.objects.get_or_create(name='Vendedores')
        clientes_group, created = Group.objects.get_or_create(name='Clientes')
        
        # Obtener content types
        venta_ct = ContentType.objects.get_for_model(Venta)
        venta_item_ct = ContentType.objects.get_for_model(VentaItem)
        producto_ct = ContentType.objects.get_for_model(Producto)
        cliente_ct = ContentType.objects.get_for_model(Cliente)
        tienda_ct = ContentType.objects.get_for_model(Tienda)
        
        # Permisos para vendedores
        vendedor_permissions = [
            Permission.objects.get_or_create(
                codename='can_sell',
                name='Puede realizar ventas',
                content_type=venta_ct
            )[0],
            Permission.objects.get_or_create(
                codename='view_own_sales',
                name='Puede ver sus propias ventas',
                content_type=venta_ct
            )[0],
            Permission.objects.get_or_create(
                codename='view_products',
                name='Puede ver productos',
                content_type=producto_ct
            )[0],
            Permission.objects.get_or_create(
                codename='view_clients',
                name='Puede ver clientes',
                content_type=cliente_ct
            )[0],
        ]
        
        # Permisos para clientes
        cliente_permissions = [
            Permission.objects.get_or_create(
                codename='view_own_purchases',
                name='Puede ver sus propias compras',
                content_type=venta_ct
            )[0],
            Permission.objects.get_or_create(
                codename='view_own_credit',
                name='Puede ver su saldo de crédito',
                content_type=cliente_ct
            )[0],
        ]
        
        # Asignar permisos a grupos
        vendedores_group.permissions.set(vendedor_permissions)
        clientes_group.permissions.set(cliente_permissions)
        
        self.stdout.write(
            self.style.SUCCESS('Grupos y permisos creados exitosamente')
        )
