from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, get_object_or_404
from .models import Producto
from .forms import ProductoForm

@login_required
def lista(request):
    qs = Producto.objects.filter(tienda__owner=request.user).select_related('tienda')
    q = request.GET.get('q')
    if q:
        qs = qs.filter(nombre__icontains=q)
    return render(request, 'productos/lista.html', {'items': qs})

@login_required
def crear(request):
    if request.method=='POST':
        form = ProductoForm(request.POST, request.FILES)
        if form.is_valid() and form.cleaned_data['tienda'].owner == request.user:
            form.save()
            return redirect('productos:lista')
    else:
        form = ProductoForm()
        form.fields['tienda'].queryset = form.fields['tienda'].queryset.filter(owner=request.user)
    return render(request, 'productos/form.html', {'form': form})

@login_required
def editar(request, pk):
    obj = get_object_or_404(Producto, pk=pk, tienda__owner=request.user)
    if request.method=='POST':
        form = ProductoForm(request.POST, request.FILES, instance=obj)
        if form.is_valid():
            form.save()
            return redirect('productos:lista')
    else:
        form = ProductoForm(instance=obj)
        form.fields['tienda'].queryset = form.fields['tienda'].queryset.filter(owner=request.user)
    return render(request, 'productos/form.html', {'form': form, 'producto': obj})

@login_required
def eliminar(request, pk):
    obj = get_object_or_404(Producto, pk=pk, tienda__owner=request.user)
    if request.method=='POST':
        obj.delete()
        return redirect('productos:lista')
    return render(request, 'productos/confirm_delete.html', {'obj': obj})
