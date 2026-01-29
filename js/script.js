// ========== ANIMAÇÃO DE ENTRADA SUAVE ==========
document.addEventListener('DOMContentLoaded', function() {
    initAnimations();
    initMenuInteractions();
    initCardInteractions();
    initScrollEffects();
});

// ========== INICIALIZAÇÃO DAS ANIMAÇÕES ==========
function initAnimations() {
    const cards = document.querySelectorAll('.card-animado');
    
    // Observer para animar cards quando entrarem na viewport
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    cards.forEach(card => {
        observer.observe(card);
    });
}

// ========== INTERAÇÕES DO MENU ==========
function initMenuInteractions() {
    const menuLinks = document.querySelectorAll('.menu-link');
    
    menuLinks.forEach(link => {
        // Efeito de ripple ao clicar
        link.addEventListener('click', function(e) {
            createRipple(e, this);
        });
        
        // Partículas ao hover
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        link.addEventListener('mouseleave', function() {
            if (!this.classList.contains('ativo')) {
                this.style.transform = 'translateY(0)';
            }
        });
    });
}

// ========== INTERAÇÕES DOS CARDS ==========
function initCardInteractions() {
    const cards = document.querySelectorAll('section');
    
    cards.forEach(card => {
        // Efeito de brilho ao passar o mouse
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
        });
        
        // Efeito de click com partículas
        card.addEventListener('click', function(e) {
            createParticles(e, this);
        });
    });
    
    // Animação especial para cards de link
    const cardLinks = document.querySelectorAll('.card-link');
    cardLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.icon');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(10deg)';
                icon.style.transition = 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            }
        });
        
        link.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
}

// ========== EFEITOS DE SCROLL ==========
function initScrollEffects() {
    let lastScroll = 0;
    const menu = document.querySelector('.menu-principal');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Menu esconde/mostra ao scrollar
        if (currentScroll > lastScroll && currentScroll > 100) {
            menu.style.transform = 'translateY(-100%)';
        } else {
            menu.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
        
        // Efeito parallax no título
        const h1 = document.querySelector('h1');
        if (h1) {
            const scrolled = window.pageYOffset;
            h1.style.transform = `translateY(${scrolled * 0.5}px)`;
            h1.style.opacity = 1 - (scrolled / 500);
        }
    });
}

// ========== FUNÇÃO PARA CRIAR EFEITO RIPPLE ==========
function createRipple(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 183, 0, 0.6);
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        animation: rippleEffect 0.6s ease-out;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// ========== FUNÇÃO PARA CRIAR PARTÍCULAS ==========
function createParticles(event, element) {
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        const angle = (Math.PI * 2 * i) / 8;
        const velocity = 50 + Math.random() * 50;
        
        particle.style.cssText = `
            position: absolute;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: linear-gradient(135deg, #0066cc, #ffb700);
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            animation: particleFloat 0.8s ease-out forwards;
            --tx: ${Math.cos(angle) * velocity}px;
            --ty: ${Math.sin(angle) * velocity}px;
        `;
        
        element.appendChild(particle);
        setTimeout(() => particle.remove(), 800);
    }
}

// ========== ANIMAÇÃO PARA TIMELINE ==========
const timelineItems = document.querySelectorAll('.timeline-item');
if (timelineItems.length > 0) {
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.5 });
    
    timelineItems.forEach((item) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = 'all 0.5s ease';
        timelineObserver.observe(item);
    });
}

// ========== ADICIONAR ANIMAÇÕES CSS DINÂMICAS ==========
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes particleFloat {
        to {
            transform: translate(var(--tx), var(--ty));
            opacity: 0;
        }
    }
    
    .menu-principal {
        transition: transform 0.3s ease;
    }
    
    section {
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
`;
document.head.appendChild(style);

// ========== EASTER EGG: CONFETTI AO CLICAR NO TÍTULO ==========
const h1 = document.querySelector('h1');
if (h1) {
    let clickCount = 0;
    h1.addEventListener('click', function() {
        clickCount++;
        if (clickCount === 3) {
            createConfetti();
            clickCount = 0;
        }
    });
}

function createConfetti() {
    const colors = ['#0066cc', '#ffb700', '#1a3a52', '#2a5a7a'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}vw;
            top: -10px;
            opacity: ${Math.random() * 0.5 + 0.5};
            transform: rotate(${Math.random() * 360}deg);
            pointer-events: none;
            z-index: 9999;
            animation: confettiFall ${2 + Math.random() * 2}s linear forwards;
        `;
        
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 4000);
    }
}

const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(${Math.random() * 720}deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(confettiStyle);

console.log('🎉 Sistema de Reforma Tributária carregado com sucesso!');
console.log('💡 Dica: Clique 3 vezes no título para uma surpresa!');
