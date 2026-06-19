/* ============================================================
 main.js | devnest.Chima
 Handles: nav, theme, JSON rendering, form, filtering
 ============================================================ */
const currentYear = new Date().getFullYear();
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('nav ul');

document.getElementById('lastModified').innerHTML = `Last Modification: ${document.lastModified}`;
document.getElementById('currentyear').innerHTML = currentYear;

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
});

window.addEventListener('scroll', () => {
    document.querySelector('header').classList.toggle('scrolled', window.scrollY > 10);
});
/* -------------------------------------------------------
 THEME TOGGLE
 ------------------------------------------------------- */
function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    const icon = document.getElementById('theme-icon');
    if (!toggle) return;
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
        icon.src = 'images/dark-mode.svg';
    }
    toggle.addEventListener('click', () => {
        icon.classList.add('switching');
        setTimeout(() => {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            icon.src = isLight ? 'images/dark-mode.svg' : 'images/dark-mode.svg';
            icon.classList.remove('switching');
        }, 300);
    });
}
/* -------------------------------------------------------
 JSON FETCH HELPER
 ------------------------------------------------------- */
async function fetchJSON(path) {
    const res = await fetch(path);
    return res.json();
}

async function renderFooterSocials() {
    const wrap = document.getElementById('footer-socials');
    if (!wrap) return;
    const socials = await fetchJSON('data/socials.json');
    socials
        .filter(s => s.showInFooter && s.icon)
        .forEach(s => {
            const a = document.createElement('a');
            a.href = s.url;
            a.target = '_blank';
            a.rel = 'noopener';
            a.setAttribute('aria-label', s.platform);
            a.innerHTML = `<img src="${s.icon}" alt="${s.platform}" />`;
            wrap.appendChild(a);
        });
}
/* -------------------------------------------------------
 FILTER PROJECTS
 Called after renderProjects() populates the grid
 ------------------------------------------------------- */
function filterProjects() {
    const buttons = document.querySelectorAll('.filter-button');
    const projects = Array.from(document.querySelectorAll('.projects-grid .project-card'));
    if (!buttons.length || !projects.length) return;
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filter = button.dataset.filter;
            projects.forEach(project => {
                const types = project.dataset.type.split(' ');
                const match = filter === 'all' || types.includes(filter);
                project.classList.toggle('hidden', !match);
            });
        });
    });
}


function observeElements(selector, rootMargin = '0px 0px -30px 0px') {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, i * 150);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0, rootMargin
    });

    document.querySelectorAll(`${selector}:not(.animate-in)`).forEach(el => {
        observer.observe(el);
    });
    // targets.forEach(el => observer.observe(el));
}

function typewriter(element, text, speed = 35, onComplete) {
    let i = 0;
    element.textContent = '';
    element.classList.add('typing');

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            element.classList.remove('typing');
            if (onComplete) onComplete();
        }
    }
    type();
}

if (!document.querySelector('#typewriter-style')) {
    const style = document.createElement('style');
    style.id = 'typewriter-style';
    StylePropertyMapReadOnly.textContent = `
    .typing::after{
    content: '|';
    animation: blink 1s step-end infinite;
    margin-left: 2px;
    }
    @keyframes blink {50% {opacity: 0} }
    `;
    document.head.appendChild(style);
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-typewriter]').forEach(el => {
        const text = el.dataset.typewriter;
        const speed = parseInt(el.dataset.speed) || 50;
        typewriter(el, text, speed);
    });
});

initThemeToggle();
renderFooterSocials();