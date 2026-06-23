async function initAbout() {
    await renderProfile();
    await renderEducation();
    await renderStackList();
    // initScrollAnimations();
    observeElements('.edu');
    observeElements('.stack-list li');
}

async function renderProfile() {
    const heroName = document.getElementById('hero-name');
    const heroTagline = document.getElementById('hero-tagline');
    const heroBio = document.getElementById('hero-bio');
    const heroImg = document.getElementById('hero-img');
    const aboutName = document.getElementById('about-name');
    const aboutBio = document.getElementById('about-bio');
    const aboutImgContainer = document.getElementById('about-img');
    if (!heroName && !aboutName) return;
    const p = await fetchJSON('data/profile.json');
    if (heroName) heroName.textContent = p.name;
    if (heroTagline) typewriter(heroTagline, p.tagline, 50);
    if (heroBio) typewriter(heroBio, p.heroSubtitle, 40);
    if (heroImg) {
        heroImg.src = p.profileImage;
        heroImg.alt = p.profileImageAlt;
    }
    if (aboutName) aboutName.textContent = 'About Me';
    if (aboutBio && p.bio.length){
        aboutBio.innerHTML = '';
        typeParagraphs(aboutBio, p.bio, 25)
    }
    
    if (aboutImgContainer && p.aboutImg?.length) {
        aboutImgContainer.innerHTML = '';
        p.aboutImg.forEach(item => {
            const imgEl = document.createElement('img');
            imgEl.src= item.src;
            imgEl.alt = item.alt;
            imgEl.classList.add('about-img');
            imgEl.width = 300;
            imgEl.loading = "lazy";

            aboutImgContainer.appendChild(imgEl);
        });
        // aboutImg.src = p.profileImage;
        // aboutImg.alt = p.profileImageAlt;
    }
}

function typeParagraphs(el, paragraphs, speed= 35, index = 0){
    if (index >= paragraphs.length)
        return;

    const pEl = document.createElement('p');
    el.appendChild(pEl)

    typewriter(pEl, paragraphs[index], speed, () => {
        typeParagraphs(el, paragraphs, speed, index + 1);
    });
}

async function renderEducation() {
    const container = document.getElementById('education-list');
    if (!container) return;
    const education = await fetchJSON('data/education.json');
    education.forEach(e => {
        const div = document.createElement('div');
        div.className = 'edu';
        div.innerHTML = `<h3>${e.institution}</h3><p>${e.credential} <span data-status="${e.status}">${e.status}</span></p>`;
        container.appendChild(div);
    });
}

async function renderStackList() {
    const list = document.getElementById('stack-list');
    if (!list) return;
    const skills = await fetchJSON('data/skills.json');
    skills
        .filter(s => s.showInStack)
        .forEach(s => {
            const li = document.createElement('li');
            li.textContent = s.name;
            list.appendChild(li);
        });
}

initAbout();