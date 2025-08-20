// Typewriter Effect Handler - Verdadero efecto letra por letra
class TypewriterEffect {
    constructor() {
        this.typewriterLines = document.querySelectorAll('.typewriter-line');
        this.currentLineIndex = 0;
        this.typingSpeed = 80; // ms por carácter
        this.pauseBetweenLines = 500; // pausa entre líneas
        this.init();
    }
    
    init() {
        if (this.typewriterLines.length === 0) return;
        
        // Preparar todas las líneas
        this.typewriterLines.forEach((line, index) => {
            const originalText = line.textContent;
            line.setAttribute('data-text', originalText);
            line.textContent = ''; // Vaciar el contenido inicialmente
            
            if (index > 0) {
                line.classList.add('hidden');
            }
        });
        
        // Iniciar la animación después de un delay
        setTimeout(() => {
            this.typeCurrentLine();
        }, 800);
    }
    
    async typeCurrentLine() {
        if (this.currentLineIndex >= this.typewriterLines.length) return;
        
        const currentLine = this.typewriterLines[this.currentLineIndex];
        const text = currentLine.getAttribute('data-text');
        
        // Mostrar la línea y agregar cursor
        currentLine.classList.remove('hidden');
        currentLine.classList.add('typing');
        
        // Escribir letra por letra
        for (let i = 0; i <= text.length; i++) {
            const displayText = text.substring(0, i);
            currentLine.textContent = displayText;
            
            // Calcular posición del cursor
            this.updateCursorPosition(currentLine, displayText);
            
            // Esperar antes del siguiente carácter
            if (i < text.length) {
                await this.delay(this.typingSpeed + Math.random() * 40); // Variación natural
            }
        }
        
        // Remover cursor y marcar como terminado
        setTimeout(() => {
            currentLine.classList.remove('typing');
            currentLine.classList.add('finished');
            
            this.currentLineIndex++;
            
            if (this.currentLineIndex < this.typewriterLines.length) {
                setTimeout(() => {
                    this.typeCurrentLine();
                }, this.pauseBetweenLines);
            }
        }, 500);
    }
    
    updateCursorPosition(element, text) {
        // Crear elemento temporal para medir el ancho del texto
        const tempSpan = document.createElement('span');
        tempSpan.style.visibility = 'hidden';
        tempSpan.style.position = 'absolute';
        tempSpan.style.font = window.getComputedStyle(element).font;
        tempSpan.textContent = text;
        document.body.appendChild(tempSpan);
        
        const textWidth = tempSpan.offsetWidth;
        document.body.removeChild(tempSpan);
        
        // Calcular offset del cursor desde el centro
        const cursorOffset = textWidth / 2;
        element.style.setProperty('--cursor-offset', `${cursorOffset}px`);
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Método para reiniciar la animación
    reset() {
        this.currentLineIndex = 0;
        this.typewriterLines.forEach((line, index) => {
            line.classList.remove('typing', 'finished');
            line.textContent = '';
            line.style.removeProperty('--cursor-offset');
            if (index > 0) {
                line.classList.add('hidden');
            }
        });
    }
}

// Mobile Navigation Menu Handler
class MobileNavigation {
    constructor() {
        this.mobileMenuButton = document.getElementById('mobile-menu-button');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.hamburgerIcon = document.querySelector('.hamburger-icon');
        this.closeIcon = document.querySelector('.close-icon');
        this.navbarLinks = document.querySelectorAll('.navbar-link');
        
        this.init();
    }
    
    init() {
        if (!this.mobileMenuButton || !this.mobileMenu) return;
        
        this.bindEvents();
    }
    
    bindEvents() {
        // Toggle mobile menu
        this.mobileMenuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });
        
        // Close menu when clicking on links
        this.navbarLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (event) => {
            if (!this.mobileMenuButton.contains(event.target) && 
                !this.mobileMenu.contains(event.target)) {
                this.closeMenu();
            }
        });
        
        // Close menu with escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.closeMenu();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768) {
                this.closeMenu();
            }
        });
    }
    
    toggleMenu() {
        const isOpen = this.mobileMenu.classList.contains('active');
        
        if (isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        this.mobileMenu.classList.add('active');
        this.hamburgerIcon.style.display = 'none';
        this.closeIcon.style.display = 'block';
        document.body.classList.add('menu-open');
        
        // Focus management for accessibility
        this.mobileMenu.setAttribute('aria-hidden', 'false');
        this.mobileMenuButton.setAttribute('aria-expanded', 'true');
    }
    
    closeMenu() {
        this.mobileMenu.classList.remove('active');
        this.hamburgerIcon.style.display = 'block';
        this.closeIcon.style.display = 'none';
        document.body.classList.remove('menu-open');
        
        // Focus management for accessibility
        this.mobileMenu.setAttribute('aria-hidden', 'true');
        this.mobileMenuButton.setAttribute('aria-expanded', 'false');
    }
}

// Smooth Scrolling Handler
class SmoothScrolling {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    const headerOffset = 80; // Height of sticky header
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TypewriterEffect();
    new MobileNavigation();
    new SmoothScrolling();
});

// Utility functions for better UX
const Utils = {
    // Debounce function for performance optimization
    debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },
    
    // Check if device is touch-enabled
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
};

// Export for use in other files if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TypewriterEffect, MobileNavigation, SmoothScrolling, Utils };
}
