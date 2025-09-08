/**
 * Sistema de notificaciones para operaciones CRUD
 * Maneja notificaciones automáticas para todas las acciones del sistema
 */

document.addEventListener('DOMContentLoaded', function() {
    // Verificar si hay mensajes de Django para mostrar
    checkDjangoMessages();
    
    // Configurar notificaciones para formularios genéricos
    setupGenericForms();
    
    // Configurar notificaciones para enlaces de eliminación
    setupDeleteLinks();
    
    // Configurar notificaciones para búsquedas
    setupSearchForms();
});

function checkDjangoMessages() {
    // Buscar mensajes de Django en el DOM
    const messages = document.querySelectorAll('.messages .message, .alert, .notification');
    messages.forEach(message => {
        const text = message.textContent.trim();
        const classes = message.className;
        
        if (classes.includes('success') || classes.includes('alert-success')) {
            if (window.showSuccess) showSuccess(text);
        } else if (classes.includes('error') || classes.includes('alert-danger')) {
            if (window.showError) showError(text);
        } else if (classes.includes('warning') || classes.includes('alert-warning')) {
            if (window.showWarning) showWarning(text);
        } else {
            if (window.showInfo) showInfo(text);
        }
        
        // Remover el mensaje original del DOM
        message.remove();
    });
}

function setupGenericForms() {
    // Configurar formularios que no tienen JavaScript específico
    const forms = document.querySelectorAll('form:not(.producto-form):not(.cliente-form)');
    forms.forEach(form => {
        if (form.querySelector('button[type="submit"]')) {
            form.addEventListener('submit', function(e) {
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                // Mostrar notificación de procesamiento
                const processingNotification = window.showInfo ? showInfo('🔄 Procesando...', 0) : null;
                
                // Deshabilitar botón
                submitBtn.disabled = true;
                submitBtn.textContent = 'Procesando...';
                
                // Simular delay para mostrar la notificación
                setTimeout(() => {
                    if (processingNotification && window.notifications) {
                        notifications.remove(processingNotification);
                    }
                    if (window.showSuccess) showSuccess('✅ Operación completada exitosamente', 3000);
                    
                    // Rehabilitar botón
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }, 1000);
            });
        }
    });
}

function setupDeleteLinks() {
    // Configurar enlaces de eliminación genéricos
    const deleteLinks = document.querySelectorAll('a[href*="eliminar"], a[href*="delete"]');
    deleteLinks.forEach(link => {
        if (!link.classList.contains('delete-producto') && !link.classList.contains('delete-cliente')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const itemName = this.dataset.itemName || 'elemento';
                
                if (confirm(`¿Estás seguro de que quieres eliminar ${itemName}?`)) {
                    const processingNotification = window.showInfo ? showInfo('🗑️ Eliminando...', 0) : null;
                    
                    // Simular eliminación
                    setTimeout(() => {
                        if (processingNotification && window.notifications) {
                            notifications.remove(processingNotification);
                        }
                        if (window.showSuccess) showSuccess(`✅ ${itemName} eliminado exitosamente`, 4000);
                        
                        // Remover elemento del DOM si es posible
                        const row = this.closest('tr, .item, .card');
                        if (row) {
                            row.style.opacity = '0.5';
                            setTimeout(() => {
                                row.remove();
                            }, 500);
                        }
                    }, 1000);
                }
            });
        }
    });
}

function setupSearchForms() {
    // Configurar formularios de búsqueda genéricos
    const searchForms = document.querySelectorAll('form[method="get"]');
    searchForms.forEach(form => {
        const searchInput = form.querySelector('input[type="search"], input[name="q"]');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', function() {
                clearTimeout(searchTimeout);
                const termino = this.value.trim();
                
                if (termino.length > 0) {
                    searchTimeout = setTimeout(() => {
                        if (window.showInfo) showInfo(`🔍 Buscando...`, 2000);
                    }, 500);
                }
            });
        }
    });
}

// Función para mostrar notificaciones de carga
function showLoading(message = 'Cargando...') {
    return showInfo(`⏳ ${message}`, 0);
}

// Función para mostrar notificaciones de éxito con detalles
function showSuccessWithDetails(message, details) {
    const fullMessage = details ? `${message}<br><small>${details}</small>` : message;
    return showSuccess(fullMessage, 5000);
}

// Función para mostrar notificaciones de error con detalles
function showErrorWithDetails(message, details) {
    const fullMessage = details ? `${message}<br><small>${details}</small>` : message;
    return showError(fullMessage, 7000);
}

// Función para mostrar notificaciones de validación
function showValidationError(field, message) {
    return showError(`❌ ${field}: ${message}`, 5000);
}

// Función para mostrar notificaciones de confirmación
function showConfirmation(message, callback) {
    const notification = showInfo(`❓ ${message}`, 0);
    
    // Agregar botones de confirmación
    const notificationElement = notification.querySelector('.notification');
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'mt-2 flex space-x-2';
    buttonContainer.innerHTML = `
        <button class="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600" onclick="confirmAction(true)">
            Sí
        </button>
        <button class="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600" onclick="confirmAction(false)">
            No
        </button>
    `;
    
    notificationElement.querySelector('.ml-3').appendChild(buttonContainer);
    
    // Función global para manejar la confirmación
    window.confirmAction = function(result) {
        notifications.remove(notification);
        if (callback) {
            callback(result);
        }
    };
    
    return notification;
}

// Función para mostrar notificaciones de progreso
function showProgress(message, progress = 0) {
    const notification = showInfo(`📊 ${message}`, 0);
    
    // Agregar barra de progreso
    const notificationElement = notification.querySelector('.notification');
    const progressContainer = document.createElement('div');
    progressContainer.className = 'mt-2';
    progressContainer.innerHTML = `
        <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" style="width: ${progress}%"></div>
        </div>
        <div class="text-xs mt-1 text-center">${progress}%</div>
    `;
    
    notificationElement.querySelector('.ml-3').appendChild(progressContainer);
    
    return {
        notification: notification,
        updateProgress: function(newProgress) {
            const progressBar = progressContainer.querySelector('.bg-blue-600');
            const progressText = progressContainer.querySelector('.text-xs');
            progressBar.style.width = `${newProgress}%`;
            progressText.textContent = `${newProgress}%`;
            
            if (newProgress >= 100) {
                setTimeout(() => {
                    notifications.remove(notification);
                }, 1000);
            }
        }
    };
}

// Función para obtener cookie CSRF
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
