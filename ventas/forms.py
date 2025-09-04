from django import forms

class CheckoutForm(forms.Form):
    tienda_id = forms.IntegerField(widget=forms.HiddenInput)
    metodo_pago = forms.ChoiceField(choices=(('efectivo','Efectivo'),('tarjeta','Tarjeta')))
    recibido = forms.DecimalField(min_value=0, decimal_places=2, max_digits=12, initial=0)
