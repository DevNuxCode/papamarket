from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.contrib.auth.models import Group

@login_required
def dashboard(request):
    # Si el usuario es vendedor, redirigir al POS
    if request.user.groups.filter(name='Vendedores').exists():
        return redirect('ventas:pos')
    
    # Si el usuario es cliente, redirigir a sus compras
    if request.user.groups.filter(name='Clientes').exists():
        return redirect('ventas:mis_compras')
    
    # Para otros usuarios (admin, etc.), mostrar dashboard normal
    return render(request, 'core/dashboard.html', {})
