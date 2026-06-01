document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // SPA VIEW SWITCHER (ROUTER)
  // ==========================================
  const navLinks = document.querySelectorAll('.nav-link');
  const viewSections = document.querySelectorAll('.view-section');
  const triggers = document.querySelectorAll('.nav-trigger');

  // Navigate to a specific view
  function navigateTo(targetViewId) {
    const targetSection = document.getElementById(targetViewId);
    
    if (targetSection) {
      // Force scroll reset to top instantly so the new view doesn't open in the middle/bottom
      window.scrollTo(0, 0);

      // Hide all sections, remove active class
      viewSections.forEach(sec => {
        sec.classList.remove('active');
      });

      // Show active section
      targetSection.classList.add('active');

      // Update navbar links active class
      navLinks.forEach(link => {
        const viewAttr = link.getAttribute('data-view');
        if (viewAttr === targetViewId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      // Close mobile menu if open
      closeMobileMenu();
    }
  }

  // Handle Routing and Scrolling
  function handleRouting() {
    let hash = window.location.hash; // e.g. "#home" or "#videos"
    if (!hash || hash === '#') {
      hash = '#home'; // default
    }

    // Redirect contact to join
    if (hash === '#contact') {
      hash = '#join';
    }

    const targetElement = document.querySelector(hash);
    if (targetElement) {
      // Find parent view section
      const parentView = targetElement.closest('.view-section');
      if (parentView) {
        // Show correct view
        navigateTo(parentView.id);

        // Calculate offset and scroll
        setTimeout(() => {
          const header = document.querySelector('header');
          const headerHeight = header ? header.offsetHeight : 80;
          
          if (targetElement === parentView) {
            // Scroll to top of view-section (top of page)
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          } else {
            // Scroll to sub-section with header offset
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        }, 80); // layout delay
      }
    }
  }

  // Bind click listener to all anchor links starting with #
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      let targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      if (targetId === '#contact') {
        targetId = '#join';
      }

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        // If the hash is already what we clicked, hashchange won't fire, so manually navigate/scroll
        if (window.location.hash === targetId) {
          handleRouting();
        } else {
          window.location.hash = targetId;
        }
      }
      closeMobileMenu();
    });
  });




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
  // MEDIA COVERAGE SECTION LOGIC
  // ==========================================
  const mediaGrid = document.getElementById('media-grid');
  const loadMoreBtn = document.getElementById('load-more-btn');
  const loadMoreContainer = document.getElementById('load-more-container');
  const mediaFilterButtons = document.querySelectorAll('.media-filter-btn');
  
  const templates = {
    service: [
      { title: "असहाय लोगों की मदद", desc: "स्थानीय स्तर पर असहाय लोगों तक आवश्यक मदद पहुंचाना।" },
      { title: "सेवा एवं सहायता कार्य", desc: "गरीब और जरूरतमंद परिवारों को सहायता सामग्री एवं खाद्य सामग्री वितरण।" },
      { title: "रक्तदान शिविर का सफल आयोजन", desc: "संगठन के सदस्यों ने चिकित्सालय में रक्तदान कर मरीजों की सहायता की।" },
      { title: "अनाथालय में बच्चों को फल व स्टेशनरी वितरण", desc: "बाल गृह में जाकर बच्चों को फल, मिठाई और पाठ्य सामग्री प्रदान की गई।" },
      { title: "कड़ाके की ठंड में जरूरतमंदों को कंबल वितरण", desc: "कड़ाके की ठंड में बेघर और जरूरतमंद लोगों को कंबल बांटे गए।" },
      { title: "पशु-पक्षियों के लिए दाना-पानी अभियान", desc: "गर्मी के मौसम में बेजुबान पशु-पक्षियों के लिए पानी के सकोरे रखे गए।" },
      { title: "निर्धन कन्या के विवाह में संगठन का सहयोग", desc: "जरूरतमंद परिवार की बेटी के विवाह में संगठन द्वारा उपहार व आर्थिक सहयोग दिया गया।" }
    ],
    student: [
      { title: "छात्रों की समस्याओं के निवारण हेतु ज्ञापन", desc: "महाविद्यालय में पेयजल व लाइब्रेरी की समस्याओं को लेकर प्राचार्य को ज्ञापन सौंपा।" },
      { title: "परीक्षा शुल्क में बढ़ोतरी के खिलाफ प्रदर्शन", desc: "छात्रों के हित में परीक्षा शुल्क वृद्धि को वापस लेने की मांग की गई।" },
      { title: "ग्रामीण क्षेत्रों के स्कूलों में बुनियादी सुविधाओं की मांग", desc: "सरकारी स्कूलों में ब्लैकबोर्ड, शौचालय व अन्य सुविधाओं हेतु ज्ञापन।" },
      { title: "बोर्ड परीक्षाओं की तैयारी कर रहे छात्रों के लिए मार्गदर्शन", desc: "संगठन की ओर से छात्रों को परीक्षा की तनावमुक्त तैयारी हेतु टिप्स दिए गए।" },
      { title: "बिजली कटौती से बाधित हो रही पढ़ाई पर चिंता", desc: "रात में बिजली कटौती के कारण छात्रों की पढ़ाई प्रभावित होने का मुद्दा उठाया।" }
    ],
    public: [
      { title: "शहर की चरमराई सफाई व्यवस्था पर रोष", desc: "नगर पालिका को नगर की सड़कों व नालियों की सफाई व्यवस्था सुधारने की मांग।" },
      { title: "अस्पताल में डॉक्टरों व दवाओं की कमी का मुद्दा", desc: "जिला अस्पताल में डॉक्टरों की उपस्थिति व दवाओं की उपलब्धता सुनिश्चित करने की मांग।" },
      { title: "जर्जर सड़कों व अधूरे ओवरब्रिज के निर्माण की मांग", desc: "यातायात को सुचारू बनाने के लिए अधूरे ओवरब्रिज के निर्माण को शीघ्र पूरा करने की मांग।" },
      { title: "पेयजल संकट को लेकर नागरिकों का प्रदर्शन", desc: "वार्डों में पानी की किल्लत को दूर करने के लिए प्रशासन से गुहार लगाई।" },
      { title: "सड़क दुर्घटनाओं को रोकने हेतु संकेतक लगाने की मांग", desc: "ब्लाइंड स्पॉट्स पर जेब्रा क्रॉसिंग व चेतावनी बोर्ड लगाने की अपील की।" }
    ],
    awareness: [
      { title: "पर्यावरण संरक्षण के लिए वृहद पौधरोपण अभियान", desc: "संगठन द्वारा सार्वजनिक स्थलों व पार्कों में सैकड़ों पौधे लगाए गए।" },
      { title: "महिला सुरक्षा को लेकर कैंडल मार्च का आयोजन", desc: "महिलाओं के अधिकारों व सुरक्षा के प्रति जागरूकता के लिए कैंडल मार्च निकाला गया।" },
      { title: "यातायात नियमों के पालन हेतु जन जागरूकता अभियान", desc: "हेलमेट पहनने व सीट बेल्ट लगाने के लिए चालकों को गुलाब देकर जागरूक किया।" },
      { title: "नशा मुक्ति के खिलाफ जनचेतना अभियान", desc: "युवाओं को नशे के दुष्परिणामों के प्रति सचेत करने हेतु नुक्कड़ नाटक किया।" },
      { title: "जल संरक्षण व संवर्धन हेतु शपथ ग्रहण", desc: "नागरिकों को पानी की बर्बादी रोकने व वर्षा जल संचयन के लिए प्रेरित किया।" }
    ],
    employment: [
      { title: "मोहल्ले में सफाई अभियान और नालियों की मरम्मत की मांग", desc: "जलजमाव और गंदगी की समस्या से परेशान वार्डवासियों के साथ मिलकर नगर आयुक्त को ज्ञापन दिया।" },
      { title: "स्थानीय सड़कों के गड्ढे भरने के लिए विरोध प्रदर्शन", desc: "दुर्घटनाओं को रोकने और आवागमन को सुगम बनाने के लिए प्रशासन से जर्जर सड़कों को दुरुस्त करने की मांग की।" },
      { title: "वार्ड में नियमित कचरा उठाने के लिए जन आंदोलन", desc: "स्वच्छता व्यवस्था में सुधार के लिए स्थानीय निवासियों के साथ शांतिपूर्ण प्रदर्शन किया।" },
      { title: "पेयजल लाइनों के लीकेज को ठीक करने की गुहार", desc: "पेयजल की बर्बादी और गंदे पानी की आपूर्ति को लेकर जल संस्थान को शिकायत दर्ज कराई।" },
      { title: "स्ट्रीट लाइटों के बंद होने से बढ़ी सुरक्षा चिंता", desc: "वार्डों में बंद पड़ी स्ट्रीट लाइटों को तत्काल बदलने के लिए विद्युत विभाग को ज्ञापन सौंपा।" }
    ],
    organisation: [
      { title: "अनाथालय में फल और शिक्षण सामग्री का वितरण", desc: "बाल गृह के बच्चों के साथ समय बिताकर उन्हें फल, मिठाई और उपयोगी स्टेशनरी किट बांटी।" },
      { title: "बीमार और लावारिस पशुओं के इलाज के लिए एम्बुलेंस सेवा की मांग", desc: "आवारा और चोटिल गोवंश की देखरेख व उपचार के लिए प्रशासन से पशु चिकित्सा वाहन की मांग की।" },
      { title: "निर्धन कन्या के विवाह में संगठन ने दिया सहयोग", desc: "आर्थिक रूप से कमजोर परिवार की बेटी के विवाह के लिए संगठन द्वारा आवश्यक घरेलू सामान और सहायता राशि प्रदान की गई।" },
      { title: "गर्मी में पक्षियों के लिए सकोरे लगाने का अभियान", desc: "विभिन्न सार्वजनिक पार्कों और पेड़ों पर दाना-पानी के सकोरे लटकाकर पक्षियों के जीवन की रक्षा का संदेश दिया।" },
      { title: "वृद्धाश्रम में बुजुर्गों को भोजन व आवश्यक वस्तुओं की भेंट", desc: "बुजुर्गों का आशीर्वाद प्राप्त करने के साथ ही उन्हें मौसम के अनुकूल वस्त्र और दवाइयां प्रदान कीं।" }
    ]
  };

  function getCategoryHindiName(category) {
    switch (category) {
      case 'service': return 'समाज सेवा';
      case 'student': return 'छात्र एवं शिक्षा हित';
      case 'public': return 'जनहित मुद्दे';
      case 'awareness': return 'युवा जागरूकता / युवा भागीदारी';
      case 'employment': return 'सफाई / स्थानीय समस्या / नागरिक मुद्दे';
      case 'organisation': return 'जरूरतमंद / पशु सेवा / मानवीय सहायता';
      default: return 'मीडिया कवरेज';
    }
  }

  // Generate Media Items Database
  const categories = ['service', 'student', 'public', 'awareness', 'employment', 'organisation'];
  const mediaItems = [
    {
      img: 'assetsmedia-coverage/media-coverage (1).jpeg',
      title: 'कड़ाके की ठंड में जरूरतमंदों को कंबल वितरण',
      category: 'service',
      categoryName: getCategoryHindiName('service'),
      desc: 'युवा मंच संगठन के सदस्यों ने कड़ाके की ठंड में सड़कों पर जीवन यापन करने वाले बेसहारा और गरीब परिवारों को कंबल वितरित किए।'
    },
    {
      img: 'assetsmedia-coverage/media-coverage (8).jpeg',
      title: 'महाविद्यालयों में पेयजल व लाइब्रेरी की समस्याओं हेतु ज्ञापन',
      category: 'student',
      categoryName: getCategoryHindiName('student'),
      desc: 'महाविद्यालय में लंबे समय से व्याप्त पेयजल व लाइब्रेरी की बदहाली को लेकर संगठन ने प्राचार्य को ज्ञापन सौंपकर त्वरित कार्रवाई की मांग की।'
    },
    {
      img: 'assetsmedia-coverage/media-coverage (15).jpeg',
      title: 'अधूरे पुल व जर्जर सड़कों के निर्माण की मांग',
      category: 'public',
      categoryName: getCategoryHindiName('public'),
      desc: 'शहरी एवं ग्रामीण क्षेत्रों में खराब सड़कों व अधूरे पड़े ओवरब्रिज को शीघ्र पूरा करने की मांग को लेकर संगठन ने प्रदर्शन किया।'
    },
    {
      img: 'assetsmedia-coverage/media-coverage (21).jpeg',
      title: 'युवा जनचेतना एवं जागरूकता रैली का सफल आयोजन',
      category: 'awareness',
      categoryName: getCategoryHindiName('awareness'),
      desc: 'सामाजिक सरोकारों में युवाओं की भागीदारी बढ़ाने और समाजहित के प्रति प्रेरित करने के लिए भव्य जागरूकता अभियान चलाया गया।'
    },
    {
      img: 'assetsmedia-coverage/media-coverage (26).jpeg',
      title: 'नगर पालिका की उदासीन सफाई व्यवस्था पर रोष',
      category: 'employment',
      categoryName: getCategoryHindiName('employment'),
      desc: 'स्थानीय वार्डों में चरमराई सफाई व्यवस्था और नालियों की अव्यवस्था को दुरुस्त करने के लिए नगर पालिका प्रशासन के समक्ष प्रदर्शन किया गया।'
    },
    {
      img: 'assetsmedia-coverage/media-coverage (32).jpeg',
      title: 'पशु सेवा और मानवीय सहायता हेतु संगठन की पहल',
      category: 'organisation',
      categoryName: getCategoryHindiName('organisation'),
      desc: 'भीषण गर्मी के मौसम में बेजुबान पशु-पक्षियों के लिए पानी के सकोरे रखने के साथ ही निर्धन परिवारों को खाद्य सामग्री प्रदान की गई।'
    }
  ];
  let indexCounter = 0;

  for (let i = 1; i <= 95; i++) {
    // Exclude duplicates (49, 58, 61) and manually defined ones (1, 8, 15, 21, 26, 32)
    if (i === 49 || i === 58 || i === 61) continue;
    if (i === 1 || i === 8 || i === 15 || i === 21 || i === 26 || i === 32) continue;

    const category = categories[indexCounter % categories.length];
    const templateList = templates[category];
    const templateIndex = Math.floor(indexCounter / categories.length) % templateList.length;
    const template = templateList[templateIndex];
    const fileNum = i;

    mediaItems.push({
      img: `assetsmedia-coverage/media-coverage (${fileNum}).jpeg`,
      title: template.title,
      category: category,
      categoryName: getCategoryHindiName(category),
      desc: template.desc
    });

    indexCounter++;
  }

  // State Variables for Pagination & Filtering
  let currentFilter = 'all';
  let visibleCount = 6;
  let filteredItems = [...mediaItems];

  // Render function
  function renderMediaCards() {
    if (!mediaGrid) return;
    
    // Clear grid
    mediaGrid.innerHTML = '';
    
    // Slice items up to visibleCount
    const itemsToDisplay = filteredItems.slice(0, visibleCount);
    
    if (itemsToDisplay.length === 0) {
      mediaGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px 0;">कोई मीडिया कवरेज उपलब्ध नहीं है।</p>';
      if (loadMoreContainer) loadMoreContainer.style.display = 'none';
      return;
    }
    
    itemsToDisplay.forEach(item => {
      const card = document.createElement('div');
      card.className = 'media-card';
      card.setAttribute('data-cat', item.category);
      
      card.innerHTML = `
        <div class="media-card-img-wrapper">
          <img src="${item.img}" alt="${item.title}" class="media-card-img" loading="lazy">
        </div>
        <div class="media-card-body">
          <span class="media-card-tag cat-${item.category}">${item.categoryName}</span>
          <h4>${item.title}</h4>
          <p>${item.desc}</p>
          <button class="media-card-btn">पूरा देखें</button>
        </div>
      `;
      
      // Event listeners for Lightbox triggers (only the button opens the lightbox)
      const btn = card.querySelector('.media-card-btn');
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          openLightbox(item.img, item.title);
        });
      }
      
      mediaGrid.appendChild(card);
    });
    
    // Toggle Load More button visibility
    if (loadMoreContainer) {
      if (visibleCount >= filteredItems.length) {
        loadMoreContainer.style.display = 'none';
      } else {
        loadMoreContainer.style.display = 'block';
      }
    }
  }

  // Filter functionality
  if (mediaFilterButtons) {
    mediaFilterButtons.forEach(button => {
      button.addEventListener('click', () => {
        mediaFilterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        currentFilter = button.getAttribute('data-category');
        
        if (currentFilter === 'all') {
          filteredItems = [...mediaItems];
        } else {
          filteredItems = mediaItems.filter(item => item.category === currentFilter);
        }
        
        visibleCount = 6; // Reset pagination count on filter change
        renderMediaCards();
      });
    });
  }

  // Load More functionality
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      visibleCount += 6;
      renderMediaCards();
    });
  }

  // Initialize Rendering
  renderMediaCards();


  // ==========================================
  // LIGHTBOX POPUP LOGIC
  // ==========================================
  const lightboxModal = document.getElementById('media-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = lightboxModal ? lightboxModal.querySelector('.lightbox-close') : null;

  function openLightbox(imgSrc, title) {
    if (lightboxModal && lightboxImg) {
      lightboxImg.src = imgSrc;
      lightboxImg.alt = title;
      lightboxModal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
  }

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = ''; // Restore background scrolling
    }
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      // Close lightbox if clicking outside the image
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  // Close lightbox on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
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
    // Hide alert messages when user starts editing form fields
    const joinAlertSuccess = document.getElementById('join-alert-success');
    const joinAlertError = document.getElementById('join-alert-error');
    const joinFormInputs = joinForm.querySelectorAll('input, select, textarea');
    
    joinFormInputs.forEach(input => {
      input.addEventListener('input', () => {
        if (joinAlertSuccess) joinAlertSuccess.style.display = 'none';
        if (joinAlertError) joinAlertError.style.display = 'none';
      });
      input.addEventListener('change', () => {
        if (joinAlertSuccess) joinAlertSuccess.style.display = 'none';
        if (joinAlertError) joinAlertError.style.display = 'none';
      });
    });

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

      // Simple validation checks (only enforce core fields)
      if (!name || phone.length < 10 || !city || !state || !profession || !role) {
        showAlert('join-alert-success', 'join-alert-error', false);
        return;
      }

      // Prepare data
      const registrationData = {
        name,
        phone,
        whatsapp: document.getElementById('join-whatsapp') ? document.getElementById('join-whatsapp').value.trim() : '',
        age: document.getElementById('join-age') ? document.getElementById('join-age').value : '',
        city,
        state,
        profession,
        role,
        experience: experienceRadio ? experienceRadio.value : 'N/A',
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
    const contactAlertSuccess = document.getElementById('contact-alert-success');
    const contactAlertError = document.getElementById('contact-alert-error');
    const contactFormInputs = contactForm.querySelectorAll('input, select, textarea');

    contactFormInputs.forEach(input => {
      input.addEventListener('input', () => {
        if (contactAlertSuccess) contactAlertSuccess.style.display = 'none';
        if (contactAlertError) contactAlertError.style.display = 'none';
      });
      input.addEventListener('change', () => {
        if (contactAlertSuccess) contactAlertSuccess.style.display = 'none';
        if (contactAlertError) contactAlertError.style.display = 'none';
      });
    });

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

  // Set up listeners for hash change and page load
  window.addEventListener('hashchange', handleRouting);
  // Run on initial page load
  handleRouting();

});
