async function initProjects() {
    const projects = await renderProjects();
    filterProjects();
    initModal(projects);
    // initScrollAnimations();
    // observeElements('.my-skill-card');
    observeElements(".project-card");
}

async function renderProjects() {
    const grid = document.getElementById("projects-grid");
    if (!grid) return [];
    const projects = await fetchJSON("data/projects.json");
    projects.forEach((p) => {
        const card = document.createElement("div");
        card.className = "project-card";
        card.dataset.type = p.tags.join(" ");

        card.innerHTML = `
        <div class="card-img-wrap">
            <img src="${p.image}" alt="${p.imageAlt}" loading="lazy" />
            <div class="hover-hint">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 5v14M5 12h14" />
                </svg>
                View Details
            </div>
        </div>
        <div class="project-info">
            <h2>${p.title}</h2>
            <div class="tag-row">
                ${p.tags.map(t => `<span class="tag-pill">${t.toUpperCase()}</span>`).join('')}
            </div>
            <a href="${p.liveUrl}" class="prm-button" target="_blank" rel="noopener" onclick="event.stopPropagation()">Live Demo</a>
        </div>`;

        card.dataset.id = p.id;
        grid.appendChild(card);
    });
    // Wire up filtering after cards are in the DOM
    // filterProjects();
    return projects;
}

function initModal(projects) {
    const overlay = document.getElementById("project-modal");
    const closeBtn = document.getElementById("modal-close");

    if(!overlay) return;

    document.querySelectorAll(".project-card").forEach((card) => {
        card.addEventListener("click", () => {
            // if (e.target.closest(".prm-button")) return;

            const projectId = card.dataset.id;
            const project = projects.find((p) => p.id === projectId);
            if (!project) return;

            document.getElementById("modal-img").src = project.image;
            document.getElementById("modal-img").alt = project.imageAlt;
            document.getElementById("modal-title").textContent = project.title;
            document.getElementById("modal-desc").textContent = project.description;
            document.getElementById("modal-live").href = project.liveUrl;
            document.getElementById("modal-github").href = project.githubUrl;

            const tagsEl = document.getElementById("modal-tags");
            tagsEl.innerHTML = project.tags
                .map((t) => `<span class="tag-pill">${t}</span>`)
                .join("");
            overlay.classList.add("show");
            document.body.style.overflow = "hidden";
        });
    });

    closeBtn.addEventListener("click", closeModal);

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeModal();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeModal();
    });

    function closeModal() {
        overlay.classList.remove("show");
        document.body.style.overflow = "";
    }
}

initProjects();
