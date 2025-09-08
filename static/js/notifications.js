/**
 * Sistema de Notificaciones Emergentes
 * Muestra notificaciones tipo toast para todas las acciones del sistema
 */

class NotificationSystem {
    constructor() {
        this.container = null;
        this.notifications = [];
        this.init();
    }

    init() {
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.init();
            });
            return;
        }
        
        // Crear contenedor de notificaciones si no existe
        if (!document.getElementById('notification-container')) {
            this.createContainer();
        }
        this.container = document.getElementById('notification-container');
    }

    createContainer() {
        // Verificar que document.body existe
        if (!document.body) {
            // Si no existe, esperar a que el DOM esté listo
            document.addEventListener('DOMContentLoaded', () => {
                this.createContainer();
            });
            return;
        }
        
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'fixed top-4 right-4 z-50 space-y-2';
        document.body.appendChild(container);
    }

    /**
     * Mostrar notificación
     * @param {string} message - Mensaje a mostrar
     * @param {string} type - Tipo: success, error, warning, info
     * @param {number} duration - Duración en ms (0 = permanente)
     */
    show(message, type = 'info', duration = 5000) {
        // Asegurar que el contenedor existe
        if (!this.container) {
            this.init();
            if (!this.container) {
                console.error('No se pudo crear el contenedor de notificaciones');
                return null;
            }
        }
        
        const notification = this.createNotification(message, type);
        this.container.appendChild(notification);
        this.notifications.push(notification);

        // Animar entrada
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Auto-remover si tiene duración
        if (duration > 0) {
            setTimeout(() => {
                this.remove(notification);
            }, duration);
        }

        return notification;
    }

    createNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} transform translate-x-full opacity-0 transition-all duration-300 ease-in-out`;
        
        // Iconos por tipo
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        // Colores por tipo
        const colors = {
            success: 'bg-green-500 border-green-600',
            error: 'bg-red-500 border-red-600',
            warning: 'bg-yellow-500 border-yellow-600',
            info: 'bg-blue-500 border-blue-600'
        };

        notification.innerHTML = `
            <div class="flex items-center p-4 rounded-lg shadow-lg border-l-4 ${colors[type]} text-white min-w-80 max-w-96">
                <div class="flex-shrink-0">
                    <div class="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-lg font-bold">
                        ${icons[type]}
                    </div>
                </div>
                <div class="ml-3 flex-1">
                    <p class="text-sm font-medium">${message}</p>
                </div>
                <div class="ml-4 flex-shrink-0">
                    <button class="inline-flex text-white hover:text-gray-200 focus:outline-none" onclick="notifications.remove(this.closest('.notification'))">
                        <span class="sr-only">Cerrar</span>
                        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        `;

        return notification;
    }

    remove(notification) {
        if (notification && notification.parentNode) {
            notification.classList.remove('show');
            notification.classList.add('hide');
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
                // Remover de la lista
                const index = this.notifications.indexOf(notification);
                if (index > -1) {
                    this.notifications.splice(index, 1);
                }
            }, 300);
        }
    }

    clear() {
        this.notifications.forEach(notification => {
            this.remove(notification);
        });
    }

    // Métodos de conveniencia
    success(message, duration = 5000) {
        return this.show(message, 'success', duration);
    }

    error(message, duration = 7000) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration = 6000) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration = 5000) {
        return this.show(message, 'info', duration);
    }
}

// Instancia global - inicializar cuando el DOM esté listo
let notifications = null;

// Función para inicializar el sistema de notificaciones
function initNotificationSystem() {
    if (!notifications) {
        notifications = new NotificationSystem();
    }
    return notifications;
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNotificationSystem);
} else {
    initNotificationSystem();
}

// Métodos globales para uso fácil - con verificación de inicialización
window.showNotification = (message, type, duration) => {
    const notif = initNotificationSystem();
    return notif ? notif.show(message, type, duration) : null;
};
window.showSuccess = (message, duration) => {
    const notif = initNotificationSystem();
    return notif ? notif.success(message, duration) : null;
};
window.showError = (message, duration) => {
    const notif = initNotificationSystem();
    return notif ? notif.error(message, duration) : null;
};
window.showWarning = (message, duration) => {
    const notif = initNotificationSystem();
    return notif ? notif.warning(message, duration) : null;
};
window.showInfo = (message, duration) => {
    const notif = initNotificationSystem();
    return notif ? notif.info(message, duration) : null;
};

// CSS adicional para animaciones
const style = document.createElement('style');
style.textContent = `
    .notification {
        transform: translateX(100%);
        opacity: 0;
    }
    
    .notification.show {
        transform: translateX(0);
        opacity: 1;
    }
    
    .notification.hide {
        transform: translateX(100%);
        opacity: 0;
    }
    
    .notification-success {
        background: linear-gradient(135deg, #10b981, #059669);
    }
    
    .notification-error {
        background: linear-gradient(135deg, #ef4444, #dc2626);
    }
    
    .notification-warning {
        background: linear-gradient(135deg, #f59e0b, #d97706);
    }
    
    .notification-info {
        background: linear-gradient(135deg, #3b82f6, #2563eb);
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
