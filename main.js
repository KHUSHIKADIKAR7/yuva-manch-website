document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // SPA VIEW SWITCHER (ROUTER)
  // ==========================================
  const navLinks = document.querySelectorAll('.nav-link');
  const viewSections = document.querySelectorAll('.view-section');
  const triggers = document.querySelectorAll('.nav-trigger');

  // Navigate to a specific view
  function navigateTo(targetViewId) {
    const sectionId = `view-${targetViewId}`;
    const targetSection = document.getElementById(sectionId);
    
    if (targetSection) {
      // Hide all sections, remove active class
      viewSections.forEach(sec => {
        sec.classList.remove('active');
      });

      // Show active section
      targetSection.classList.add('active');

      // Update navbar links active class
      navLinks.forEach(link => {
        if (link.getAttribute('data-view') === targetViewId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      // Close mobile menu if open
      closeMobileMenu();

      // Scroll to top of page smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Handle Hash Changes
  function handleRouting() {
    let hash = window.location.hash.substring(1); // remove '#'
    if (!hash) {
      hash = 'home'; // default
    }
    navigateTo(hash);
  }

  // Bind Navbar links Click
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = link.getAttribute('data-view');
      window.location.hash = targetView;
    });
  });

  // Bind other triggers (buttons on pages linking to other tabs)
  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = trigger.getAttribute('data-view');
      window.location.hash = targetView;
    });
  });

  // Set up listeners for hash change and page load
  window.addEventListener('hashchange', handleRouting);
  // Run on initial page load
  handleRouting();


  // ==========================================
  // MOBILE NAVIGATION HAMBURGER MENU
  // ==========================================
  const hamburger = document.getElementById('hamburger-menu');
  const navMenu = document.getElementById('nav-links');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }

  function closeMobileMenu() {
    if (hamburger && navMenu) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    }
  }


  // ==========================================
  // GALLERY CATEGORY FILTER
  // ==========================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Toggle active button style
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-category');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-cat');
        
        if (filterValue === 'all') {
          item.style.display = 'block';
        } else if (itemCategory === filterValue) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });


  // ==========================================
  // FORM SUBMISSION HANDLERS
  // ==========================================

  // Helper for alert display
  function showAlert(successId, errorId, isSuccess) {
    const successAlert = document.getElementById(successId);
    const errorAlert = document.getElementById(errorId);

    if (isSuccess) {
      successAlert.style.display = 'block';
      errorAlert.style.display = 'none';
      
      // Auto hide after 5 seconds
      setTimeout(() => {
        successAlert.style.display = 'none';
      }, 5000);
    } else {
      successAlert.style.display = 'none';
      errorAlert.style.display = 'block';
    }
  }

  // 1. Join Us / Registration Form Submit
  const joinForm = document.getElementById('join-us-form');
  if (joinForm) {
    joinForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Form validation
      const name = document.getElementById('join-name').value.trim();
      const phone = document.getElementById('join-phone').value.trim();
      const city = document.getElementById('join-city').value.trim();
      const state = document.getElementById('join-state').value;
      const profession = document.getElementById('join-profession').value;
      const role = document.getElementById('join-role').value;
      const experienceRadio = document.querySelector('input[name="experience"]:checked');
      
      // Collect interest checkboxes
      const interests = [];
      document.querySelectorAll('input[name="interests"]:checked').forEach(cb => {
        interests.push(cb.value);
      });

      // Simple validation checks
      if (!name || phone.length < 10 || !city || !state || !profession || !role || !experienceRadio || interests.length === 0) {
        showAlert('join-alert-success', 'join-alert-error', false);
        return;
      }

      // Prepare data
      const registrationData = {
        name,
        phone,
        whatsapp: document.getElementById('join-whatsapp').value.trim(),
        age: document.getElementById('join-age').value,
        city,
        state,
        profession,
        role,
        experience: experienceRadio.value,
        interests: interests,
        message: document.getElementById('join-message').value.trim(),
        date: new Date().toISOString()
      };

      // Mock submit saving to localStorage
      let registrations = JSON.parse(localStorage.getItem('yms_registrations') || '[]');
      registrations.push(registrationData);
      localStorage.setItem('yms_registrations', JSON.stringify(registrations));

      console.log('New Registration Submitted:', registrationData);
      
      // Show success alert & reset form
      showAlert('join-alert-success', 'join-alert-error', true);
      joinForm.reset();
    });
  }

  // 2. Contact Form Submit
  const contactForm = document.getElementById('contact-us-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Form validation
      const name = document.getElementById('contact-name').value.trim();
      const phone = document.getElementById('contact-phone').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const location = document.getElementById('contact-location').value.trim();
      const subject = document.getElementById('contact-subject').value;
      const message = document.getElementById('contact-message').value.trim();

      if (!name || phone.length < 10 || !email || !location || !subject || !message) {
        showAlert('contact-alert-success', 'contact-alert-error', false);
        return;
      }

      // Prepare data
      const messageData = {
        name,
        phone,
        email,
        location,
        subject,
        message,
        date: new Date().toISOString()
      };

      // Mock submit saving to localStorage
      let messages = JSON.parse(localStorage.getItem('yms_messages') || '[]');
      messages.push(messageData);
      localStorage.setItem('yms_messages', JSON.stringify(messages));

      console.log('New Contact Message Submitted:', messageData);
      
      // Show success alert & reset form
      showAlert('contact-alert-success', 'contact-alert-error', true);
      contactForm.reset();
    });
  }

});
