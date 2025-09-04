from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, get_object_or_404
from .models import Proveedor
from .forms import ProveedorForm

@login_required
def lista(request):
    qs = Proveedor.objects.filter(tienda__owner=request.user).select_related('tienda')
    return render(request, 'proveedores/lista.html', {'items': qs})

@login_required
def crear(request):
    if request.method=='POST':
        form = ProveedorForm(request.POST)
        if form.is_valid() and form.cleaned_data['tienda'].owner == request.user:
            form.save()
            return redirect('proveedores:lista')
    else:
        form = ProveedorForm()
        form.fields['tienda'].queryset = form.fields['tienda'].queryset.filter(owner=request.user)
    return render(request, 'proveedores/form.html', {'form': form})

@login_required
def editar(request, pk):
    obj = get_object_or_404(Proveedor, pk=pk, tienda__owner=request.user)
    if request.method=='POST':
        form = ProveedorForm(request.POST, instance=obj)
        if form.is_valid():
            form.save()
            return redirect('proveedores:lista')
    else:
        form = ProveedorForm(instance=obj)
        form.fields['tienda'].queryset = form.fields['tienda'].queryset.filter(owner=request.user)
    return render(request, 'proveedores/form.html', {'form': form})

@login_required
def eliminar(request, pk):
    obj = get_object_or_404(Proveedor, pk=pk, tienda__owner=request.user)
    if request.method=='POST':
        obj.delete()
        return redirect('proveedores:lista')
    return render(request, 'proveedores/confirm_delete.html', {'obj': obj})
