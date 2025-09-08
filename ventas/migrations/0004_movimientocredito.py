# Generated manually for MovimientoCredito model

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('ventas', '0003_alter_venta_vendedor'),
        ('clientes', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='MovimientoCredito',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tipo', models.CharField(choices=[('compra', 'Compra'), ('recarga', 'Recarga'), ('devolucion', 'Devolución')], max_length=20)),
                ('monto', models.DecimalField(decimal_places=2, max_digits=12)),
                ('descripcion', models.CharField(max_length=200)),
                ('fecha', models.DateTimeField(auto_now_add=True)),
                ('cliente', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='movimientos_credito', to='clientes.cliente')),
                ('venta', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='movimientos_credito', to='ventas.venta')),
            ],
            options={
                'ordering': ['-fecha'],
            },
        ),
    ]
