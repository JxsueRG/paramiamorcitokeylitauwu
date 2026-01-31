// VARIABLES GLOBALES
let player;
let index = 0;
const textToType = "Solo quería recordarte cuánto te amo. Gracias por estar conmigo un año más, por regalarme tantas risas y por ser mi persona favorita en todo el mundo. Te amo mucho, amorcito. Atte. Josue";

const mensajesNo = [
    "¿Segura? 🥺",
    "Piénsalo otra vez...",
    "¡Casi! 😂",
    "Nop, intenta de nuevo",
    "¡Ni lo pienses! ❤️",
    "Te falta velocidad ⚡",
    "Vamos, di que sí 💖",
    "No es no jajaja 😝",
    "Sí que quieres, lo sé 😏",
    "Última oportunidad...",
    "Me voy a poner triste 😢",
    "Por favorcito 🙏",
    "Te amo demasiado 💕",
    "Eres mi todo ✨"
];

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
                    const btnNo = document.getElementById('no');
                    if (btnNo) {
                        btnNo.textContent = "No";
                        btnNo.style.position = 'relative';
                        btnNo.style.left = 'auto';
                        btnNo.style.top = 'auto';
                        btnNo.style.zIndex = 'auto';
                        btnNo.style.transition = 'all 0.3s ease';
                        btnNo.style.background = 'linear-gradient(135deg, #ff6b6b, #ff5252)';
                        btnNo.style.transform = 'scale(1)';
                        btnNo.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.4)';
                    }
                }, 100);
            }
        }
    }, 100);
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

// 4. FUNCIÓN PRINCIPAL CUANDO SE CARGA EL DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM cargado, inicializando botón NO...");
    
    const btnNo = document.getElementById('no');
    const btnSi = document.getElementById('si');
    let btnNoMovimientos = 0;
    let btnNoEstaActivo = false;
    let ultimoMensajeIndex = -1;

    // 4.1 CONFIGURAR BOTÓN "NO" - ¡VERSIÓN CORREGIDA!
    if (btnNo) {
        console.log("Botón NO encontrado, configurando eventos...");
        
        // Función para obtener un mensaje que no sea el mismo anterior
        function obtenerNuevoMensaje() {
            let nuevoIndex;
            do {
                nuevoIndex = Math.floor(Math.random() * mensajesNo.length);
            } while (nuevoIndex === ultimoMensajeIndex && mensajesNo.length > 1);
            
            ultimoMensajeIndex = nuevoIndex;
            return mensajesNo[nuevoIndex];
        }
        
        // Función principal para mover el botón
        const manejarMovimientoBtnNo = function(event) {
            if (btnNoEstaActivo) return;
            btnNoEstaActivo = true;
            
            btnNoMovimientos++;
            console.log(`Movimiento #${btnNoMovimientos} del botón NO`);
            
            // 1. OBTENER Y CAMBIAR EL TEXTO - ¡ESTE ES EL FIX!
            const nuevoMensaje = obtenerNuevoMensaje();
            console.log("Cambiando texto a:", nuevoMensaje);
            btnNo.textContent = nuevoMensaje;
            btnNo.innerText = nuevoMensaje; // Doble seguro
            
            // 2. ANIMACIÓN DE VIBRACIÓN
            btnNo.classList.add('vibrate');
            setTimeout(() => {
                btnNo.classList.remove('vibrate');
            }, 300);
            
            // 3. CALCULAR NUEVA POSICIÓN VISIBLE
            const anchoVentana = window.innerWidth;
            const altoVentana = window.innerHeight;
            const anchoBoton = btnNo.offsetWidth || 120;
            const altoBoton = btnNo.offsetHeight || 50;
            
            // Asegurar márgenes
            const margen = 20;
            const maxX = anchoVentana - anchoBoton - margen;
            const maxY = altoVentana - altoBoton - margen;
            
            // Generar posición aleatoria visible
            let nuevaX, nuevaY;
            let intentos = 0;
            
            do {
                nuevaX = Math.floor(Math.random() * maxX) + margen/2;
                nuevaY = Math.floor(Math.random() * maxY) + margen/2;
                intentos++;
                
                // Intentar evitar el centro donde está el cursor/dedo
                const centroX = event ? (event.clientX || anchoVentana/2) : anchoVentana/2;
                const centroY = event ? (event.clientY || altoVentana/2) : altoVentana/2;
                const distancia = Math.sqrt(
                    Math.pow(nuevaX + anchoBoton/2 - centroX, 2) + 
                    Math.pow(nuevaY + altoBoton/2 - centroY, 2)
                );
                
                if (distancia > 100 || intentos > 15) {
                    break;
                }
            } while (intentos <= 15);
            
            // 4. APLICAR NUEVA POSICIÓN CON TRANSICIÓN
            btnNo.style.position = 'fixed';
            btnNo.style.left = `${nuevaX}px`;
            btnNo.style.top = `${nuevaY}px`;
            btnNo.style.zIndex = '9999';
            btnNo.style.transition = 'left 0.5s ease-out, top 0.5s ease-out';
            
            // 5. EFECTOS ESPECIALES PROGRESIVOS
            if (btnNoMovimientos >= 3) {
                const colores = [
                    'linear-gradient(135deg, #ff4081, #ff80ab)',
                    'linear-gradient(135deg, #ff6b6b, #ff5252)',
                    'linear-gradient(135deg, #ff8a00, #ff5252)',
                    'linear-gradient(135deg, #e91e63, #ff4081)'
                ];
                
                const colorIndex = (btnNoMovimientos - 3) % colores.length;
                btnNo.style.background = colores[colorIndex];
                btnNo.style.boxShadow = `0 0 30px ${colorIndex === 0 ? '#ff4081' : '#ff6b6b'}80`;
                
                if (btnNoMovimientos >= 6) {
                    btnNo.style.transform = `scale(${1 + (btnNoMovimientos * 0.05)})`;
                }
            }
            
            // 6. FORZAR RE-PINTADO PARA ASEGURAR VISUALIZACIÓN
            setTimeout(() => {
                btnNo.style.display = 'none';
                btnNo.offsetHeight; // Trigger reflow
                btnNo.style.display = 'flex';
            }, 10);
            
            // 7. RESET PARA NUEVO MOVIMIENTO
            setTimeout(() => {
                btnNoEstaActivo = false;
            }, 400);
            
            // Prevenir comportamiento por defecto
            if (event) {
                event.preventDefault();
                event.stopPropagation();
                if (event.type === 'touchstart') {
                    event.preventDefault();
                }
            }
        };
        
        // AGREGAR TODOS LOS EVENTOS POSIBLES
        // Mouse events
        btnNo.addEventListener('mouseenter', manejarMovimientoBtnNo);
        btnNo.addEventListener('mouseover', manejarMovimientoBtnNo);
        
        // Touch events para móvil (¡IMPORTANTE!)
        btnNo.addEventListener('touchstart', function(event) {
            console.log("Touch detectado en botón NO");
            manejarMovimientoBtnNo(event);
        }, { passive: false });
        
        btnNo.addEventListener('touchenter', manejarMovimientoBtnNo);
        
        // Click event como respaldo
        btnNo.addEventListener('click', function(event) {
            event.preventDefault();
            console.log("Click en botón NO");
            manejarMovimientoBtnNo(event);
        });
        
        // También mover aleatoriamente cada cierto tiempo
        setInterval(function() {
            if (!btnNoEstaActivo && Math.random() > 0.7) {
                console.log("Movimiento automático del botón NO");
                manejarMovimientoBtnNo();
            }
        }, 4000);
        
        // DEBUG: Agregar consola para verificar
        console.log("Eventos del botón NO configurados correctamente");
    } else {
        console.error("ERROR: No se encontró el botón con id 'no'");
    }

    // 4.2 CONFIGURAR BOTÓN "SÍ"
    if (btnSi) {
        btnSi.addEventListener('click', function() {
            console.log("¡Dijo que SÍ! ❤️");
            
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
                titulo.innerHTML = "¡SABÍA QUE DIRÍAS QUE SÍ! ❤️";
                titulo.style.color = '#ff4081';
                titulo.style.fontSize = '1.8rem';
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
            mensajeExtra.innerHTML = "Eres la mejor decisión de mi vida 💖<br><small>Ahora mira nuestro video</small>";
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
        });
    }

    // 5. CREAR CORAZONES FLOTANTES
    setInterval(createHeart, 350);
    
    // 6. FORZAR REPRODUCCIÓN EN MÓVILES
    function forzarReproduccionMusica() {
        if (player && typeof player.playVideo === "function") {
            player.playVideo();
            player.unMute();
        }
    }
    
    document.addEventListener('touchstart', forzarReproduccionMusica, { once: true });
    document.addEventListener('click', forzarReproduccionMusica, { once: true });
    
    // 7. DEBUG: Mostrar en consola que todo está listo
    console.log("Aplicación completamente inicializada");
    console.log("Botón NO listo para cambiar mensajes:", btnNo ? "SÍ" : "NO");
});

// 5. FUNCIÓN PARA CREAR CORAZONES
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

// 6. MANEJAR REDIMENSIONAMIENTO
window.addEventListener('resize', function() {
    const btnNo = document.getElementById('no');
    if (btnNo && btnNo.style.position === 'fixed') {
        const rect = btnNo.getBoundingClientRect();
        const anchoVentana = window.innerWidth;
        const altoVentana = window.innerHeight;
        
        if (rect.left < 10 || rect.top < 10 || 
            rect.right > anchoVentana - 10 || rect.bottom > altoVentana - 10) {
            btnNo.style.left = `${Math.max(10, Math.min(rect.left, anchoVentana - rect.width - 10))}px`;
            btnNo.style.top = `${Math.max(10, Math.min(rect.top, altoVentana - rect.height - 10))}px`;
        }
    }
});
