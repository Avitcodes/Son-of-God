document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initSmoothScroll();
  initScrollAnimations();
  initActiveNav();
  initCategoryCards();
  initDestCards();
});

/**
 * Header scroll effect — add background when scrolled
 */
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check
}

/**
 * Mobile navigation toggle
 */
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav__link');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    nav.classList.toggle('open');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      toggle.classList.remove('active');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/**
 * Active nav link on scroll
 */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-20% 0px -80% 0px' }
  );

  sections.forEach((section) => observer.observe(section));
}

/**
 * Scroll-triggered animations
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.service-card, .tour-card, .category-card, .dest-card, .testimonial-card'
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          entry.target.style.animationDelay = `${index % 6 * 0.1}s`;
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  animatedElements.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Add CSS for animate-in
  const style = document.createElement('style');
  style.textContent = `
    .animate-in {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Category cards - show programs on click
 */
function initCategoryCards() {
  const categoryCards = document.querySelectorAll('.category-card');
  const modal = document.getElementById('programsModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalPrograms = document.getElementById('modalPrograms');
  const closeBtn = document.querySelector('.programs-modal__close');
  const overlay = document.querySelector('.programs-modal__overlay');

  if (!modal || !categoryCards.length) return;

  // Programs data for each category
  const programsData = {
    'study-abroad': {
      title: 'Study Abroad Programs',
      programs: [
        { title: 'Undergraduate Programs', desc: 'Complete support for bachelor\'s degree applications to universities worldwide.' },
        { title: 'Graduate Programs', desc: 'Master\'s and PhD application assistance with scholarship opportunities.' },
        { title: 'Medical School Admissions', desc: 'Specialized guidance for medical school applications and requirements.' },
        { title: 'Engineering Programs', desc: 'Support for engineering degree applications and technical requirements.' },
        { title: 'Business School Admissions', desc: 'MBA and business program applications with GMAT/GRE support.' },
        { title: 'Scholarship Applications', desc: 'Assistance in finding and applying for international scholarships.' },
        { title: 'Language Programs', desc: 'English proficiency test preparation (IELTS, TOEFL) and language courses.' },
        { title: 'Exchange Programs', desc: 'Student exchange and study abroad semester programs.' },
        { title: 'Pre-University Preparation', desc: 'Foundation courses and pathway programs for international students.' },
        { title: 'Visa Processing for Students', desc: 'Student visa application support and documentation.' },
        { title: 'Accommodation Assistance', desc: 'Help finding student housing and accommodation options.' },
        { title: 'Post-Graduation Support', desc: 'Career guidance and work permit assistance after graduation.' }
      ]
    },
    'visa-applications': {
      title: 'Visa Application Services',
      programs: [
        { title: 'China Visa Services', desc: 'Tourist, business, and student visa applications for China.' },
        { title: 'Canada Visa Services', desc: 'Visitor, study, and work permit applications for Canada.' },
        { title: 'USA Visa Services', desc: 'B1/B2, F1, H1B, and other visa categories for the United States.' },
        { title: 'UK Visa Services', desc: 'Tourist, student, and work visa applications for the United Kingdom.' },
        { title: 'Australia Visa Services', desc: 'Visitor, student, and skilled migration visas for Australia.' },
        { title: 'Schengen Visa Services', desc: 'European Schengen visa applications for multiple countries.' },
        { title: 'Japan Visa Services', desc: 'Tourist and business visa applications for Japan.' },
        { title: 'Documentation Support', desc: 'Complete documentation preparation and review services.' }
      ]
    },
    'tourist-visas': {
      title: 'Tourist Visa Destinations',
      programs: [
        { title: 'China Tourist Visa', desc: 'Complete tourist visa services for exploring China\'s rich culture.' },
        { title: 'Canada Tourist Visa', desc: 'Visitor visa applications for Canada\'s scenic destinations.' },
        { title: 'USA Tourist Visa', desc: 'B1/B2 tourist visa applications for the United States.' },
        { title: 'UK Tourist Visa', desc: 'Standard visitor visa for exploring the United Kingdom.' },
        { title: 'Australia Tourist Visa', desc: 'Visitor visa applications for Australia\'s beautiful landscapes.' },
        { title: 'Europe Tourist Visas', desc: 'Schengen visa for multiple European countries.' },
        { title: 'Japan Tourist Visa', desc: 'Tourist visa applications for Japan.' },
        { title: 'Dubai Tourist Visa', desc: 'Tourist visa services for Dubai and UAE.' },
        { title: 'Singapore Tourist Visa', desc: 'Visitor visa applications for Singapore.' },
        { title: 'Thailand Tourist Visa', desc: 'Tourist visa services for Thailand.' },
        { title: 'Malaysia Tourist Visa', desc: 'Visitor visa applications for Malaysia.' },
        { title: 'South Africa Tourist Visa', desc: 'Tourist visa services for South Africa.' },
        { title: 'Brazil Tourist Visa', desc: 'Visitor visa applications for Brazil.' },
        { title: 'India Tourist Visa', desc: 'Tourist visa services for India.' },
        { title: 'New Zealand Tourist Visa', desc: 'Visitor visa applications for New Zealand.' }
      ]
    },
    'business-travel': {
      title: 'Business Travel Packages',
      programs: [
        { title: 'Business Visa Services', desc: 'B1 business visa applications for meetings and conferences.' },
        { title: 'Conference Attendance Support', desc: 'Visa and documentation for international conferences.' },
        { title: 'Corporate Travel Packages', desc: 'Complete business travel arrangements and visa processing.' },
        { title: 'Trade Mission Support', desc: 'Visa and documentation for trade missions and exhibitions.' },
        { title: 'Investor Visa Services', desc: 'Investment visa applications for business opportunities.' },
        { title: 'Work Permit Applications', desc: 'Temporary work permit and business visa processing.' },
        { title: 'Multi-Entry Business Visas', desc: 'Long-term business visas for frequent travelers.' },
        { title: 'Business Documentation', desc: 'Letter of invitation, business registration, and related documents.' },
        { title: 'Corporate Account Management', desc: 'Dedicated support for corporate clients.' },
        { title: 'Expedited Processing', desc: 'Fast-track business visa processing services.' }
      ]
    },
    'international-jobs': {
      title: 'International Job Opportunities',
      programs: [
        { title: 'Work Visa Applications', desc: 'H1B, L1, and other work visa processing for various countries.' },
        { title: 'Job Placement Services', desc: 'Connecting candidates with verified international employers.' },
        { title: 'Skilled Migration Programs', desc: 'Permanent residency through skilled migration programs.' },
        { title: 'Healthcare Jobs Abroad', desc: 'Medical professional job opportunities and visa support.' },
        { title: 'IT & Tech Jobs', desc: 'Technology sector job placements and work permits.' },
        { title: 'Engineering Opportunities', desc: 'Engineering job placements and professional visa support.' }
      ]
    },
    'documentation': {
      title: 'Documentation Services',
      programs: [
        { title: 'Bank Statement Preparation', desc: 'Professional bank statement formatting and verification.' },
        { title: 'Financial Documentation', desc: 'Complete financial proof preparation for visa applications.' },
        { title: 'Educational Document Verification', desc: 'Degree and transcript authentication services.' },
        { title: 'Employment Letters', desc: 'Professional employment verification letters and certificates.' },
        { title: 'Travel Insurance', desc: 'Travel insurance documentation and recommendations.' },
        { title: 'Medical Certificates', desc: 'Health checkup and medical certificate requirements.' },
        { title: 'Police Clearance Certificates', desc: 'Background check and clearance documentation.' },
        { title: 'Translation Services', desc: 'Professional document translation and notarization.' },
        { title: 'Notarization Services', desc: 'Document notarization and apostille services.' },
        { title: 'Passport Services', desc: 'Passport renewal and application assistance.' },
        { title: 'Birth Certificate Services', desc: 'Birth certificate procurement and verification.' },
        { title: 'Marriage Certificate Services', desc: 'Marriage certificate documentation and verification.' },
        { title: 'Power of Attorney', desc: 'Power of attorney documentation for international transactions.' },
        { title: 'Document Review', desc: 'Comprehensive review of all visa application documents.' },
        { title: 'Application Form Assistance', desc: 'Complete visa application form filling and submission support.' }
      ]
    }
  };

  // Open modal with programs
  function openModal(category) {
    const data = programsData[category];
    if (!data) return;

    modalTitle.textContent = data.title;
    modalPrograms.innerHTML = '';

    data.programs.forEach(program => {
      const programItem = document.createElement('div');
      programItem.className = 'program-item';
      programItem.innerHTML = `
        <div class="program-item__title">${program.title}</div>
        <div class="program-item__desc">${program.desc}</div>
      `;
      modalPrograms.appendChild(programItem);
    });

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Close modal
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Event listeners
  categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      const category = card.getAttribute('data-category');
      if (category) {
        openModal(category);
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  if (overlay) {
    overlay.addEventListener('click', closeModal);
  }

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/**
 * Destination cards - show destinations on click (Explore Our Tours)
 */
function initDestCards() {
  const destCards = document.querySelectorAll('.dest-card[data-destination]');
  const modal = document.getElementById('destinationsModal');
  const modalTitle = document.getElementById('destModalTitle');
  const modalList = document.getElementById('destModalList');
  const closeBtn = document.querySelector('.destinations-modal__close');
  const overlay = document.querySelector('.destinations-modal__overlay');

  if (!modal || !destCards.length) return;

  const destinationsData = {
    china: {
      title: 'China Destinations',
      places: [
        { name: 'Beijing', desc: 'Capital city, Great Wall & Forbidden City.', img:'./assets/images/beijing.jpg' },
        { name: 'Shanghai', desc: 'Modern skyline, The Bund & cultural sites.', img: './assets/images/shanghai.jpg' },
        { name: 'Xi\'an', desc: 'Terracotta Army & ancient capital.', img: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=400&q=80' },
        { name: 'Guilin', desc: 'Karst mountains & Li River cruises.', img: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=400&q=80' },
        { name: 'Chengdu', desc: 'Pandas & Sichuan cuisine.', img: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=400&q=80' },
        { name: 'Hangzhou', desc: 'West Lake & tea plantations.', img: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=400&q=80' },
        { name: 'Suzhou', desc: 'Classical gardens & canals.', img: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&q=80' },
        { name: 'Hong Kong', desc: 'Victoria Harbour & vibrant city life.', img: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=400&q=80' }
      ]
    },
    canada: {
      title: 'Canada Destinations',
      places: [
        { name: 'Toronto', desc: 'CN Tower, multicultural neighborhoods.', img: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=400&q=80' },
        { name: 'Vancouver', desc: 'Mountains, ocean & Stanley Park.', img: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400&q=80' },
        { name: 'Montreal', desc: 'Old Montreal, festivals & French culture.', img: './assets/images/montreal.jpg' },
        { name: 'Calgary', desc: 'Stampede, Banff gateway & Rockies.', img: './assets/images/calgary.jpg' },
        { name: 'Quebec City', desc: 'Historic old town & Château Frontenac.', img: './assets/images/quebec.jpg' },
        { name: 'Ottawa', desc: 'Parliament Hill & national museums.', img: './assets/images/ottawa.jpg' },
        { name: 'Victoria', desc: 'Gardens, harbor & British Columbia capital.', img: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400&q=80' },
        { name: 'Banff', desc: 'Lake Louise & Canadian Rockies.', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80' },
        { name: 'Niagara Falls', desc: 'Famous waterfalls & wine region.', img: 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=400&q=80' },
        { name: 'Halifax', desc: 'Maritime history & coastal charm.', img: './assets/images/halifax.jpg' },
        { name: 'Whistler', desc: 'Ski resorts & outdoor adventure.', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80' },
        { name: 'Edmonton', desc: 'West Edmonton Mall & river valley.', img: './assets/images/edmonton.jpg' }
      ]
    },
    usa: {
      title: 'USA Destinations',
      places: [
        { name: 'New York City', desc: 'Statue of Liberty, Broadway & museums.', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&q=80' },
        { name: 'Los Angeles', desc: 'Hollywood, beaches & theme parks.', img: 'https://images.unsplash.com/photo-1515896769750-31548aa180ed?w=400&q=80' },
        { name: 'San Francisco', desc: 'Golden Gate Bridge & Alcatraz.', img: './assets/images/san francisco.jpg' },
        { name: 'Las Vegas', desc: 'Entertainment, casinos & desert.', img: 'https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?w=400&q=80' },
        { name: 'Miami', desc: 'Beaches, Art Deco & nightlife.', img: 'https://images.unsplash.com/photo-1506966953602-c20cc11f75e3?w=400&q=80' },
        { name: 'Chicago', desc: 'Architecture, museums & lakefront.', img: 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=400&q=80' },
        { name: 'Washington D.C.', desc: 'Monuments, Capitol & Smithsonian.', img: './assets/images/washington.jpg' },
        { name: 'Boston', desc: 'History, universities & harbor.', img: './assets/images/boston.jpg' },
        { name: 'Seattle', desc: 'Space Needle, coffee & Puget Sound.', img: 'https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=400&q=80' },
        { name: 'Orlando', desc: 'Walt Disney World & theme parks.', img: './assets/images/orlando.jpg' },
        { name: 'Grand Canyon', desc: 'National park & natural wonder.', img: 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=400&q=80' },
        { name: 'New Orleans', desc: 'Jazz, French Quarter & cuisine.', img: './assets/images/new orleans.jpg' },
        { name: 'San Diego', desc: 'Zoo, beaches & perfect weather.', img: './assets/images/san diego.jpg' },
        { name: 'Denver', desc: 'Rocky Mountains gateway & craft beer.', img: './assets/images/denver.jpg' },
        { name: 'Hawaii', desc: 'Islands, volcanoes & tropical paradise.', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80' }
      ]
    },
    uk: {
      title: 'United Kingdom Destinations',
      places: [
        { name: 'London', desc: 'Big Ben, Buckingham Palace & museums.', img: './assets/images/london.jpg' },
        { name: 'Edinburgh', desc: 'Castle, festivals & Scottish culture.', img: './assets/images/edinburgh.jpg' },
        { name: 'Manchester', desc: 'Music, football & industrial heritage.', img: 'https://images.unsplash.com/photo-1523482580671-f216b1856bad?w=400&q=80' },
        { name: 'Birmingham', desc: 'Canals, culture & diverse dining.', img: 'https://images.unsplash.com/photo-1523482580671-f216b1856bad?w=400&q=80' },
        { name: 'Liverpool', desc: 'The Beatles, waterfront & history.', img: 'https://images.unsplash.com/photo-1523482580671-f216b1856bad?w=400&q=80' },
        { name: 'Oxford', desc: 'University city & dreaming spires.', img: 'https://images.unsplash.com/photo-1523482580671-f216b1856bad?w=400&q=80' },
        { name: 'Cambridge', desc: 'Colleges, punting & academia.', img: 'https://images.unsplash.com/photo-1523482580671-f216b1856bad?w=400&q=80' },
      ]
    },
    australia: {
      title: 'Australia Destinations',
      places: [
        { name: 'Sydney', desc: 'Opera House, Harbour Bridge & beaches.', img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&q=80' },
        { name: 'Brisbane', desc: 'River city & subtropical climate.', img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&q=80' },
        { name: 'Gold Coast', desc: 'Surfers Paradise & theme parks.', img: 'https://images.unsplash.com/photo-1507525428034-b20cc11f75e3?w=400&q=80' },
        { name: 'Cairns', desc: 'Great Barrier Reef gateway.', img: 'https://images.unsplash.com/photo-1507525428034-b20cc11f75e3?w=400&q=80' },
        { name: 'Adelaide', desc: 'Wine regions & festivals.', img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&q=80' },
        { name: 'Darwin', desc: 'Top End, wildlife & outdoor adventure.', img: 'https://images.unsplash.com/photo-1507525428034-b20cc11f75e3?w=400&q=80' },
        { name: 'Hobart', desc: 'MONA, history & Tasmanian wilderness.', img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&q=80' }
      ]
    },
    europe: {
      title: 'Europe Destinations',
      places: [
        { name: 'Paris', desc: 'Eiffel Tower, Louvre & romance.', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80' },
        { name: 'Rome', desc: 'Colosseum, Vatican & ancient history.', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&q=80' },
        { name: 'Barcelona', desc: 'Gaudí, beaches & tapas.', img: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&q=80' },
        { name: 'Amsterdam', desc: 'Canals, museums & cycling.', img: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400&q=80' },
        { name: 'Berlin', desc: 'History, nightlife & culture.', img: 'https://images.unsplash.com/photo-1560930950-5cc20e80e392?w=400&q=80' },
        { name: 'Prague', desc: 'Old Town, castle & beer.', img: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400&q=80' },
        { name: 'Vienna', desc: 'Palaces, music & coffee houses.', img: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400&q=80' },
        { name: 'Madrid', desc: 'Museums, parks & nightlife.', img: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&q=80' },
        { name: 'Lisbon', desc: 'Trams, tiles & Atlantic coast.', img: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400&q=80' },
        { name: 'Dublin', desc: 'Pubs, history & friendly vibe.', img: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400&q=80' },
        { name: 'Copenhagen', desc: 'Hygge, design & Nyhavn.', img: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400&q=80' },
        { name: 'Athens', desc: 'Acropolis & ancient Greece.', img: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400&q=80' },
        { name: 'Budapest', desc: 'Thermal baths & Danube views.', img: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400&q=80' },
        { name: 'Munich', desc: 'Oktoberfest & Bavarian culture.', img: 'https://images.unsplash.com/photo-1560930950-5cc20e80e392?w=400&q=80' },
        { name: 'Zurich', desc: 'Alps, lakes & finance hub.', img: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400&q=80' },
        { name: 'Florence', desc: 'Renaissance art & Tuscan hills.', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&q=80' }
      ]
    }
  };

  function openDestModal(key) {
    const data = destinationsData[key];
    if (!data) return;

    modalTitle.textContent = data.title;
    modalList.innerHTML = '';

    data.places.forEach(place => {
      const item = document.createElement('div');
      item.className = 'dest-item';
      item.innerHTML = `
        <div class="dest-item__img-wrap">
          <img src="${place.img}" alt="${place.name}" loading="lazy">
        </div>
        <div class="dest-item__info">
          <h3 class="dest-item__title">${place.name}</h3>
          <p class="dest-item__desc">${place.desc}</p>
        </div>
      `;
      modalList.appendChild(item);
    });

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDestModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  destCards.forEach(card => {
    card.addEventListener('click', () => {
      const key = card.getAttribute('data-destination');
      if (key) openDestModal(key);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDestModal);
  if (overlay) overlay.addEventListener('click', closeDestModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeDestModal();
    }
  });
}

