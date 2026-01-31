// VARIABLES GLOBALES
let player;
let index = 0;
const textToType = "Solo quería recordarte cuánto te amo. Gracias por estar conmigo un año más, por regalarme tantas risas y por ser mi persona favorita en todo el mundo. Te amo mucho, amorcito. Atte. Josue";

const mensajesNo = [
    "¿Segura?",
    "Piénsalo otra vez",
    "Casi",
    "Nop, intenta de nuevo",
    "Te falta velocidad ",
    "di que sí",
    "No es no JAAJJA",
    "Sí que quieres, yo lo sé ",
    "Última oportunidad",
    "Me voy a poner triste",
    "Por favorcito",
    "Teamo miamor ",
];

// VARIABLES PARA BOTÓN NO
let btnNoMovimientos = 0;
let btnNoEstaActivo = false;
let ultimoMensajeIndex = -1;
let btnNo = null;
let btnSi = null;

// FUNCIONES AUXILIARES
function esDispositivoTactil() {
    return ('ontouchstart' in window) || 
           (navigator.maxTouchPoints > 0) || 
           (navigator.msMaxTouchPoints > 0);
}

function obtenerNuevoMensaje() {
    let nuevoIndex;
    do {
        nuevoIndex = Math.floor(Math.random() * mensajesNo.length);
    } while (nuevoIndex === ultimoMensajeIndex && mensajesNo.length > 1);
    
    ultimoMensajeIndex = nuevoIndex;
    return mensajesNo[nuevoIndex];
}

// 1. INICIALIZACIÓN DE YOUTUBE
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0', 
        width: '0', 
        videoId: 'SFP9CMijntI',
        playerVars: { 
            'autoplay': 1, 
            'loop': 1, 
            'playlist': 'SFP9CMijntI',
            'controls': 0,
            'disablekb': 1,
            'fs': 0,
            'modestbranding': 1,
            'rel': 0
        },
        events: { 
            'onReady': function(e) {
                e.target.mute();
                e.target.setVolume(30);
            }
        }
    });
}

// 2. FUNCIONES DE NAVEGACIÓN
function startExperience() {
    try {
        if (player && typeof player.playVideo === "function") {
            player.playVideo();
            player.unMute();
        }
        changeStep(2);
    } catch (error) {
        console.log("Error al iniciar:", error);
        changeStep(2);
    }
}

function changeStep(stepNumber) {
    // Actualizar barra de progreso
    const progress = (stepNumber / 5) * 100;
    const bar = document.getElementById('progressBar');
    if (bar) {
        bar.style.width = progress + '%';
    }

    // Ocultar todos los pasos
    document.querySelectorAll('.step').forEach(s => {
        s.classList.remove('active');
    });
    
    // Mostrar paso actual
    setTimeout(() => {
        const nextStep = document.getElementById(`step-${stepNumber}`);
        if (nextStep) {
            nextStep.classList.add('active');
            
            // Iniciar máquina de escribir en paso 3
            if (stepNumber === 3) {
                document.getElementById("typewriter").innerHTML = "";
                index = 0;
                setTimeout(typeWriter, 500);
            }
            
            // Silenciar música en paso 5
            if (stepNumber === 5 && player) {
                player.mute();
            }
            
            // REINICIAR BOTÓN "NO" SI VOLVEMOS AL PASO 4
            if (stepNumber === 4) {
                setTimeout(() => {
                    reiniciarBotonNo();
                }, 100);
                
                // Configurar eventos del botón NO
                setTimeout(configurarBotonNo, 200);
            }
        }
    }, 100);
}

function reiniciarBotonNo() {
    if (!btnNo) return;
    
    btnNo.textContent = "No";
    btnNo.classList.remove('btn-no-movil', 'vibrate', 'shake');
    btnNo.style.position = 'relative';
    btnNo.style.left = 'auto';
    btnNo.style.top = 'auto';
    btnNo.style.zIndex = '10';
    btnNo.style.transform = 'scale(1)';
    btnNo.style.background = 'linear-gradient(135deg, #ff6b6b, #ff5252)';
    btnNo.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.4)';
    btnNo.style.transition = 'all 0.3s ease';
    btnNo.style.width = '';
    btnNo.style.height = '';
    
    btnNoMovimientos = 0;
    btnNoEstaActivo = false;
}

// 3. MÁQUINA DE ESCRIBIR
function typeWriter() {
    const el = document.getElementById("typewriter");
    if (!el) return;
    
    if (index < textToType.length) {
        el.innerHTML += textToType.charAt(index);
        index++;
        setTimeout(typeWriter, 50);
    } else {
        const btn = document.getElementById('btn-show-question');
        if (btn) {
            setTimeout(() => {
                btn.classList.remove('hidden');
            }, 500);
        }
    }
}

// 4. CONFIGURACIÓN DEL BOTÓN NO (VERSIÓN MÓVIL COMPATIBLE)
function configurarBotonNo() {
    btnNo = document.getElementById('no');
    btnSi = document.getElementById('si');
    
    if (!btnNo) {
        console.error("Botón NO no encontrado");
        return;
    }
    
    console.log("Configurando botón NO para móvil...");
    
    // Función para mover el botón
    function moverBotonNo(event) {
        if (btnNoEstaActivo) return;
        btnNoEstaActivo = true;
        
        btnNoMovimientos++;
        console.log(`Movimiento #${btnNoMovimientos}`);
        
        // 1. Cambiar texto
        const nuevoMensaje = obtenerNuevoMensaje();
        btnNo.textContent = nuevoMensaje;
        
        // 2. Animación de vibración
        btnNo.classList.add('vibrate');
        setTimeout(() => {
            btnNo.classList.remove('vibrate');
        }, 300);
        
        // 3. Prevenir comportamiento por defecto
        if (event) {
            event.preventDefault();
            event.stopPropagation();
            
            if (event.type.includes('touch')) {
                event.preventDefault();
            }
        }
        
        // 4. Calcular nueva posición (optimizado para móvil)
        const anchoVentana = window.innerWidth;
        const altoVentana = window.innerHeight;
        const anchoBoton = btnNo.offsetWidth || 140;
        const altoBoton = btnNo.offsetHeight || 60;
        
        // Margen de seguridad
        const margen = 40;
        const maxX = anchoVentana - anchoBoton - margen;
        const maxY = altoVentana - altoBoton - margen;
        
        // Obtener posición del toque
        let touchX = anchoVentana / 2;
        let touchY = altoVentana / 2;
        
        if (event) {
            if (event.touches && event.touches[0]) {
                touchX = event.touches[0].clientX;
                touchY = event.touches[0].clientY;
            } else if (event.clientX && event.clientY) {
                touchX = event.clientX;
                touchY = event.clientY;
            }
        }
        
        // Buscar posición alejada del toque
        let nuevaX, nuevaY;
        let intentos = 0;
        
        do {
            nuevaX = margen + Math.random() * maxX;
            nuevaY = margen + Math.random() * maxY;
            intentos++;
            
            // Calcular distancia al punto de toque
            const distancia = Math.sqrt(
                Math.pow(nuevaX + anchoBoton/2 - touchX, 2) + 
                Math.pow(nuevaY + altoBoton/2 - touchY, 2)
            );
            
            // La posición es buena si está suficientemente lejos
            if (distancia > 150 || intentos > 25) {
                break;
            }
        } while (intentos <= 25);
        
        // 5. Aplicar nueva posición
        btnNo.classList.add('btn-no-movil');
        btnNo.style.left = `${nuevaX}px`;
        btnNo.style.top = `${nuevaY}px`;
        btnNo.style.zIndex = '9999';
        
        // 6. Efectos especiales progresivos
        if (btnNoMovimientos >= 3) {
            const colores = [
                'linear-gradient(135deg, #ff4081, #ff80ab)',
                'linear-gradient(135deg, #ff6b6b, #ff5252)',
                'linear-gradient(135deg, #ff8a00, #ff5252)',
                'linear-gradient(135deg, #e91e63, #ff4081)'
            ];
            
            const colorIndex = (btnNoMovimientos - 3) % colores.length;
            btnNo.style.background = colores[colorIndex];
            btnNo.style.boxShadow = `0 0 25px ${colorIndex === 0 ? '#ff4081' : '#ff6b6b'}`;
            
            if (btnNoMovimientos >= 6) {
                const escala = 1 + (btnNoMovimientos * 0.04);
                btnNo.style.transform = `scale(${Math.min(escala, 1.3)})`;
            }
        }
        
        // 7. Permitir nuevos movimientos después de un tiempo
        setTimeout(() => {
            btnNoEstaActivo = false;
        }, 400);
    }
    
    // LIMPIAR EVENTOS ANTERIORES
    const nuevoBtnNo = btnNo.cloneNode(true);
    btnNo.parentNode.replaceChild(nuevoBtnNo, btnNo);
    btnNo = nuevoBtnNo;
    btnNo.id = 'no';
    
    // CONFIGURAR EVENTOS PARA MÓVIL
    const esMovil = esDispositivoTactil();
    
    if (esMovil) {
        console.log("Configurando para dispositivo táctil");
        
        // Touch events (móvil)
        btnNo.addEventListener('touchstart', function(event) {
            console.log("Touchstart detectado");
            moverBotonNo(event);
        }, { passive: false });
        
        btnNo.addEventListener('touchenter', function(event) {
            moverBotonNo(event);
        }, { passive: false });
        
        // También mover al acercar el dedo
        btnNo.addEventListener('touchmove', function(event) {
            event.preventDefault();
        }, { passive: false });
    }
    
    // Mouse events (escritorio)
    btnNo.addEventListener('mouseenter', moverBotonNo);
    btnNo.addEventListener('mouseover', moverBotonNo);
    
    // Click como respaldo universal
    btnNo.addEventListener('click', function(event) {
        event.preventDefault();
        moverBotonNo(event);
    });
    
    // Movimiento automático ocasional
    const intervaloMovimiento = setInterval(() => {
        if (document.getElementById('step-4').classList.contains('active') && 
            !btnNoEstaActivo && Math.random() > 0.85) {
            moverBotonNo();
        }
    }, 3000);
    
    // Guardar referencia para limpiar luego
    window.btnNoInterval = intervaloMovimiento;
    
    // CONFIGURAR BOTÓN SÍ
    if (btnSi) {
        btnSi.addEventListener('click', manejarBotonSi);
    }
}

// 5. MANEJAR BOTÓN SÍ
function manejarBotonSi() {
    console.log("¡Dijo que SÍ! ❤️");
    
    // Limpiar intervalo del botón NO
    if (window.btnNoInterval) {
        clearInterval(window.btnNoInterval);
    }
    
    // EFECTOS DE CONFETI
    if (typeof confetti === "function") {
        confetti({
            particleCount: 300,
            spread: 100,
            origin: { y: 0.6 }
        });
        
        setTimeout(() => {
            confetti({
                particleCount: 200,
                angle: 60,
                spread: 80,
                origin: { x: 0.2 }
            });
            
            confetti({
                particleCount: 200,
                angle: 120,
                spread: 80,
                origin: { x: 0.8 }
            });
        }, 300);
    }
    
    // CAMBIAR INTERFAZ
    const titulo = document.querySelector('#step-4 .soft-title');
    const grupoBotones = document.querySelector('.btn-group');
    const contenedor = document.querySelector('#step-4 .glass-card');
    
    if (titulo) {
        titulo.innerHTML = "SABÍA QUE DIRÍAS QUE CHI";
        titulo.style.color = '#ff4081';
        titulo.style.fontSize = '1.8rem';
        titulo.style.animation = 'pulse 2s infinite';
    }
    
    if (grupoBotones) {
        grupoBotones.style.opacity = '0';
        grupoBotones.style.transition = 'opacity 0.5s';
        setTimeout(() => {
            grupoBotones.style.display = 'none';
        }, 500);
    }
    
    // AGREGAR MENSAJE EXTRA
    const mensajeExtra = document.createElement('p');
    mensajeExtra.className = 'soft-p';
    mensajeExtra.innerHTML = "Eres la mejor decisión de mi vida <br><small>Ahora mira nuestro video</small>";
    mensajeExtra.style.marginTop = '20px';
    mensajeExtra.style.animation = 'fadeIn 2s';
    mensajeExtra.style.fontSize = '1.1rem';
    
    if (contenedor) {
        contenedor.appendChild(mensajeExtra);
    }
    
    // PASAR AL VIDEO
    setTimeout(() => {
        changeStep(5);
    }, 4000);
}

// 6. INICIALIZACIÓN CUANDO CARGA EL DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM cargado - Inicializando aplicación");
    
    // Configurar botón NO cuando esté disponible
    const checkBotonNo = setInterval(() => {
        if (document.getElementById('no')) {
            clearInterval(checkBotonNo);
            configurarBotonNo();
        }
    }, 100);
    
    // Crear corazones flotantes
    setInterval(createHeart, 350);
    
    // Forzar reproducción en móviles
    function forzarReproduccionMusica() {
        if (player && typeof player.playVideo === "function") {
            player.playVideo();
            player.unMute();
        }
    }
    
    // Eventos para iniciar música
    document.addEventListener('touchstart', forzarReproduccionMusica, { once: true });
    document.addEventListener('click', forzarReproduccionMusica, { once: true });
    
    console.log("Aplicación lista - Botón NO configurado para móvil");
});

// 7. FUNCIÓN PARA CREAR CORAZONES
function createHeart() {
    const bg = document.getElementById('bg-animation');
    if (!bg) return;
    
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.className = 'heart-float';
    
    const izquierda = Math.random() * 95;
    const tamano = Math.random() * 25 + 15;
    const duracion = Math.random() * 3 + 4;
    
    heart.style.cssText = `
        left: ${izquierda}%;
        font-size: ${tamano}px;
        color: #ff6b8b;
        opacity: ${Math.random() * 0.7 + 0.3};
        text-shadow: 0 0 10px #ff6b8b80;
        animation-duration: ${duracion}s;
    `;
    
    bg.appendChild(heart);
    
    setTimeout(() => {
        if (heart.parentNode === bg) {
            bg.removeChild(heart);
        }
    }, duracion * 1000);
}

// 8. MANEJAR REDIMENSIONAMIENTO
window.addEventListener('resize', function() {
    const btnNo = document.getElementById('no');
    if (btnNo && btnNo.classList.contains('btn-no-movil')) {
        const rect = btnNo.getBoundingClientRect();
        const anchoVentana = window.innerWidth;
        const altoVentana = window.innerHeight;
        const anchoBoton = btnNo.offsetWidth;
        const altoBoton = btnNo.offsetHeight;
        
        // Ajustar si está fuera de pantalla
        let nuevaX = parseFloat(btnNo.style.left) || rect.left;
        let nuevaY = parseFloat(btnNo.style.top) || rect.top;
        
        if (nuevaX < 10) nuevaX = 10;
        if (nuevaY < 10) nuevaY = 10;
        if (nuevaX + anchoBoton > anchoVentana - 10) nuevaX = anchoVentana - anchoBoton - 10;
        if (nuevaY + altoBoton > altoVentana - 10) nuevaY = altoVentana - altoBoton - 10;
        
        btnNo.style.left = `${nuevaX}px`;
        btnNo.style.top = `${nuevaY}px`;
    }
});

// 9. PREVENIR ZOOM EN MÓVIL
document.addEventListener('touchstart', function(event) {
    if (event.touches.length > 1) {
        event.preventDefault();
    }
}, { passive: false });

let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

