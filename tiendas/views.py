from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, get_object_or_404
from .models import Tienda
from .forms import TiendaForm

@login_required
def lista(request):
    qs = Tienda.objects.filter(owner=request.user)
    return render(request, 'tiendas/lista.html', {'items': qs})

@login_required
def crear(request):
    if request.method=='POST':
        form = TiendaForm(request.POST)
        if form.is_valid():
            obj = form.save(commit=False)
            obj.owner = request.user
            obj.save()
            return redirect('tiendas:lista')
    else:
        form = TiendaForm()
    return render(request, 'tiendas/form.html', {'form': form})

@login_required
def editar(request, pk):
    obj = get_object_or_404(Tienda, pk=pk, owner=request.user)
    if request.method=='POST':
        form = TiendaForm(request.POST, instance=obj)
        if form.is_valid():
            form.save()
            return redirect('tiendas:lista')
    else:
        form = TiendaForm(instance=obj)
    return render(request, 'tiendas/form.html', {'form': form})

@login_required
def eliminar(request, pk):
    obj = get_object_or_404(Tienda, pk=pk, owner=request.user)
    if request.method=='POST':
        obj.delete()
        return redirect('tiendas:lista')
    return render(request, 'tiendas/confirm_delete.html', {'obj': obj})
