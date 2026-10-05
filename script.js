// Week 6: Interactive Portfolio
// Parts 1-5: smooth scroll, project filtering, mobile menu,
// skill animations, and real-time form validation.

// ============================================
// PART 1: SMOOTH SCROLL NAVIGATION
// ============================================

const navLinks = document.querySelectorAll('.nav-link');

// Each nav link scrolls smoothly to its section instead of jumping
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// BONUS: highlight the nav link of whichever section is on screen
const sections = document.querySelectorAll('section');

function updateActiveNavLink() {
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));

            const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);


// ============================================
// PART 2: PROJECT FILTERING
// ============================================

const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

// Show the cards in the chosen category, hide the rest
function filterProjects(category) {
    projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');

        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Only the clicked button stays active
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');
        filterProjects(filterValue);
    });
});


// ============================================
// PART 3: MOBILE MENU TOGGLE
// ============================================

const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Picking a destination should close the menu behind you
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});


// ============================================
// PART 4: SKILL ANIMATIONS
// ============================================

const skillBars = document.querySelectorAll('.skill-progress');

// Fill each bar to its --skill-level once the section is in view
function animateSkills() {
    const skillsSection = document.querySelector('#skills');
    if (!skillsSection) return;

    const skillsPosition = skillsSection.getBoundingClientRect().top;
    const screenPosition = window.innerHeight;

    if (skillsPosition < screenPosition) {
        skillBars.forEach(bar => {
            const skillLevel = bar.style.getPropertyValue('--skill-level');
            bar.style.width = skillLevel;
        });
    }
}

window.addEventListener('scroll', animateSkills);
animateSkills(); // in case the section is already visible on load


// ============================================
// PART 5: FORM VALIDATION
// ============================================

const contactForm = document.querySelector('#contact-form');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const messageInput = document.querySelector('#message');

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Put a red message under the field and mark it invalid
function showError(input, message) {
    clearError(input);

    const error = document.createElement('span');
    error.className = 'error-message';
    error.textContent = message;

    input.classList.add('error');
    input.classList.remove('success');
    input.parentElement.appendChild(error);
}

function clearError(input) {
    const error = input.parentElement.querySelector('.error-message');
    if (error) {
        error.remove();
    }
    input.classList.remove('error');
}

function showSuccess(input) {
    clearError(input);
    input.classList.add('success');
    input.classList.remove('error');
}

// One rule per field, reused by both the live check and the submit check
function validateName() {
    if (nameInput.value.trim().length < 2) {
        showError(nameInput, 'Name must be at least 2 characters');
        return false;
    }
    showSuccess(nameInput);
    return true;
}

function validateEmail() {
    if (!isValidEmail(emailInput.value)) {
        showError(emailInput, 'Please enter a valid email address');
        return false;
    }
    showSuccess(emailInput);
    return true;
}

function validateMessage() {
    if (messageInput.value.trim().length < 10) {
        showError(messageInput, 'Message must be at least 10 characters');
        return false;
    }
    showSuccess(messageInput);
    return true;
}

// Real-time validation as the visitor types
nameInput.addEventListener('input', validateName);
emailInput.addEventListener('input', validateEmail);
messageInput.addEventListener('input', validateMessage);

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Run every check, so all problems show at once
    const nameOk = validateName();
    const emailOk = validateEmail();
    const messageOk = validateMessage();

    if (nameOk && emailOk && messageOk) {
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.textContent = 'Thank you! Your message has been sent successfully.';
        contactForm.appendChild(successMsg);

        // Reset the form and clear the green outlines a moment later
        setTimeout(() => {
            contactForm.reset();
            successMsg.remove();
            document.querySelectorAll('.success').forEach(input => {
                input.classList.remove('success');
            });
        }, 3000);
    }
});
