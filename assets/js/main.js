/**
 * EVERGRACE SENIOR CARE SERVICE
 * Main Interactive Script
 * Responsive from 320px | 1.5s Preloader | Scroll Animations
 */

// 1. PRELOADER WITH EXACT 1.5 SECONDS ANIMATION
(function initPreloader() {
  const minLoadTime = 1500; // 1.5 seconds
  const startTime = performance.now();

  const handlePreloaderDismiss = () => {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    const elapsed = performance.now() - startTime;
    const remainingTime = Math.max(0, minLoadTime - elapsed);

    setTimeout(() => {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        preloader.style.display = 'none';
        document.body.classList.add('page-loaded');
        // Trigger initial above-the-fold animations
        triggerInitialAnimations();
      }, 500);
    }, remainingTime);
  };

  if (document.readyState === 'complete') {
    handlePreloaderDismiss();
  } else {
    window.addEventListener('load', handlePreloaderDismiss);
  }

  // Safety fallback in case window.load is delayed
  setTimeout(handlePreloaderDismiss, 3500);
})();

function triggerInitialAnimations() {
  const heroElements = document.querySelectorAll('.hero-content, .hero-media, .page-hero');
  heroElements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('is-visible');
    }, index * 120);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Sticky Navbar Scroll Listener (Keeps Navbar Fixed at Top)
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // 2. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
  const animatableSelectors = [
    '.card',
    '.section-header',
    '.pillar-card',
    '.calc-card',
    '.story-media',
    '.team-card',
    '.facility-item',
    '.testimonial-card',
    '.activity-card',
    '.blog-card',
    '.featured-post-card',
    '.contact-info-card',
    '.cta-banner',
    '.kpi-card',
    '.timeline-item'
  ];

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.1
  };

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Auto-attach animation classes to key components
  document.querySelectorAll(animatableSelectors.join(', ')).forEach((el, idx) => {
    if (!el.classList.contains('animate-on-scroll')) {
      el.classList.add('animate-on-scroll');
      // Alternate subtle entrance delays for grid children
      if (idx % 3 === 1) el.classList.add('delay-1');
      if (idx % 3 === 2) el.classList.add('delay-2');
    }
    scrollObserver.observe(el);
  });

  // 3. MOBILE DRAWER NAVIGATION
  const mobileToggle = document.getElementById('mobileNavToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');

  if (mobileToggle && mobileDrawer && drawerOverlay) {
    const toggleMenu = () => {
      const isOpen = mobileDrawer.classList.contains('open');
      mobileDrawer.classList.toggle('open', !isOpen);
      drawerOverlay.classList.toggle('open', !isOpen);
      mobileToggle.classList.toggle('open', !isOpen);
      mobileToggle.setAttribute('aria-expanded', !isOpen);
      document.body.style.overflow = isOpen ? '' : 'hidden';
    };

    mobileToggle.addEventListener('click', toggleMenu);
    drawerOverlay.addEventListener('click', toggleMenu);

    const mobileLinks = mobileDrawer.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mobileDrawer.classList.contains('open')) {
          toggleMenu();
        }
      });
    });
  }

  // 4. INTERACTIVE CARE COST CALCULATOR (HOME PAGE)
  const calcHoursInput = document.getElementById('calcHours');
  const calcHoursDisplay = document.getElementById('calcHoursVal');
  const calcCareType = document.getElementById('calcCareType');
  const calcDaysWeek = document.getElementById('calcDaysWeek');
  const calcTotalDisplay = document.getElementById('calcTotalPrice');
  const calcMonthlyDisplay = document.getElementById('calcMonthlyPrice');

  function updateCalculator() {
    if (!calcHoursInput || !calcTotalDisplay) return;

    const hoursPerDay = parseInt(calcHoursInput.value, 10);
    const hourlyRate = parseFloat(calcCareType ? calcCareType.value : 32);
    const daysPerWeek = parseInt(calcDaysWeek ? calcDaysWeek.value : 5, 10);

    if (calcHoursDisplay) {
      calcHoursDisplay.textContent = `${hoursPerDay} hrs / day`;
    }

    const weeklyTotal = hoursPerDay * hourlyRate * daysPerWeek;
    const monthlyTotal = weeklyTotal * 4.33;

    calcTotalDisplay.textContent = `$${Math.round(weeklyTotal).toLocaleString()}`;
    if (calcMonthlyDisplay) {
      calcMonthlyDisplay.textContent = `~$${Math.round(monthlyTotal).toLocaleString()}/month`;
    }
  }

  if (calcHoursInput) {
    calcHoursInput.addEventListener('input', updateCalculator);
  }
  if (calcCareType) {
    calcCareType.addEventListener('change', updateCalculator);
  }
  if (calcDaysWeek) {
    calcDaysWeek.addEventListener('change', updateCalculator);
  }
  updateCalculator();

  // 5. QUICK ASSESSMENT FINDER (HOME PAGE)
  const assessmentForm = document.getElementById('assessmentFinderForm');
  if (assessmentForm) {
    assessmentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      window.location.href = '404.html';
    });
  }

  // 6. FAQ ACCORDION ITEMS
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(sibling => sibling.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // 7. BLOG SEARCH & FILTER PILLS (BLOG PAGE)
  const blogSearchInput = document.getElementById('blogSearch');
  const blogFilterPills = document.querySelectorAll('.filter-pill');
  const blogCards = document.querySelectorAll('.blog-card-item');

  function filterBlogPosts() {
    if (!blogCards.length) return;
    const query = (blogSearchInput ? blogSearchInput.value : '').toLowerCase().trim();
    const activePill = document.querySelector('.filter-pill.active');
    const selectedCategory = activePill ? activePill.getAttribute('data-category') : 'all';

    blogCards.forEach(card => {
      const title = (card.querySelector('.blog-title')?.textContent || '').toLowerCase();
      const category = card.getAttribute('data-category') || '';
      const text = card.textContent.toLowerCase();

      const matchesSearch = !query || title.includes(query) || text.includes(query);
      const matchesCategory = selectedCategory === 'all' || category === selectedCategory;

      if (matchesSearch && matchesCategory) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  if (blogSearchInput) {
    blogSearchInput.addEventListener('input', filterBlogPosts);
  }

  if (blogFilterPills.length) {
    blogFilterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        blogFilterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        filterBlogPosts();
      });
    });
  }

  // 8. GLOBAL FORM SUBMISSION NAVIGATION: After form validation, moves to 404.html
  // (Applies to all public forms on home, about, contact, service, blog, excluding auth-forms)
  const generalForms = document.querySelectorAll('form:not(.auth-form)');
  generalForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      window.location.href = '404.html';
    });
  });

  // 9. TOAST NOTIFICATION UTILITY
  window.showToast = function (message, duration = 4000) {
    let toast = document.getElementById('globalToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'globalToast';
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #10b981; margin-right: 6px;"></i> <span>${message}</span>`;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  };

  // 10. DASHBOARD SIDEBAR TOGGLE
  const dashMenuBtn = document.getElementById('dashMenuToggle');
  const dashSidebar = document.getElementById('dashSidebar');
  const dashOverlay = document.getElementById('dashOverlay');

  if (dashMenuBtn && dashSidebar) {
    const toggleDashSidebar = () => {
      dashSidebar.classList.toggle('open');
      if (dashOverlay) dashOverlay.classList.toggle('open');
    };

    dashMenuBtn.addEventListener('click', toggleDashSidebar);
    if (dashOverlay) {
      dashOverlay.addEventListener('click', toggleDashSidebar);
    }
  }

  // 11. MEDICATION CHECKBOX INTERACTION
  const medCheckboxes = document.querySelectorAll('.med-checkbox');
  medCheckboxes.forEach(cb => {
    cb.addEventListener('change', (e) => {
      const row = e.target.closest('tr') || e.target.closest('.med-card');
      const label = e.target.nextElementSibling;
      if (e.target.checked) {
        showToast('Medication recorded as administered at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        if (label) label.textContent = 'Taken';
        if (row) row.style.opacity = '0.65';
      } else {
        if (label) label.textContent = 'Pending';
        if (row) row.style.opacity = '1';
      }
    });
  });

  // 12. ADMIN DISPATCH ACTIONS
  const dispatchActionBtns = document.querySelectorAll('.action-dispatch-btn');
  dispatchActionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const row = e.target.closest('tr');
      const statusBadge = row?.querySelector('.status-pill');
      if (statusBadge) {
        statusBadge.className = 'status-pill status-active';
        statusBadge.innerHTML = '<i class="fa-solid fa-circle-dot" style="margin-right: 4px;"></i> On Site (Verified)';
        btn.textContent = 'Completed';
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline');
        btn.disabled = true;
        showToast('Shift assigned and caregiver notified via SMS!');
      }
    });
  });

  // 13. MODAL LOGIC
  window.openModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(modal => {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      });
    }
  });
});
