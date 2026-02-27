document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();
    alert("this is portfolio")

    // Elements
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const typingText = document.getElementById('typing-text');
    const scrollProgress = document.getElementById('scroll-progress');
    const scrollToTop = document.getElementById('scroll-to-top');

    // Typing Animation
    const roles = ["Web Developer", "Full Stack Devloper", "AI Prompt Engineer"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 150;

    function type() {
        const currentRole = roles[roleIndex];
        if (isDeleting) {
            typingText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 100;
        } else {
            typingText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 200;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }
    type();

    // Dark/Light Mode Toggle
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') body.classList.add('light-theme');
    updateThemeIcon(savedTheme === 'light');

    themeToggle.addEventListener('click', () => {
        const isLight = body.classList.toggle('light-theme');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        updateThemeIcon(isLight);
    });

    function updateThemeIcon(isLight) {
        themeToggle.innerHTML = isLight ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
        lucide.createIcons();
    }

    // Scroll Progress & Scroll to Top
    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.pageYOffset / totalHeight) * 100;
        scrollProgress.style.width = progress + "%";

        if (window.pageYOffset > 500) {
            scrollToTop.style.display = 'flex';
        } else {
            scrollToTop.style.display = 'none';
        }

        // Skill Bar Animation Trigger
        animateSkills();
    });

    scrollToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Animate Skills
    function animateSkills() {
        const skillBars = document.querySelectorAll('.progress-bar');
        skillBars.forEach(bar => {
            const rect = bar.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                bar.style.width = bar.getAttribute('data-width');
            }
        });
    }

    // Dynamic Projects Loading
    fetch('projects.json')
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('projects-container');
            data.forEach(project => {
                const card = document.createElement('div');
                card.className = 'glass-card project-card';
                card.innerHTML = `
                    <img src="${project.image}" alt="${project.name}" class="project-img">
                    <div class="project-techs">
                        ${project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
                    </div>
                    <h3>${project.name}</h3>
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem; flex-grow: 1;">
                        ${project.description}
                    </p>
                    <div class="btn-group" style="margin-top: auto;">
                        <a href="${project.live}" class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.8rem;">Live Demo</a>
                        <a href="${project.github}" class="btn btn-outline" style="padding: 0.5rem 1rem; font-size: 0.8rem;">GitHub</a>
                    </div>
                `;
                container.appendChild(card);
            });
            // Re-run observer for new cards
            observeSections();
        });

    // Scroll Reveal Animation Observer
    function observeSections() {
        const observerOptions = { threshold: 0.1 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                    if (entry.target.id === 'skills') animateSkills();
                }
            });
        }, observerOptions);

        document.querySelectorAll('section, .timeline-item, .glass-card').forEach(el => {
            observer.observe(el);
        });
    }
    observeSections();

    // Particles.js Initialization
    particlesJS('particles-js', {
        "particles": {
            "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
            "color": { "value": "#a855f7" },
            "shape": { "type": "circle" },
            "opacity": { "value": 0.5, "random": false },
            "size": { "value": 3, "random": true },
            "line_linked": { "enable": true, "distance": 150, "color": "#a855f7", "opacity": 0.4, "width": 1 },
            "move": { "enable": true, "speed": 2, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
        },
        "interactivity": {
            "events": { "onhover": { "enable": true, "mode": "repulse" }, "onclick": { "enable": true, "mode": "push" } },
            "modes": { "repulse": { "distance": 100, "duration": 0.4 }, "push": { "particles_nb": 4 } }
        }
    });

    // 3D Card Hover Effect
    document.addEventListener('mousemove', (e) => {
        const cards = document.querySelectorAll('.glass-card');
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            if (x > 0 && x < rect.width && y > 0 && y < rect.height) {
                const xRotation = 20 * ((y - rect.height / 2) / rect.height);
                const yRotation = -20 * ((x - rect.width / 2) / rect.width);
                card.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale3d(1.02, 1.02, 1.02)`;
            } else {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            }
        });
    });
});


