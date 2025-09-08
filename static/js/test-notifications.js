/**
 * Script de prueba para el sistema de notificaciones
 * Ejecutar en la consola del navegador para probar todas las funciones
 */

// Función para probar todas las notificaciones
function testAllNotifications() {
    console.log('🧪 Iniciando pruebas del sistema de notificaciones...');
    
    // Esperar un poco entre cada notificación
    setTimeout(() => {
        console.log('✅ Probando notificación de éxito...');
        showSuccess('¡Prueba de éxito!');
    }, 100);
    
    setTimeout(() => {
        console.log('❌ Probando notificación de error...');
        showError('Prueba de error');
    }, 1000);
    
    setTimeout(() => {
        console.log('⚠️ Probando notificación de advertencia...');
        showWarning('Prueba de advertencia');
    }, 2000);
    
    setTimeout(() => {
        console.log('ℹ️ Probando notificación informativa...');
        showInfo('Prueba de información');
    }, 3000);
    
    setTimeout(() => {
        console.log('🎯 Probando notificación con duración personalizada...');
        showSuccess('Esta notificación dura 10 segundos', 10000);
    }, 4000);
    
    setTimeout(() => {
        console.log('🔄 Probando notificación permanente...');
        showInfo('Esta notificación es permanente (dura 0 = para siempre)', 0);
    }, 5000);
    
    setTimeout(() => {
        console.log('✅ Todas las pruebas completadas');
    }, 6000);
}

// Función para probar notificaciones del POS
function testPOSNotifications() {
    console.log('🛒 Probando notificaciones del POS...');
    
    setTimeout(() => {
        showSuccess('✅ Producto "Coca Cola" agregado al carrito', 3000);
    }, 100);
    
    setTimeout(() => {
        showError('❌ Stock insuficiente. Disponible: 5 unidades', 5000);
    }, 1000);
    
    setTimeout(() => {
        showSuccess('🎉 ¡Venta procesada exitosamente! Total: $150.00', 4000);
    }, 2000);
    
    setTimeout(() => {
        showInfo('🔍 3 producto(s) encontrado(s)', 2000);
    }, 3000);
    
    setTimeout(() => {
        showInfo('🧹 Carrito limpiado', 2000);
    }, 4000);
}

// Función para probar notificaciones de formularios
function testFormNotifications() {
    console.log('📝 Probando notificaciones de formularios...');
    
    setTimeout(() => {
        showSuccess('✅ Producto creado exitosamente', 4000);
    }, 100);
    
    setTimeout(() => {
        showWarning('⚠️ Por favor ingresa un email válido', 3000);
    }, 1000);
    
    setTimeout(() => {
        showError('❌ La imagen es demasiado grande. Máximo 5MB', 5000);
    }, 2000);
    
    setTimeout(() => {
        showSuccess('📷 Imagen seleccionada correctamente', 3000);
    }, 3000);
    
    setTimeout(() => {
        showInfo('💳 Campos de crédito habilitados', 2000);
    }, 4000);
}

// Función para limpiar todas las notificaciones
function clearAllNotifications() {
    console.log('🧹 Limpiando todas las notificaciones...');
    if (window.notifications) {
        notifications.clear();
    }
}

// Función para verificar el estado del sistema
function checkNotificationSystem() {
    console.log('🔍 Verificando estado del sistema de notificaciones...');
    
    console.log('✅ showSuccess:', typeof window.showSuccess);
    console.log('✅ showError:', typeof window.showError);
    console.log('✅ showWarning:', typeof window.showWarning);
    console.log('✅ showInfo:', typeof window.showInfo);
    console.log('✅ notifications:', window.notifications ? 'Inicializado' : 'No inicializado');
    
    const container = document.getElementById('notification-container');
    console.log('✅ Container:', container ? 'Existe' : 'No existe');
    
    if (container) {
        console.log('✅ Notificaciones activas:', container.children.length);
    }
}

// Hacer las funciones disponibles globalmente
window.testAllNotifications = testAllNotifications;
window.testPOSNotifications = testPOSNotifications;
window.testFormNotifications = testFormNotifications;
window.clearAllNotifications = clearAllNotifications;
window.checkNotificationSystem = checkNotificationSystem;

// Auto-ejecutar verificación del sistema cuando se carga
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        console.log('🚀 Sistema de notificaciones cargado. Usa las siguientes funciones para probar:');
        console.log('- testAllNotifications() - Probar todas las notificaciones');
        console.log('- testPOSNotifications() - Probar notificaciones del POS');
        console.log('- testFormNotifications() - Probar notificaciones de formularios');
        console.log('- clearAllNotifications() - Limpiar todas las notificaciones');
        console.log('- checkNotificationSystem() - Verificar estado del sistema');
    }, 1000);
});
