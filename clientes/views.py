from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, get_object_or_404
from .models import Cliente
from .forms import ClienteForm

@login_required
def lista(request):
    qs = Cliente.objects.filter(tienda__owner=request.user).select_related('tienda')
    return render(request, 'clientes/lista.html', {'items': qs})

@login_required
def crear(request):
    if request.method=='POST':
        form = ClienteForm(request.POST)
        if form.is_valid() and form.cleaned_data['tienda'].owner == request.user:
            form.save()
            return redirect('clientes:lista')
    else:
        form = ClienteForm()
        form.fields['tienda'].queryset = form.fields['tienda'].queryset.filter(owner=request.user)
    return render(request, 'clientes/form.html', {'form': form})

@login_required
def editar(request, pk):
    obj = get_object_or_404(Cliente, pk=pk, tienda__owner=request.user)
    if request.method=='POST':
        form = ClienteForm(request.POST, instance=obj)
        if form.is_valid():
            form.save()
            return redirect('clientes:lista')
    else:
        form = ClienteForm(instance=obj)
        form.fields['tienda'].queryset = form.fields['tienda'].queryset.filter(owner=request.user)
    return render(request, 'clientes/form.html', {'form': form})

@login_required
def eliminar(request, pk):
    obj = get_object_or_404(Cliente, pk=pk, tienda__owner=request.user)
    if request.method=='POST':
        obj.delete()
        return redirect('clientes:lista')
    return render(request, 'clientes/confirm_delete.html', {'obj': obj})
