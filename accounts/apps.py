from django.apps import AppConfig
class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'

    def ready(self):
        from django.contrib.auth.models import Group, Permission
        try:
            for g in ['Administrador', 'Vendedor', 'Cliente']:
                Group.objects.get_or_create(name=g)
        except Exception:
            # DB might not be ready during migrations
            pass
