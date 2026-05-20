// DOM Elements
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const navbar = document.getElementById('navbar');
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formMessage = document.getElementById('formMessage');
const currentYearSpan = document.getElementById('currentYear');

// Set current year
if (currentYearSpan) {
  currentYearSpan.textContent = new Date().getFullYear();
}

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
  const isActive = navLinks.classList.toggle('active');
  menuToggle.setAttribute('aria-expanded', isActive);
  const icon = menuToggle.querySelector('i');
  icon.classList.toggle('fa-bars', !isActive);
  icon.classList.toggle('fa-times', isActive);
});

// Close mobile menu on nav link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    const icon = menuToggle.querySelector('i');
    icon.classList.add('fa-bars');
    icon.classList.remove('fa-times');
  });
});

// Close mobile menu on outside click
document.addEventListener('click', (e) => {
  if (!e.target.closest('.nav-links') &&
      !e.target.closest('.menu-icon') &&
      navLinks.classList.contains('active')) {
    navLinks.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    const icon = menuToggle.querySelector('i');
    icon.classList.add('fa-bars');
    icon.classList.remove('fa-times');
  }
});

// Escape key closes menu
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('active')) {
    navLinks.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    const icon = menuToggle.querySelector('i');
    icon.classList.add('fa-bars');
    icon.classList.remove('fa-times');
    menuToggle.focus();
  }
});

// Throttled scroll handler
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      // Navbar shadow on scroll
      navbar.classList.toggle('scrolled', window.scrollY > 80);

      // Active nav link highlighting
      let current = '';
      document.querySelectorAll('section[id]').forEach(section => {
        if (window.scrollY >= section.offsetTop - 320) {
          current = section.getAttribute('id');
        }
      });

      document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });

      ticking = false;
    });
    ticking = true;
  }
});

// Email validation
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Contact form submission
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  formMessage.className = 'form-message';
  formMessage.style.display = 'none';

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');

  [nameInput, emailInput, messageInput].forEach(input => input.classList.remove('error'));

  let hasError = false;
  if (!nameInput.value.trim()) { nameInput.classList.add('error'); hasError = true; }
  if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) { emailInput.classList.add('error'); hasError = true; }
  if (!messageInput.value.trim()) { messageInput.classList.add('error'); hasError = true; }

  if (hasError) {
    formMessage.className = 'form-message error-msg';
    formMessage.textContent = 'Please fill in all fields correctly.';
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      formMessage.className = 'form-message success';
      formMessage.textContent = "Message sent! I'll get back to you within 24 hours.";
      contactForm.reset();
    } else {
      throw new Error('Failed');
    }
  } catch {
    formMessage.className = 'form-message error-msg';
    formMessage.textContent = 'Something went wrong. Try email or WhatsApp directly.';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message';
  }
});

// Clear error styles on input
document.querySelectorAll('input, textarea').forEach(input => {
  input.addEventListener('input', () => input.classList.remove('error'));
});
