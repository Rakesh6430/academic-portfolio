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
  document.querySelectorAll('time.li-card-date').forEach(timeElement => {
    const dateValue = timeElement.dataset.postedDate || timeElement.getAttribute('datetime');
    const postedDate = new Date(dateValue);
    if (Number.isNaN(postedDate.getTime())) {
      return;
    }

    const formattedDate = postedDate.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    timeElement.textContent = formattedDate;
    timeElement.title = `Posted: ${formattedDate} · ${getRelativeTimeFromDate(postedDate)}`;
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
  '.research-card, .pub-item, .timeline-item, .project-card, .experience-card, .achievement-category, .li-card'
).forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// ===== Dark Mode Toggle =====
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const html = document.documentElement;

function setTheme(dark) {
  if (dark) {
    html.setAttribute('data-theme', 'dark');
    themeIcon.className = 'fa-solid fa-sun';
    localStorage.setItem('theme', 'dark');
  } else {
    html.removeAttribute('data-theme');
    themeIcon.className = 'fa-solid fa-moon';
    localStorage.setItem('theme', 'light');
  }
}

const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
setTheme(savedTheme === 'dark' || (!savedTheme && prefersDark));

themeToggle.addEventListener('click', () => {
  setTheme(html.getAttribute('data-theme') !== 'dark');
});

// ===== Scroll Progress Bar =====
const progressBar = document.getElementById('scrollProgressBar');
function updateProgressBar() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = docHeight > 0 ? (scrollTop / docHeight * 100) + '%' : '0%';
}
window.addEventListener('scroll', updateProgressBar, { passive: true });

// ===== Back to Top =====
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== Animated Counters =====
function animateCounter(el, target, duration) {
  const isFloat = String(target).includes('.');
  const decimals = isFloat ? String(target).split('.')[1].length : 0;
  const startTime = performance.now();

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = isFloat
      ? (eased * target).toFixed(decimals)
      : Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseFloat(el.textContent);
      if (!isNaN(target)) {
        animateCounter(el, target, 1800);
        statObserver.unobserve(el);
      }
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => statObserver.observe(el));

// ===== Photo Lightbox =====
const lightboxOverlay = document.getElementById('lightboxOverlay');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxCounter = document.getElementById('lightboxCounter');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

const photoCards = Array.from(document.querySelectorAll('.photo-card'));
let currentPhotoIndex = 0;

function openLightbox(index) {
  const card = photoCards[index];
  const img = card.querySelector('img');
  const caption = card.querySelector('.photo-caption');
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt || '';
  lightboxCaption.textContent = caption ? caption.textContent.trim() : '';
  lightboxCounter.textContent = `${index + 1} / ${photoCards.length}`;
  lightboxOverlay.classList.add('active');
  currentPhotoIndex = index;
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightboxOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

function showPrev() {
  openLightbox((currentPhotoIndex - 1 + photoCards.length) % photoCards.length);
}

function showNext() {
  openLightbox((currentPhotoIndex + 1) % photoCards.length);
}

photoCards.forEach((card, i) => card.addEventListener('click', () => openLightbox(i)));
lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', showPrev);
lightboxNext.addEventListener('click', showNext);
lightboxOverlay.addEventListener('click', e => { if (e.target === lightboxOverlay) closeLightbox(); });

document.addEventListener('keydown', e => {
  if (!lightboxOverlay.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showPrev();
  if (e.key === 'ArrowRight') showNext();
});

// ===== Mobile Nav Toggle Animation =====
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open', navLinks.classList.contains('open'));
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navToggle.classList.remove('open'));
});

// ===== Close Mobile Nav on Outside Click =====
document.addEventListener('click', e => {
  if (
    navLinks.classList.contains('open') &&
    !navLinks.contains(e.target) &&
    !navToggle.contains(e.target)
  ) {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
  }
});

// ===== Smart Navbar (hide on scroll down, show on scroll up) =====
let lastScrollY = window.scrollY;
let scrollTicking = false;

window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 140) {
        navbar.classList.add('nav-hidden');
      } else {
        navbar.classList.remove('nav-hidden');
      }
      lastScrollY = currentScrollY;
      scrollTicking = false;
    });
    scrollTicking = true;
  }
}, { passive: true });

// ===== Toast Notification System =====
let activeToast = null;

function showToast(message, icon = 'fa-circle-check') {
  if (activeToast) {
    activeToast.remove();
  }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid ${icon}"></i>${message}`;
  document.body.appendChild(toast);
  activeToast = toast;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.classList.add('toast-visible');
    });
  });

  setTimeout(() => {
    toast.classList.remove('toast-visible');
    setTimeout(() => {
      if (toast.parentNode) toast.remove();
      if (activeToast === toast) activeToast = null;
    }, 320);
  }, 2500);
}

// ===== Copy Email to Clipboard =====
const copyEmailBtn = document.getElementById('copyEmailBtn');
if (copyEmailBtn) {
  copyEmailBtn.addEventListener('click', e => {
    e.preventDefault();
    navigator.clipboard.writeText('rakeshroshanpaul@gmail.com').then(() => {
      showToast('Email copied to clipboard!');
    }).catch(() => {
      window.location.href = 'mailto:rakeshroshanpaul@gmail.com';
    });
  });
}

// ===== Copy Citation Button on Publications =====
document.querySelectorAll('.pub-item').forEach(item => {
  const titleEl  = item.querySelector('h3');
  const authorsEl = item.querySelector('.pub-authors');
  const detailEl  = item.querySelector('.pub-detail');
  const doiEl     = item.querySelector('.pub-doi');
  const linksEl   = item.querySelector('.pub-links');

  if (!titleEl || !linksEl) return;

  const title   = titleEl.textContent.trim();
  const authors = authorsEl ? authorsEl.textContent.trim() : '';
  const detail  = detailEl  ? detailEl.textContent.trim()  : '';
  const doi     = doiEl     ? doiEl.textContent.trim()     : '';

  const citation = [authors, `"${title},"`, detail, doi].filter(Boolean).join(' ');

  const btn = document.createElement('button');
  btn.className = 'copy-cite-btn';
  btn.innerHTML = '<i class="fa-regular fa-copy"></i> Cite';
  btn.title = 'Copy citation to clipboard';

  btn.addEventListener('click', () => {
    navigator.clipboard.writeText(citation).then(() => {
      btn.classList.add('copied');
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
      showToast('Citation copied!', 'fa-quote-right');
      setTimeout(() => {
        btn.classList.remove('copied');
        btn.innerHTML = '<i class="fa-regular fa-copy"></i> Cite';
      }, 2200);
    });
  });

  linksEl.appendChild(btn);
});

// ===== Image Error Fallback =====
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', () => {
    img.style.background = 'var(--bg-alt)';
    img.style.objectFit = 'none';
    img.alt = img.alt || 'Image unavailable';
  });
});

// ===== Lightbox Touch Swipe Gestures =====
(function attachLightboxSwipe() {
  let touchStartX = 0;
  let touchStartY = 0;

  lightboxOverlay.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
  }, { passive: true });

  lightboxOverlay.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    // Swipe down to close
    if (absDy > absDx && dy > 60) {
      closeLightbox();
      return;
    }
    // Horizontal swipe to navigate (minimum 40px)
    if (absDx > absDy && absDx > 40) {
      if (dx < 0) showNext();
      else showPrev();
    }
  }, { passive: true });
})();

// ===== Smooth scroll-padding for fixed navbar on mobile =====
function updateScrollPadding() {
  const navH = navbar.offsetHeight;
  document.documentElement.style.scrollPaddingTop = navH + 'px';
}
updateScrollPadding();
window.addEventListener('resize', updateScrollPadding, { passive: true });
