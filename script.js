// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');

function updateActiveLink() {
  const scrollY = window.scrollY + 100;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);

    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });
}

window.addEventListener('scroll', updateActiveLink);

function getRelativeTimeFromDate(date) {
  const now = new Date();
  const diffMs = now - date;
  if (diffMs < 0) {
    return 'just now';
  }

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHrs = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHrs / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}

function updateRelativePostDates() {
  document.querySelectorAll('time.post-date').forEach(timeElement => {
    const dateValue = timeElement.dataset.postedDate || timeElement.getAttribute('datetime');
    const postedDate = new Date(dateValue);
    if (Number.isNaN(postedDate.getTime())) {
      return;
    }

    const formattedDate = postedDate.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    timeElement.textContent = formattedDate;
    timeElement.title = formattedDate;

    const card = timeElement.closest('.linkedin-post-card');
    const postTime = card ? card.querySelector('.post-time') : null;
    if (postTime) {
      postTime.textContent = getRelativeTimeFromDate(postedDate);
    }
  });
}

updateRelativePostDates();

// Scroll-in animation
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Add fade-in class to animatable elements
document.querySelectorAll(
  '.research-card, .pub-item, .timeline-item, .project-card, .experience-card, .achievement-category'
).forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});
