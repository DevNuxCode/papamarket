/**
 * JavaScript para formularios de clientes
 * Maneja notificaciones y validaciones
 */

document.addEventListener('DOMContentLoaded', function() {
    // Verificar si estamos en una página de clientes
    if (document.querySelector('.cliente-form')) {
        initClienteForm();
    }
    
    // Verificar si estamos en la lista de clientes
    if (document.querySelector('.clientes-lista')) {
        initClientesLista();
    }
});

function initClienteForm() {
    const form = document.querySelector('.cliente-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Manejar envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const isEdit = form.dataset.isEdit === 'true';
        const action = isEdit ? 'actualizando' : 'creando';
        
        // Mostrar notificación de procesamiento
        const processingNotification = window.showInfo ? showInfo(`🔄 ${action} cliente...`, 0) : null;
        
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
                if (window.showSuccess) showSuccess('✅ Cliente actualizado exitosamente', 4000);
            } else {
                if (window.showSuccess) showSuccess('✅ Cliente creado exitosamente', 4000);
            }
            
            // Redirigir después de un breve delay
            setTimeout(() => {
                window.location.href = form.dataset.redirectUrl || '/clientes/';
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
    
    // Validar email en tiempo real
    const emailInput = form.querySelector('input[type="email"]');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const email = this.value.trim();
            if (email && !isValidEmail(email)) {
                if (window.showWarning) showWarning('⚠️ Por favor ingresa un email válido', 3000);
            }
        });
    }
    
    // Validar teléfono
    const telefonoInput = form.querySelector('input[name="telefono"]');
    if (telefonoInput) {
        telefonoInput.addEventListener('input', function() {
            // Solo permitir números, espacios, + y -
            this.value = this.value.replace(/[^0-9\s+\-]/g, '');
        });
    }
    
    // Manejar crédito
    const tieneCreditoCheckbox = form.querySelector('input[name="tiene_credito"]');
    const limiteCreditoField = form.querySelector('input[name="limite_credito"]');
    const saldoCreditoField = form.querySelector('input[name="saldo_credito"]');
    
    if (tieneCreditoCheckbox && limiteCreditoField) {
        function toggleCreditoFields() {
            if (tieneCreditoCheckbox.checked) {
                limiteCreditoField.closest('.field').style.display = 'block';
                if (saldoCreditoField) {
                    saldoCreditoField.closest('.field').style.display = 'block';
                }
                if (window.showInfo) showInfo('💳 Campos de crédito habilitados', 2000);
            } else {
                limiteCreditoField.closest('.field').style.display = 'none';
                if (saldoCreditoField) {
                    saldoCreditoField.closest('.field').style.display = 'none';
                }
                if (window.showInfo) showInfo('💳 Campos de crédito deshabilitados', 2000);
            }
        }
        
        tieneCreditoCheckbox.addEventListener('change', toggleCreditoFields);
        toggleCreditoFields(); // Ejecutar al cargar
    }
}

function initClientesLista() {
    // Manejar eliminación de clientes
    const deleteButtons = document.querySelectorAll('.delete-cliente');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const clienteId = this.dataset.clienteId;
            const clienteNombre = this.dataset.clienteNombre;
            
            if (confirm(`¿Estás seguro de que quieres eliminar el cliente "${clienteNombre}"?`)) {
                const processingNotification = window.showInfo ? showInfo('🗑️ Eliminando cliente...', 0) : null;
                
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
                        if (window.showSuccess) showSuccess(`✅ Cliente "${clienteNombre}" eliminado exitosamente`, 4000);
                        
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
                    if (window.showError) showError('❌ Error al eliminar el cliente', 5000);
                });
            }
        });
    });
    
    // Manejar búsqueda de clientes
    const searchInput = document.querySelector('input[name="q"]');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const termino = this.value.trim();
            
            if (termino.length > 0) {
                searchTimeout = setTimeout(() => {
                    if (window.showInfo) showInfo(`🔍 Buscando clientes...`, 2000);
                }, 500);
            }
        });
    }
    
    // Mostrar información de crédito
    const creditInfoButtons = document.querySelectorAll('.credit-info');
    creditInfoButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const saldo = this.dataset.saldo;
            const limite = this.dataset.limite;
            const nombre = this.dataset.nombre;
            
            if (window.showInfo) showInfo(`💳 ${nombre}<br>Saldo: $${saldo}<br>Límite: $${limite}`, 5000);
        });
    });
}

// Función para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
