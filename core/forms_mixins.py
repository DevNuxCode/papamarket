from django import forms

class TailwindModelForm(forms.ModelForm):
    """
    Base ModelForm que aplica estilos de Tailwind automáticamente.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for visible in self.visible_fields():
            visible.field.widget.attrs['class'] = (
                'w-full rounded-md border-gray-900 shadow-sm data-theme '
                'focus:ring-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 '
                'dark:bg-gray-900 dark:text-black dark:border-red-600 alirn-center p-2 m-1 center pl-100'
            )
            visible.field.widget.attrs['placeholder'] = visible.field.label