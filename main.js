// CURSOR PERSONALIZADO
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

if (cursor && follower) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    function animateFollower() {
        followerX += (mouseX - followerX) * 0.12;
        followerY += (mouseY - followerY) * 0.12;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Expandir cursor en links
    document.querySelectorAll('a, button, .project-card, .skill-item').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(2)';
            follower.style.width = '60px';
            follower.style.height = '60px';
            follower.style.opacity = '0.2';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            follower.style.width = '36px';
            follower.style.height = '36px';
            follower.style.opacity = '0.5';
        });
    });

    // Función para actualizar elementos interactivos
    function updateInteractiveElements() {
        document.querySelectorAll('a, button, .project-card, .skill-item').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(2)';
                follower.style.width = '60px';
                follower.style.height = '60px';
                follower.style.opacity = '0.2';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                follower.style.width = '36px';
                follower.style.height = '36px';
                follower.style.opacity = '0.5';
            });
        });
    }

    // Llamar cuando se abra el modal
    window.updateCursorInteractions = updateInteractiveElements;
}

// REVEAL ON SCROLL
const reveals = document.querySelectorAll('.reveal-section');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
});

reveals.forEach(el => observer.observe(el));

// NAVBAR SCROLL EFFECT
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.borderBottomColor = 'rgba(255, 224, 0, 0.3)';
    } else {
        navbar.style.borderBottomColor = 'rgba(255, 224, 0, 0.15)';
    }
});

// MODAL DE PROYECTO
const projectModal = document.getElementById('projectModal');
const modalTitle = document.getElementById('modalTitle');
const modalTags = document.getElementById('modalTags');
const modalProjectLink = document.getElementById('modalProjectLink');
const carouselSlides = document.getElementById('carouselSlides');
const carouselIndicators = document.getElementById('carouselIndicators');
const modalClose = document.querySelector('.modal-close');
const modalOverlay = document.querySelector('.modal-overlay');

let currentSlide = 0;
let totalSlides = 0;

// Abrir modal al hacer clic en un proyecto
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
        const title = card.dataset.projectTitle;
        const tags = card.dataset.projectTags.split(',');
        const images = card.dataset.projectImages.split(',').filter(img => img.trim() !== '');
        const link = card.dataset.projectLink;

        openProjectModal(title, tags, images, link);
    });
});

function openProjectModal(title, tags, images, link) {
    // Establecer título
    modalTitle.textContent = title;

    // Establecer tags
    modalTags.innerHTML = '';
    tags.forEach(tag => {
        const span = document.createElement('span');
        span.textContent = tag.trim();
        modalTags.appendChild(span);
    });

    // Establecer enlace del proyecto
    if (link && link.trim() !== '') {
        modalProjectLink.href = link;
        modalProjectLink.style.display = 'inline-flex';
    } else {
        modalProjectLink.style.display = 'none';
    }

    // Crear carrusel
    createCarousel(images);

    // Mostrar modal
    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Actualizar interacciones del cursor si existe la función
    if (typeof window.updateCursorInteractions === 'function') {
        setTimeout(() => window.updateCursorInteractions(), 100);
    }
}

function createCarousel(images) {
    carouselSlides.innerHTML = '';
    carouselIndicators.innerHTML = '';
    currentSlide = 0;

    if (images.length === 0) {
        // Si no hay imágenes, mostrar placeholder
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        slide.innerHTML = '<div style="color: #888; font-family: var(--font-mono); padding: 4rem;">Sin imágenes disponibles</div>';
        carouselSlides.appendChild(slide);
        totalSlides = 1;

        // Ocultar controles si no hay imágenes
        document.querySelector('.carousel-prev').style.display = 'none';
        document.querySelector('.carousel-next').style.display = 'none';
        return;
    }

    totalSlides = images.length;

    // Crear slides
    images.forEach((imgSrc, index) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        const img = document.createElement('img');
        img.src = imgSrc.trim();
        img.alt = `Imagen ${index + 1}`;
        slide.appendChild(img);
        carouselSlides.appendChild(slide);
    });

    // Crear indicadores
    if (images.length > 1) {
        images.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.className = 'carousel-indicator';
            if (index === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => goToSlide(index));
            carouselIndicators.appendChild(indicator);
        });

        // Mostrar controles
        document.querySelector('.carousel-prev').style.display = 'flex';
        document.querySelector('.carousel-next').style.display = 'flex';
    } else {
        // Ocultar controles si solo hay una imagen
        document.querySelector('.carousel-prev').style.display = 'none';
        document.querySelector('.carousel-next').style.display = 'none';
    }

    updateCarousel();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
}

function updateCarousel() {
    const offset = -currentSlide * 100;
    carouselSlides.style.transform = `translateX(${offset}%)`;

    // Actualizar indicadores
    const indicators = carouselIndicators.querySelectorAll('.carousel-indicator');
    indicators.forEach((indicator, index) => {
        if (index === currentSlide) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

// Botones del carrusel
document.querySelector('.carousel-prev').addEventListener('click', prevSlide);
document.querySelector('.carousel-next').addEventListener('click', nextSlide);

// Cerrar modal
function closeModal() {
    projectModal.classList.remove('active');
    document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

// Cerrar con ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal.classList.contains('active')) {
        closeModal();
    }
});

// Navegación del carrusel con teclado
document.addEventListener('keydown', (e) => {
    if (projectModal.classList.contains('active')) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    }
});
