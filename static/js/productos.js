/**
 * JavaScript para formularios de productos
 * Maneja notificaciones y validaciones
 */

document.addEventListener('DOMContentLoaded', function() {
    // Verificar si estamos en una página de productos
    if (document.querySelector('.producto-form')) {
        initProductoForm();
    }
    
    // Verificar si estamos en la lista de productos
    if (document.querySelector('.productos-lista')) {
        initProductosLista();
    }
});

function initProductoForm() {
    const form = document.querySelector('.producto-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    const fileInput = form.querySelector('input[type="file"]');
    
    // Manejar envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const isEdit = form.dataset.isEdit === 'true';
        const action = isEdit ? 'actualizando' : 'creando';
        
        // Mostrar notificación de procesamiento
        const processingNotification = window.showInfo ? showInfo(`🔄 ${action} producto...`, 0) : null;
        
        // Deshabilitar botón de envío
        submitBtn.disabled = true;
        submitBtn.textContent = isEdit ? 'Actualizando...' : 'Creando...';
        
        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        })
        .then(response => {
            if (response.ok) {
                return response.text();
            }
            throw new Error('Error en la respuesta del servidor');
        })
        .then(data => {
            // Remover notificación de procesamiento
            if (processingNotification && window.notifications) {
                notifications.remove(processingNotification);
            }
            
            if (isEdit) {
                if (window.showSuccess) showSuccess('✅ Producto actualizado exitosamente', 4000);
            } else {
                if (window.showSuccess) showSuccess('✅ Producto creado exitosamente', 4000);
            }
            
            // Redirigir después de un breve delay
            setTimeout(() => {
                window.location.href = form.dataset.redirectUrl || '/productos/';
            }, 1500);
        })
        .catch(error => {
            console.error('Error:', error);
            if (processingNotification && window.notifications) {
                notifications.remove(processingNotification);
            }
            if (window.showError) showError('❌ Error al procesar el formulario', 5000);
            
            // Rehabilitar botón
            submitBtn.disabled = false;
            submitBtn.textContent = isEdit ? 'Actualizar' : 'Crear';
        });
    });
    
    // Manejar cambio de imagen
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Validar tipo de archivo
                if (!file.type.startsWith('image/')) {
                    if (window.showError) showError('❌ Por favor selecciona un archivo de imagen válido', 5000);
                    this.value = '';
                    return;
                }
                
                // Validar tamaño (máximo 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    if (window.showError) showError('❌ La imagen es demasiado grande. Máximo 5MB', 5000);
                    this.value = '';
                    return;
                }
                
                if (window.showSuccess) showSuccess('📷 Imagen seleccionada correctamente', 3000);
            }
        });
    }
}

function initProductosLista() {
    // Manejar eliminación de productos
    const deleteButtons = document.querySelectorAll('.delete-producto');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const productoId = this.dataset.productoId;
            const productoNombre = this.dataset.productoNombre;
            
            if (confirm(`¿Estás seguro de que quieres eliminar el producto "${productoNombre}"?`)) {
                const processingNotification = window.showInfo ? showInfo('🗑️ Eliminando producto...', 0) : null;
                
                fetch(this.href, {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': getCookie('csrftoken')
                    }
                })
                .then(response => {
                    if (response.ok) {
                        if (processingNotification && window.notifications) {
                            notifications.remove(processingNotification);
                        }
                        if (window.showSuccess) showSuccess(`✅ Producto "${productoNombre}" eliminado exitosamente`, 4000);
                        
                        // Remover la fila de la tabla
                        const row = this.closest('tr');
                        if (row) {
                            row.style.opacity = '0.5';
                            setTimeout(() => {
                                row.remove();
                            }, 500);
                        }
                    } else {
                        throw new Error('Error al eliminar');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    if (processingNotification && window.notifications) {
                        notifications.remove(processingNotification);
                    }
                    if (window.showError) showError('❌ Error al eliminar el producto', 5000);
                });
            }
        });
    });
    
    // Manejar búsqueda de productos
    const searchInput = document.querySelector('input[name="q"]');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const termino = this.value.trim();
            
            if (termino.length > 0) {
                searchTimeout = setTimeout(() => {
                    if (window.showInfo) showInfo(`🔍 Buscando productos...`, 2000);
                }, 500);
            }
        });
    }
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
