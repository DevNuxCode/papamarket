# Generated manually for vendedor field and other improvements

from django.db import migrations, models
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('ventas', '0002_rename_creado_venta_fecha_remove_venta_vendedor_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='venta',
            name='vendedor',
            field=models.ForeignKey(
                default=1,  # Temporal, se debe ajustar manualmente
                on_delete=models.PROTECT,
                related_name='ventas_realizadas',
                to=settings.AUTH_USER_MODEL
            ),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='venta',
            name='descuento_credito',
            field=models.DecimalField(
                decimal_places=2,
                default=0,
                help_text='Monto descontado del crédito del cliente',
                max_digits=12
            ),
        ),
        migrations.AlterField(
            model_name='venta',
            name='metodo_pago',
            field=models.CharField(
                choices=[
                    ('efectivo', 'Efectivo'),
                    ('tarjeta', 'Tarjeta'),
                    ('credito', 'Crédito')
                ],
                default='efectivo',
                max_length=20
            ),
        ),
        migrations.AlterField(
            model_name='venta',
            name='recibido',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=12),
        ),
        migrations.AlterField(
            model_name='venta',
            name='total',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=12),
        ),
        migrations.AlterField(
            model_name='venta',
            name='vuelto',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=12),
        ),
        migrations.AlterField(
            model_name='ventaitem',
            name='precio',
            field=models.DecimalField(decimal_places=2, max_digits=12),
        ),
        migrations.AlterUniqueTogether(
            name='ventaitem',
            unique_together={('venta', 'producto')},
        ),
    ]
