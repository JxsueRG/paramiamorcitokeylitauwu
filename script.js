let player;
const textToType = "Solo quería recordarte cuánto te amo. Gracias por estar conmigo un año más, por regalarme tantas risas y por ser, mi persona favorita en todo el mundo. Teamo mucho amorcito ATT. Josue";
let index = 0;

// API de YouTube
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0', width: '0',
        videoId: 'SFP9CMijntI',
        playerVars: { 'autoplay': 1, 'loop': 1, 'playlist': 'SFP9CMijntI' },
        events: { 'onReady': (e) => e.target.mute() }
    });
}

function startExperience() {
    if (player) {
        player.playVideo();
        player.unMute();
    }
    changeStep(2);
}

function changeStep(stepNumber) {
    const progress = (stepNumber / 5) * 100;
    const bar = document.getElementById('progressBar');
    if(bar) bar.style.width = progress + '%';

    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    
    setTimeout(() => {
        const nextStep = document.getElementById(`step-${stepNumber}`);
        if(nextStep) nextStep.classList.add('active');

        if (stepNumber === 3) {
            document.getElementById("typewriter").innerHTML = "";
            index = 0;
            typeWriter();
        }
        if (stepNumber === 5 && player) {
            player.mute(); 
        }
    }, 100);
}

function typeWriter() {
    if (index < textToType.length) {
        document.getElementById("typewriter").innerHTML += textToType.charAt(index);
        index++;
        setTimeout(typeWriter, 50);
    } else {
        document.getElementById('btn-show-question').classList.remove('hidden');
    }
}

// Botón No que huye
const btnNo = document.getElementById('no');
if(btnNo) {
    btnNo.addEventListener('mouseover', () => {
        const x = Math.random() * (window.innerWidth - 100);
        const y = Math.random() * (window.innerHeight - 50);
        btnNo.style.position = 'fixed';
        btnNo.style.left = x + 'px';
        btnNo.style.top = y + 'px';
    });
}

// Botón Si
const btnSi = document.getElementById('si');
if(btnSi) {
    btnSi.addEventListener('click', () => {
        confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 }, colors: ['#f8ad9d', '#fbc4ab'] });
        document.querySelector('#step-4 .soft-title').innerHTML = "¡SABÍA QUE DIRÍAS QUE CHI ! ❤️";
        document.querySelector('.btn-group').style.display = 'none';

        setTimeout(() => {
            changeStep(5);
        }, 4000); 
    });
}

// Corazones de fondo
function createHeart() {
    const bg = document.getElementById('bg-animation');
    if(!bg) return;
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.position = 'fixed';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.top = '-20px';
    heart.style.fontSize = Math.random() * 20 + 10 + 'px';
    heart.style.opacity = Math.random() * 0.5;
    heart.style.transition = '5s linear';
    heart.style.zIndex = '0';
    bg.appendChild(heart);
    
    setTimeout(() => {
        heart.style.transform = `translateY(110vh) rotate(${Math.random() * 360}deg)`;
    }, 100);
    
    setTimeout(() => heart.remove(), 6000);
}
setInterval(createHeart, 300);