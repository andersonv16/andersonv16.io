// ========== INICIALIZAÇÃO ==========
document.addEventListener('DOMContentLoaded', function() {
    initPageAnimations();
    initMenuHighlight();
    initCardInteractions();
    initScrollEffects();
    initSpecialEffects();
});

// ========== ANIMAÇÕES DE ENTRADA DA PÁGINA ==========
function initPageAnimations() {
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

// ========== DESTAQUE DO MENU BASEADO NA PÁGINA ATUAL ==========
function initMenuHighlight() {
    const menuLinks = document.querySelectorAll('.menu-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    menuLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Remove classe ativo de todos
        link.classList.remove('ativo');
        
        // Adiciona classe ativo ao link da página atual
        if (href === currentPage || href.includes(currentPage)) {
            link.classList.add('ativo');
        }
        
        // Efeito de ripple ao clicar
        link.addEventListener('click', function(e) {
            createRipple(e, this);
        });
    });
}

// ========== INTERAÇÕES DOS CARDS ==========
function initCardInteractions() {
    const cards = document.querySelectorAll('section');
    
    cards.forEach(card => {
        // Efeito 3D ao mover o mouse
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
        
        // Partículas ao clicar
        card.addEventListener('click', function(e) {
            createParticles(e, this);
        });
    });
    
    // Animação para items de benefícios
    const beneficioItems = document.querySelectorAll('.beneficio-item');
    beneficioItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.icon');
            if (icon) {
                icon.style.transform = 'scale(1.3) rotate(15deg)';
                icon.style.transition = 'transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
    
    // Animação para items de produtos
    const produtoItems = document.querySelectorAll('.produto-item');
    produtoItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.icon');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(-10deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        item.addEventListener('mouseleave', function() {
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
    
    // Animação para timeline ao scrollar
    initTimelineAnimation();
}

// ========== ANIMAÇÃO PARA TIMELINE ==========
function initTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-vertical .timeline-item');
    
    if (timelineItems.length > 0) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }
            });
        }, { threshold: 0.3 });
        
        timelineItems.forEach((item) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-30px)';
            item.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            timelineObserver.observe(item);
        });
    }
}

// ========== EFEITOS ESPECIAIS ==========
function initSpecialEffects() {
    // Efeito de destaque nos boxes ao entrar na viewport
    const highlightBoxes = document.querySelectorAll('.highlight, .warning');
    
    const boxObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideInLeft 0.6s ease forwards';
            }
        });
    }, { threshold: 0.5 });
    
    highlightBoxes.forEach(box => {
        boxObserver.observe(box);
    });
    
    // Animação para exemplo de cálculo
    const passos = document.querySelectorAll('.passo');
    if (passos.length > 0) {
        const passoObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateX(0) scale(1)';
                    }, index * 150);
                }
            });
        }, { threshold: 0.5 });
        
        passos.forEach(passo => {
            passo.style.opacity = '0';
            passo.style.transform = 'translateX(-50px) scale(0.95)';
            passo.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            passoObserver.observe(passo);
        });
    }
    
    // Contador animado para números
    animateNumbers();
}

// ========== ANIMAÇÃO DE NÚMEROS ==========
function animateNumbers() {
    const numberElements = document.querySelectorAll('.numero');
    
    numberElements.forEach(element => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    entry.target.classList.add('animated');
                    const text = entry.target.textContent;
                    entry.target.style.transform = 'scale(0)';
                    
                    setTimeout(() => {
                        entry.target.style.transition = 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                        entry.target.style.transform = 'scale(1)';
                    }, 100);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(element);
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
    
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        const angle = (Math.PI * 2 * i) / 6;
        const velocity = 40 + Math.random() * 40;
        
        particle.style.cssText = `
            position: absolute;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: linear-gradient(135deg, #0066cc, #ffb700);
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            animation: particleFloat 0.8s ease-out forwards;
            --tx: ${Math.cos(angle) * velocity}px;
            --ty: ${Math.sin(angle) * velocity}px;
        `;
        
        element.style.position = 'relative';
        element.appendChild(particle);
        setTimeout(() => particle.remove(), 800);
    }
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
    
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
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

// ========== MENSAGEM DE CONSOLE ==========
console.log('📄 Página carregada com sucesso!');
console.log('💡 Interaja com os cards para descobrir animações especiais!');
