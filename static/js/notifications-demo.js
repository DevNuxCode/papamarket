/**
 * Demo del sistema de notificaciones
 * Este archivo muestra ejemplos de cómo usar todas las funciones disponibles
 */

// Ejemplos de uso del sistema de notificaciones
function demoNotifications() {
    // Notificaciones básicas
    showSuccess('¡Operación exitosa!');
    showError('Error al procesar la solicitud');
    showWarning('Advertencia: Verifica los datos');
    showInfo('Información importante');
    
    // Notificaciones con duración personalizada
    showSuccess('Mensaje que dura 10 segundos', 10000);
    showError('Error crítico (permanente)', 0);
    
    // Notificaciones con detalles
    showSuccessWithDetails('Venta procesada', 'Total: $150.00 - Cliente: Juan Pérez');
    showErrorWithDetails('Error de validación', 'El campo "email" es requerido');
    
    // Notificaciones de validación
    showValidationError('Email', 'Formato de email inválido');
    showValidationError('Teléfono', 'Debe contener solo números');
    
    // Notificación de confirmación
    showConfirmation('¿Estás seguro de eliminar este elemento?', function(result) {
        if (result) {
            showSuccess('Elemento eliminado');
        } else {
            showInfo('Operación cancelada');
        }
    });
    
    // Notificación de progreso
    const progress = showProgress('Cargando datos...', 0);
    let currentProgress = 0;
    const interval = setInterval(() => {
        currentProgress += 10;
        progress.updateProgress(currentProgress);
        if (currentProgress >= 100) {
            clearInterval(interval);
        }
    }, 200);
}

// Ejemplos específicos para el POS
function demoPOSNotifications() {
    // Producto agregado al carrito
    showSuccess('✅ Producto "Coca Cola" agregado al carrito', 3000);
    
    // Producto sin stock
    showError('❌ Stock insuficiente. Disponible: 5 unidades', 5000);
    
    // Venta procesada
    showSuccess('🎉 ¡Venta procesada exitosamente! Total: $150.00', 4000);
    
    // Error de conexión
    showError('❌ Error de conexión al procesar la venta', 6000);
    
    // Búsqueda de productos
    showInfo('🔍 3 producto(s) encontrado(s)', 2000);
    showWarning('🔍 No se encontraron productos', 3000);
    
    // Carrito limpiado
    showInfo('🧹 Carrito limpiado', 2000);
}

// Ejemplos para formularios
function demoFormNotifications() {
    // Formulario enviado
    showSuccess('✅ Producto creado exitosamente', 4000);
    showSuccess('✅ Cliente actualizado exitosamente', 4000);
    
    // Error en formulario
    showError('❌ Error al procesar el formulario', 5000);
    
    // Validaciones
    showWarning('⚠️ Por favor ingresa un email válido', 3000);
    showError('❌ La imagen es demasiado grande. Máximo 5MB', 5000);
    
    // Imagen seleccionada
    showSuccess('📷 Imagen seleccionada correctamente', 3000);
    
    // Campos de crédito
    showInfo('💳 Campos de crédito habilitados', 2000);
    showInfo('💳 Campos de crédito deshabilitados', 2000);
}

// Ejemplos para operaciones CRUD
function demoCRUDNotifications() {
    // Eliminación
    showSuccess('✅ Producto "Laptop" eliminado exitosamente', 4000);
    showSuccess('✅ Cliente "Juan Pérez" eliminado exitosamente', 4000);
    
    // Búsqueda
    showInfo('🔍 Buscando productos...', 2000);
    showInfo('🔍 Buscando clientes...', 2000);
    
    // Procesamiento
    showInfo('🔄 Procesando...', 0);
    showInfo('🗑️ Eliminando producto...', 0);
    showInfo('🔄 Creando cliente...', 0);
    showInfo('🔄 Actualizando producto...', 0);
}

// Función para mostrar todos los ejemplos
function showAllNotificationExamples() {
    // Esperar un poco entre cada grupo de notificaciones
    setTimeout(() => demoNotifications(), 0);
    setTimeout(() => demoPOSNotifications(), 2000);
    setTimeout(() => demoFormNotifications(), 4000);
    setTimeout(() => demoCRUDNotifications(), 6000);
}

// Hacer las funciones disponibles globalmente para testing
window.demoNotifications = demoNotifications;
window.demoPOSNotifications = demoPOSNotifications;
window.demoFormNotifications = demoFormNotifications;
window.demoCRUDNotifications = demoCRUDNotifications;
window.showAllNotificationExamples = showAllNotificationExamples;
