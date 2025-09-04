from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from .models import Perfil
from perfil.forms import PerfilForm
from ventas.models import Venta
from django.shortcuts import render, redirect, get_object_or_404
from django.db import models

@login_required

def lista(request):
    qs = Perfil.objects.all()
    return render(request, "perfil/templates/lista.html", {"items": qs})
@login_required
def crear(request):
    if request.method == "POST":
        form = PerfilForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("perfil:lista")
    else:
        form = PerfilForm()
    return render(request, "perfil/templates/form.html", {"form": form})        

def editar_perfil(request, pk):
    obj = get_object_or_404(Perfil, pk=pk)
    if request.method == "POST":
        form = PerfilForm(request.POST, instance=obj)
        if form.is_valid():
            form.save()
            return redirect("perfil:lista")
    else:
        form = PerfilForm(instance=obj)
    return render(request, "perfil/templates/form.html", {"form": form})

def perfil(request):
    perfil = request.user.perfil
    context = {"perfil": perfil}

    if perfil.rol == "vendedor":
        ventas = Venta.objects.filter(vendedor=request.user)
        total = ventas.aggregate(models.Sum("total"))["total__sum"] or 0
        context.update({"ventas": ventas, "total_vendido": total})

    elif perfil.rol == "cliente":
        compras = Venta.objects.filter(cliente=request.user)
        context.update({"compras": compras})

    return render(request, "perfil/templates/perfil.html", context)