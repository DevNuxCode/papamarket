// Variables globales
let carrito = {};
let totalCarrito = 0;

// Elementos del DOM
const productosGrid = document.getElementById('productos-grid');
const carritoItems = document.getElementById('carrito-items');
const carritoVacio = document.getElementById('carrito-vacio');
const totalCarritoElement = document.getElementById('total-carrito');
const selectCliente = document.getElementById('select-cliente');
const infoCliente = document.getElementById('info-cliente');
const saldoDisponible = document.getElementById('saldo-disponible');
const efectivoRecibido = document.getElementById('efectivo-recibido');
const vuelto = document.getElementById('vuelto');
const efectivoSection = document.getElementById('efectivo-section');
const procesarVentaBtn = document.getElementById('procesar-venta');
const limpiarCarritoBtn = document.getElementById('limpiar-carrito');
const modalConfirmacion = document.getElementById('modal-confirmacion');
const resumenVenta = document.getElementById('resumen-venta');
const confirmarVentaBtn = document.getElementById('confirmar-venta');
const cancelarVentaBtn = document.getElementById('cancelar-venta');
const buscarProducto = document.getElementById('buscar-producto');

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    cargarCarrito();
    actualizarCarrito();
    configurarEventos();
});

function configurarEventos() {
    // Productos
    productosGrid.addEventListener('click', function(e) {
        const productoCard = e.target.closest('.producto-card');
        if (productoCard) {
            const productoId = productoCard.dataset.productoId;
            agregarAlCarrito(productoId);
        }
    });

    // Búsqueda de productos
    buscarProducto.addEventListener('input', function() {
        const termino = this.value.toLowerCase();
        const productos = document.querySelectorAll('.producto-card');
        let productosEncontrados = 0;
        
        productos.forEach(producto => {
            const nombre = producto.dataset.nombre.toLowerCase();
            if (nombre.includes(termino)) {
                producto.style.display = 'block';
                productosEncontrados++;
            } else {
                producto.style.display = 'none';
            }
        });
        
        // Mostrar notificación de búsqueda si hay término
        if (termino.length > 0) {
            if (productosEncontrados > 0) {
                showInfo(`🔍 ${productosEncontrados} producto(s) encontrado(s)`, 2000);
            } else {
                showWarning('🔍 No se encontraron productos', 3000);
            }
        }
    });

    // Cliente
    selectCliente.addEventListener('change', function() {
        const clienteId = this.value;
        if (clienteId) {
            obtenerInfoCliente(clienteId);
        } else {
            infoCliente.classList.add('hidden');
        }
    });

    // Método de pago
    document.querySelectorAll('input[name="metodo-pago"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'efectivo') {
                efectivoSection.style.display = 'block';
            } else {
                efectivoSection.style.display = 'none';
            }
            actualizarVuelto();
        });
    });

    // Efectivo recibido
    efectivoRecibido.addEventListener('input', actualizarVuelto);

    // Botones
    procesarVentaBtn.addEventListener('click', mostrarModalConfirmacion);
    limpiarCarritoBtn.addEventListener('click', limpiarCarrito);
    confirmarVentaBtn.addEventListener('click', procesarVenta);
    cancelarVentaBtn.addEventListener('click', function() {
        modalConfirmacion.classList.add('hidden');
    });
}

function agregarAlCarrito(productoId) {
    // Mostrar notificación de carga
    const loadingNotification = showInfo('Agregando producto al carrito...', 0);
    
    fetch('/ventas/agregar-carrito/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            producto_id: productoId,
            cantidad: 1
        })
    })
    .then(response => response.json())
    .then(data => {
        // Remover notificación de carga
        notifications.remove(loadingNotification);
        
        if (data.success) {
            carrito = data.carrito;
            actualizarCarrito();
            showSuccess(`✅ ${data.message}`, 3000);
        } else {
            showError(`❌ ${data.message}`, 5000);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        notifications.remove(loadingNotification);
        showError('❌ Error de conexión al agregar producto', 5000);
    });
}

function quitarDelCarrito(productoId) {
    fetch('/ventas/quitar-carrito/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            producto_id: productoId
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            carrito = data.carrito;
            actualizarCarrito();
            showWarning(`🗑️ ${data.message}`, 3000);
        } else {
            showError(`❌ ${data.message}`, 5000);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showError('❌ Error de conexión al quitar producto', 5000);
    });
}

function actualizarCantidad(productoId, cantidad) {
    if (cantidad <= 0) {
        quitarDelCarrito(productoId);
        return;
    }

    fetch('/ventas/actualizar-cantidad/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            producto_id: productoId,
            cantidad: cantidad
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            carrito = data.carrito;
            actualizarCarrito();
        } else {
            mostrarMensaje(data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarMensaje('Error al actualizar cantidad', 'error');
    });
}

function obtenerInfoCliente(clienteId) {
    fetch('/ventas/info-cliente/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            cliente_id: clienteId
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.cliente) {
            saldoDisponible.textContent = data.cliente.saldo_credito.toFixed(2);
            infoCliente.classList.remove('hidden');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function actualizarCarrito() {
    if (Object.keys(carrito).length === 0) {
        carritoVacio.style.display = 'block';
        carritoItems.innerHTML = '<div class="text-center text-gray-500 py-4" id="carrito-vacio">Carrito vacío</div>';
        totalCarrito = 0;
        procesarVentaBtn.disabled = true;
    } else {
        carritoVacio.style.display = 'none';
        carritoItems.innerHTML = '';
        totalCarrito = 0;

        Object.entries(carrito).forEach(([productoId, item]) => {
            const subtotal = item.cantidad * item.precio;
            totalCarrito += subtotal;

            const itemElement = document.createElement('div');
            itemElement.className = 'flex items-center justify-between p-2 bg-gray-50 rounded';
            itemElement.innerHTML = `
                <div class="flex-1">
                    <p class="font-medium text-sm">${item.nombre}</p>
                    <p class="text-xs text-gray-500">$${item.precio.toFixed(2)} c/u</p>
                </div>
                <div class="flex items-center space-x-2">
                    <button onclick="actualizarCantidad('${productoId}', ${item.cantidad - 1})" 
                            class="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-sm">-</button>
                    <span class="w-8 text-center">${item.cantidad}</span>
                    <button onclick="actualizarCantidad('${productoId}', ${item.cantidad + 1})" 
                            class="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-sm">+</button>
                    <button onclick="quitarDelCarrito('${productoId}')" 
                            class="ml-2 text-red-600 hover:text-red-800">×</button>
                </div>
                <div class="text-right">
                    <p class="font-semibold">$${subtotal.toFixed(2)}</p>
                </div>
            `;
            carritoItems.appendChild(itemElement);
        });

        procesarVentaBtn.disabled = false;
    }

    totalCarritoElement.textContent = `$${totalCarrito.toFixed(2)}`;
    actualizarVuelto();
}

function actualizarVuelto() {
    const metodoPago = document.querySelector('input[name="metodo-pago"]:checked').value;
    const recibido = parseFloat(efectivoRecibido.value) || 0;
    
    if (metodoPago === 'efectivo' && recibido > 0) {
        const vueltoCalculado = Math.max(0, recibido - totalCarrito);
        vuelto.textContent = vueltoCalculado.toFixed(2);
    } else {
        vuelto.textContent = '0.00';
    }
}

function mostrarModalConfirmacion() {
    const metodoPago = document.querySelector('input[name="metodo-pago"]:checked').value;
    const clienteId = selectCliente.value;
    const clienteNombre = selectCliente.options[selectCliente.selectedIndex].text;
    const recibido = parseFloat(efectivoRecibido.value) || 0;
    const vueltoCalculado = Math.max(0, recibido - totalCarrito);

    let resumen = `
        <div class="space-y-2">
            <p><strong>Total:</strong> $${totalCarrito.toFixed(2)}</p>
            <p><strong>Método de pago:</strong> ${metodoPago}</p>
    `;

    if (clienteId) {
        resumen += `<p><strong>Cliente:</strong> ${clienteNombre}</p>`;
    }

    if (metodoPago === 'efectivo') {
        resumen += `
            <p><strong>Recibido:</strong> $${recibido.toFixed(2)}</p>
            <p><strong>Vuelto:</strong> $${vueltoCalculado.toFixed(2)}</p>
        `;
    }

    resumen += '</div>';

    resumenVenta.innerHTML = resumen;
    modalConfirmacion.classList.remove('hidden');
}

function procesarVenta() {
    const metodoPago = document.querySelector('input[name="metodo-pago"]:checked').value;
    const clienteId = selectCliente.value;
    const recibido = parseFloat(efectivoRecibido.value) || 0;

    // Mostrar notificación de procesamiento
    const processingNotification = showInfo('🔄 Procesando venta...', 0);

    fetch('/ventas/procesar-venta/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            cliente_id: clienteId,
            metodo_pago: metodoPago,
            recibido: recibido,
            carrito: carrito
        })
    })
    .then(response => response.json())
    .then(data => {
        // Remover notificación de procesamiento
        notifications.remove(processingNotification);
        
        if (data.success) {
            showSuccess(`🎉 ¡Venta procesada exitosamente! Total: $${data.total}`, 4000);
            limpiarCarrito();
            modalConfirmacion.classList.add('hidden');
            
            // Redirigir al ticket después de un breve delay
            setTimeout(() => {
                window.location.href = `/ventas/ticket/${data.venta_id}/`;
            }, 1500);
        } else {
            showError(`❌ ${data.message}`, 6000);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        notifications.remove(processingNotification);
        showError('❌ Error de conexión al procesar la venta', 6000);
    });
}

function limpiarCarrito() {
    carrito = {};
    cargarCarrito();
    actualizarCarrito();
    selectCliente.value = '';
    infoCliente.classList.add('hidden');
    efectivoRecibido.value = '';
    document.querySelector('input[name="metodo-pago"][value="efectivo"]').checked = true;
    efectivoSection.style.display = 'block';
    showInfo('🧹 Carrito limpiado', 2000);
}

function cargarCarrito() {
    // Cargar carrito desde la sesión si existe
    // Esto se puede implementar con una llamada AJAX adicional si es necesario
}

function mostrarMensaje(mensaje, tipo) {
    // Usar el sistema de notificaciones
    switch(tipo) {
        case 'success':
            showSuccess(mensaje);
            break;
        case 'error':
            showError(mensaje);
            break;
        case 'warning':
            showWarning(mensaje);
            break;
        default:
            showInfo(mensaje);
    }
}

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
