// ==================== FUNCIONES DEL CABALLETE - MOVIMIENTO ARRIBA Y ABAJO ====================

// VARIABLE GLOBAL: Posición del caballete (0 = EXTENDIDO, 250 = RETRAÍDO)
let objectPosition = 0;

// ==================== CONTROLES DEL CABALLETE ====================

/**
 * Mueve el caballete HACIA ARRIBA (retrae) 10px por cada click
 * Limita el mínimo a 0px
 */
function moveObjectUp() {
    if (objectPosition > 0) {
        objectPosition -= 10;
        if (objectPosition < 0) objectPosition = 0;
        updateObjectPosition();
    }
}

/**
 * Mueve el caballete HACIA ABAJO (extiende) 10px por cada click
 * Limita el máximo a 250px
 */
function moveObjectDown() {
    if (objectPosition < 250) {
        objectPosition += 10;
        if (objectPosition > 250) objectPosition = 250;
        updateObjectPosition();
    }
}

/**
 * Establece la posición exacta del caballete mediante el slider
 * @param {number} value - Valor entre 0 y 250 pixels
 */
function setObjectPosition(value) {
    objectPosition = parseInt(value);
    updateObjectPosition();
}

/**
 * FUNCIÓN PRINCIPAL: Actualiza la posición visual y comprueba el estado del sensor
 * Sincroniza:
 * - El valor del slider
 * - La visualización de la posición
 * - El estado del motor y alarma
 */
function updateObjectPosition() {
    const slider = document.getElementById('objectSlider');
    const posDisplay = document.getElementById('positionDisplay');
    
    // Asegurarse que está dentro del rango permitido
    if (objectPosition < 0) objectPosition = 0;
    if (objectPosition > 250) objectPosition = 250;
    
    // Actualizar el slider y la pantalla de posición
    slider.value = objectPosition;
    posDisplay.textContent = `Pos: ${objectPosition}px`;
    
    // Comprobar el estado del sensor (motor/alarma)
    checkSensorStatus();
}

// ==================== DRAG AND DROP CON MOUSE ====================

let isDragging = false;
let dragStartY = 0;
let dragStartPosition = 0;

/**
 * Inicia el arrastre del caballete con el ratón
 * @param {event} e - Evento del mouse (mousedown)
 */
function startDrag(e) {
    isDragging = true;
    dragStartY = e.clientY;
    dragStartPosition = objectPosition;
    const kickstand = document.getElementById('kickstand');
    kickstand.style.cursor = 'grabbing';
}

/**
 * Realiza el arrastre del caballete mientras se mueve el ratón
 * @param {event} e - Evento del mouse (mousemove)
 */
function drag(e) {
    if (!isDragging) return;
    
    // Calcular la diferencia de pixeles movidos
    const deltaY = e.clientY - dragStartY;
    let newPosition = dragStartPosition + deltaY;
    
    // Limitar al rango 0-250px
    if (newPosition < 0) newPosition = 0;
    if (newPosition > 250) newPosition = 250;
    
    objectPosition = newPosition;
    updateObjectPosition();
}

/**
 * Finaliza el arrastre del caballete
 */
function stopDrag() {
    isDragging = false;
    const kickstand = document.getElementById('kickstand');
    kickstand.style.cursor = 'grab';
}

// ==================== LÓGICA DEL SENSOR ====================

/**
 * FUNCIÓN CRÍTICA: Verifica el estado del sensor y activa/desactiva motor y alarma
 * 
 * LÓGICA:
 * - Si caballete EXTENDIDO (0-30px): MOTOR ON ✓ + ALARMA OFF
 * - Si caballete RETRAÍDO (31-250px): MOTOR OFF + ALARMA ON 🚨
 */
function checkSensorStatus() {
    const machineLED = document.getElementById('machineLED');
    const alarmLED = document.getElementById('alarmLED');
    const kickstandState = document.getElementById('kickstandState');
    const motorState = document.getElementById('motorState');
    const alarmActiveState = document.getElementById('alarmActiveState');
    const kickstandMaxState = document.getElementById('kickstandMaxState');
    const posDisplay = document.getElementById('positionDisplay');
    const kickstandLabel = document.getElementById('kickstandStateLabel');
    
    // Actualizar pantalla de posición
    posDisplay.textContent = `Pos: ${objectPosition}px`;
    
    // COMPROBAR SI CABALLETE ESTÁ EXTENDIDO (0-30px)
    const isKickstandMax = objectPosition >= 0 && objectPosition <= 30;
    
    if (isKickstandMax) {
        // ========== ESTADO: CABALLETE EXTENDIDO ==========
        kickstandState.textContent = 'EXTENDIDO ✓';
        kickstandState.style.color = '#4caf50';
        
        kickstandMaxState.textContent = 'Sí ✓';
        kickstandMaxState.style.background = '#90EE90';
        kickstandMaxState.style.color = '#066';
        
        // LED MOTOR: Verde brillante con parpadeo lento (cada 0.5s)
        machineLED.style.background = '#4caf50';
        machineLED.style.boxShadow = '0 0 20px rgba(76, 175, 80, 0.8) inset, 0 0 30px rgba(76, 175, 80, 0.6)';
        machineLED.style.animation = 'blink 0.5s ease-in-out';
        
        motorState.textContent = 'Sí ✓';
        motorState.style.background = '#90EE90';
        motorState.style.color = '#066';
        
        // LED ALARMA: Gris oscuro, sin parpadeo
        alarmLED.style.background = '#555';
        alarmLED.style.boxShadow = '0 0 5px rgba(85, 85, 85, 0.3) inset';
        alarmLED.style.animation = 'none';
        
        alarmActiveState.textContent = 'No';
        alarmActiveState.style.background = '#90EE90';
        alarmActiveState.style.color = '#066';
        
        // Label del caballete: Verde
        kickstandLabel.textContent = 'EXTENDIDO';
        kickstandLabel.style.fill = '#4caf50';
        
    } else {
        // ========== ESTADO: CABALLETE RETRAÍDO ==========
        kickstandState.textContent = 'RETRAÍDO';
        kickstandState.style.color = '#c00';
        
        kickstandMaxState.textContent = 'No';
        kickstandMaxState.style.background = '#FFB6C6';
        kickstandMaxState.style.color = '#833';
        
        // LED MOTOR: Rojo oscuro, sin parpadeo
        machineLED.style.background = '#8B0000';
        machineLED.style.boxShadow = '0 0 10px rgba(139, 0, 0, 0.3) inset';
        machineLED.style.animation = 'none';
        
        motorState.textContent = 'No';
        motorState.style.background = '#FFB6C6';
        motorState.style.color = '#833';
        
        // LED ALARMA: Rojo brillante con parpadeo rápido (cada 0.3s) 🚨
        alarmLED.style.background = '#ff0000';
        alarmLED.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.8) inset, 0 0 30px rgba(255, 0, 0, 0.6)';
        alarmLED.style.animation = 'blink 0.3s ease-in-out infinite';
        
        alarmActiveState.textContent = 'Sí 🚨';
        alarmActiveState.style.background = '#FFB6C6';
        alarmActiveState.style.color = '#c00';
        alarmActiveState.style.fontWeight = 'bold';
        
        // Label del caballete: Rojo
        kickstandLabel.textContent = 'RETRAÍDO';
        kickstandLabel.style.fill = '#c00';
    }
}

// ==================== RESUMEN DE FUNCIONALIDAD ====================
/*
MODO DE USO:

1. BOTONES DE ARRIBA/ABAJO:
   - Botón "RETRAER": llamar moveObjectUp() → baja 10px
   - Botón "EXTENDER": llamar moveObjectDown() → sube 10px

2. SLIDER:
   - onchange="setObjectPosition(this.value)" → posición exacta 0-250px

3. DRAG Y DROP (RATÓN):
   - mousedown: startDrag(e)
   - mousemove: drag(e)
   - mouseup: stopDrag()

4. RANGO DE VALORES:
   - 0px a 30px = EXTENDIDO (Motor ON, Alarma OFF)
   - 31px a 250px = RETRAÍDO (Motor OFF, Alarma ON 🚨)

5. ANIMACIONES:
   - Motor: Parpadea cada 0.5s (lento)
   - Alarma: Parpadea cada 0.3s (rápido)
*/
