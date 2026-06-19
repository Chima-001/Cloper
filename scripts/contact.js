async function initContact(){
    await renderSocials();
    handleForm();
    observeElements('.contact-intro');
    observeElements('.socials a');
    observeElements('.map');
    observeElements('.contact-info');

    const form = document.getElementById('contact-form');
    if (form){
        setTimeout(() =>{
            form.classList.add('animate-in');
        }, 500);
    }
    // observeElements('.#contact-form', '200px');
}

async function renderSocials() {
    const list = document.getElementById('socials-list');
    if (!list) return;
    const socials = await fetchJSON('data/socials.json');
    socials
        .filter(s => s.showInContact)
        .forEach(s => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="${s.url}" target="_blank" rel="noopener">${s.platform}</a>`;
            list.appendChild(li);
        });
}

function handleForm() {
    if (typeof emailjs === 'undefined') return;
    emailjs.init('NfaTKuU2FRrI2X5lF');

    const form = document.getElementById('contact-form');
    if (!form) return;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    if (localStorage.getItem('draft-name')) nameInput.value = localStorage.getItem('draft-name');
    if (localStorage.getItem('draft-email')) emailInput.value = localStorage.getItem('draft-email');
    if (localStorage.getItem('draft-subject')) subjectInput.value = localStorage.getItem('draft-subject');
    if (localStorage.getItem('draft-message')) messageInput.value = localStorage.getItem('draft-message');

    nameInput.addEventListener('input', () => localStorage.setItem('draft-name', nameInput.value));
    emailInput.addEventListener('input', () => localStorage.setItem('draft-email', emailInput.value));
    subjectInput.addEventListener('input', () => localStorage.setItem('draft-subject', subjectInput.value));
    messageInput.addEventListener('input', () => localStorage.setItem('draft-message', messageInput.value));

    form.addEventListener('submit', e => {
        e.preventDefault();
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const subject = subjectInput.value.trim();
        const message = messageInput.value.trim();

        if (!name || !email || !subject || !message) {
            alert('Please fill in all fields.');
            return;
        }

        const submission = { name, email, subject, message, date: new Date().toLocaleDateString() };

        localStorage.setItem('lastSubmission', JSON.stringify(submission));
        emailjs.send('service_fs80rts', 'template_i3e361u', submission)
            .then(() => {
                ['draft-name', 'draft-email', 'draft-subject', 'draft-message']
                    .forEach(k => localStorage.removeItem(k));
                form.reset();
                const popup = document.getElementById('popup');
                const popupMsg = document.getElementById('popup-msg');
                const popupClose = document.getElementById('popup-close');
                popupMsg.textContent = `Thanks ${name}! I'll get back to you shortly.`;
                popup.classList.add('show');
                popupClose.addEventListener('click', () => popup.classList.remove('show'));
            })
            .catch(() => alert('Something went wrong. Please try again.'));
    });
}

initContact();