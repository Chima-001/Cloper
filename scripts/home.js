async function initHome() {
    await renderProfile();
    await renderSkillCards();
    await renderFeaturedProject();
    await initHeroSlideShow();
    observeElements('.my-skill-card');
    observeElements('.project');
}

async function renderProfile() {
    const heroName = document.getElementById('hero-name');
    const heroTagline = document.getElementById('hero-tagline');
    const heroBio = document.getElementById('hero-bio');
    const heroImg = document.getElementById('hero-img');
    const aboutName = document.getElementById('about-name');
    const aboutBio = document.getElementById('about-bio');
    const aboutImg = document.getElementById('about-img');
    if (!heroName && !aboutName) return;
    const p = await fetchJSON('data/profile.json');
    if (heroName) heroName.textContent = p.name;
    if (heroTagline) heroTagline.textContent = p.tagline;
    if (heroBio) {
        heroBio.textContent = '';
        typewriter(heroBio, p.heroSubtitle, 35)
    }
    if (heroImg) {
        heroImg.src = p.profileImage;
        heroImg.alt = p.profileImageAlt;
    }
    if (aboutName) aboutName.textContent = 'About Me';
    if (aboutBio) {
        aboutBio.innerHTML = p.bio.map(para => `<p>${para}</p>`).join('');
    }
    if (aboutImg) {
        aboutImg.src = p.profileImage;
        aboutImg.alt = p.profileImageAlt;
    }
}

async function renderSkillCards() {
    const wrap = document.getElementById('skills-cards');
    if (!wrap) return;
    const skills = await fetchJSON('data/skills.json');
    skills
        .filter(s => s.showAsCard)
        .forEach(s => {
            const card = document.createElement('div');
            card.className = 'my-skill-card';
            card.innerHTML = `<h3>${s.name}</h3><p>${s.description}</p>`;
            wrap.appendChild(card);
        });
}

async function renderFeaturedProject() {
    const container = document.getElementById('featured-project');
    if (!container) return;

    const projects = await fetchJSON('data/projects.json');

    const featuredProjects = projects.filter(p => p.featured);
    
    const shuffled = [...featuredProjects].sort(() => Math.random() - 0.5);
    const pick = shuffled[0];
    const shortDesc = pick.description.split('\n')[0];
    
    container.innerHTML = `
 <img src="${pick.image}" alt="${pick.imageAlt}" loading="lazy" />
 <div class="project-info">
 <h3>${pick.title}</h3>
 <p>${shortDesc}</p>
 <div class="project-links">
 <a href="${pick.liveUrl}" class="prm-button">Live Demo</a>
 <a href="${pick.githubUrl}" class="outline-button">GitHub</a>
 </div>
 </div>`;
}

async function initHeroSlideShow() {
    const profile = await fetchJSON('data/profile.json');
    const images = profile.heroImages;
    if (!images || !images.length) return;

    const bg = document.getElementById('hero-bg');
    if (!bg) return;

    let currentIndex = parseInt(localStorage.getItem('hero-img-index') || '0');
    if (currentIndex >= images.length) currentIndex = 0;

    function showImage(index) {
        bg.classList.remove('visible');

        setTimeout(() => {
            bg.style.backgroundImage = `url('${images[index]}')`;
            bg.classList.add('visible');
            localStorage.setItem('hero-img-index', index);
        }, 400);
    }

    showImage(currentIndex);

    setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    }, 5000);
}

initHome();