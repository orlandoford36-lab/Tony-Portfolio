// Initialize theme from localStorage or system preference
const initTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (prefersDark ? 'dark' : 'light');
  
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
};

// Handle dark mode toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const themeIcon = darkModeToggle.querySelector('.theme-icon');

const syncThemeIcon = () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  themeIcon.textContent = isDark ? '☀️' : '🌙';
  darkModeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  darkModeToggle.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
};

darkModeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  
  if (isDark) {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }

  syncThemeIcon();
});

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  const savedTheme = localStorage.getItem('theme');
  // Only auto-switch if user hasn't manually set a preference
  if (!savedTheme) {
    initTheme();
  }
});

// Initialize on page load
initTheme();
syncThemeIcon();

// Section reveal animations
const revealTargets = document.querySelectorAll('#projects .container, #about .container, #contact .container');
revealTargets.forEach((element) => element.classList.add('reveal'));

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
    rootMargin: '0px 0px -10% 0px'
  }
);

revealTargets.forEach((element) => revealObserver.observe(element));

// Contact form validation
const contactForm = document.getElementById('contactForm');
const nameInput = document.getElementById('contactName');
const emailInput = document.getElementById('contactEmail');
const messageInput = document.getElementById('contactMessage');
const submitBtn = document.getElementById('submitBtn');
const formStatus = document.getElementById('formStatus');

const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const messageError = document.getElementById('messageError');

const validateName = (value) => value.trim().length >= 2;
const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const validateMessage = (value) => value.trim().length >= 10;

const updateFieldValidation = () => {
  const isNameValid = validateName(nameInput.value) || nameInput.value === '';
  const isEmailValid = validateEmail(emailInput.value) || emailInput.value === '';
  const isMessageValid = validateMessage(messageInput.value) || messageInput.value === '';

  nameError.textContent = isNameValid || nameInput.value === '' ? '' : 'Minimum 2 characters required';
  emailError.textContent = isEmailValid || emailInput.value === '' ? '' : 'Please enter a valid email';
  messageError.textContent = isMessageValid || messageInput.value === '' ? '' : 'Minimum 10 characters required';

  const allFilled = nameInput.value && emailInput.value && messageInput.value;
  const allValid = validateName(nameInput.value) && validateEmail(emailInput.value) && validateMessage(messageInput.value);

  submitBtn.disabled = !allValid || !allFilled;
};

nameInput.addEventListener('input', updateFieldValidation);
nameInput.addEventListener('blur', updateFieldValidation);
emailInput.addEventListener('input', updateFieldValidation);
emailInput.addEventListener('blur', updateFieldValidation);
messageInput.addEventListener('input', updateFieldValidation);
messageInput.addEventListener('blur', updateFieldValidation);

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!validateName(nameInput.value) || !validateEmail(emailInput.value) || !validateMessage(messageInput.value)) {
    updateFieldValidation();
    return;
  }

  formStatus.textContent = '✓ Message sent! Thank you for reaching out.';
  formStatus.className = 'form-status success';
  contactForm.reset();
  submitBtn.disabled = true;
  setTimeout(() => {
    formStatus.textContent = '';
    formStatus.className = 'form-status';
  }, 3000);
});

initTheme();

// Footer copyright year
document.getElementById('year').textContent = new Date().getFullYear();
