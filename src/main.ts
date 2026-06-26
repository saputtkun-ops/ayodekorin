import './style.css';

// ==========================================
// 1. MOBILE MENU TOGGLE
// ==========================================
const menuToggle = document.getElementById('menuToggle') as HTMLButtonElement | null;
const navLinks = document.getElementById('navLinks') as HTMLElement | null;

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('open');
  });

  // Close menu when clicking link
  const links = document.querySelectorAll('.nav-links a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      menuToggle.classList.remove('open');
    });
  });
}

// ==========================================
// 2. BEFORE/AFTER SLIDER INTERACTION
// ==========================================
const sliderContainer = document.getElementById('sliderContainer') as HTMLDivElement | null;
let isDragging = false;

function updateSlider(e: MouseEvent | TouchEvent): void {
  if (!isDragging || !sliderContainer) return;
  
  // Prevent default behavior to avoid scrolling on mobile during drag
  e.preventDefault(); 
  
  const rect = sliderContainer.getBoundingClientRect();
  let clientX = 0;
  
  if (e instanceof MouseEvent) {
    clientX = e.clientX;
  } else if (e.touches && e.touches.length > 0) {
    clientX = e.touches[0].clientX;
  }
  
  let x = clientX - rect.left;
  if (x < 0) x = 0;
  if (x > rect.width) x = rect.width;
  
  const percent = (x / rect.width) * 100;
  sliderContainer.style.setProperty('--pos', `${percent}%`);
}

if (sliderContainer) {
  sliderContainer.addEventListener('mousedown', () => {
    isDragging = true;
  });
  window.addEventListener('mouseup', () => {
    isDragging = false;
  });
  window.addEventListener('mousemove', updateSlider);

  sliderContainer.addEventListener('touchstart', () => {
    isDragging = true;
  }, { passive: false });
  window.addEventListener('touchend', () => {
    isDragging = false;
  });
  window.addEventListener('touchmove', updateSlider, { passive: false });
}

// ==========================================
// 3. 2x2 SERVICES GRID IMAGE SLIDERS
// ==========================================
const serviceCards = document.querySelectorAll('.service-card-new');

serviceCards.forEach(card => {
  const slider = card.querySelector('.service-slider') as HTMLDivElement | null;
  if (!slider) return;
  
  const images = slider.querySelectorAll('.slider-images-wrap img') as NodeListOf<HTMLImageElement>;
  const dots = slider.querySelectorAll('.slide-dots .dot') as NodeListOf<HTMLSpanElement>;
  const prevBtn = slider.querySelector('.slide-nav.prev') as HTMLButtonElement | null;
  const nextBtn = slider.querySelector('.slide-nav.next') as HTMLButtonElement | null;
  
  let currentIdx = 0;
  const maxIdx = images.length - 1;
  
  function showSlide(index: number): void {
    images.forEach(img => img.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    if (images[index]) images[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
    if (slider) slider.setAttribute('data-active-slide', index.toString());
    currentIdx = index;
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', (e: MouseEvent) => {
      e.stopPropagation();
      let next = currentIdx - 1;
      if (next < 0) next = maxIdx;
      showSlide(next);
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', (e: MouseEvent) => {
      e.stopPropagation();
      let next = currentIdx + 1;
      if (next > maxIdx) next = 0;
      showSlide(next);
    });
  }
  
  dots.forEach((dot, dotIdx) => {
    dot.addEventListener('click', (e: MouseEvent) => {
      e.stopPropagation();
      showSlide(dotIdx);
    });
  });
});

// ==========================================
// 4. LEAD CAPTURE MODAL MULTI-STEP LOGIC
// ==========================================
const modal = document.getElementById('consultationModal') as HTMLDivElement | null;
const triggerBtns = document.querySelectorAll('.btn-trigger-modal') as NodeListOf<HTMLButtonElement>;
const modalClose = document.getElementById('modalClose') as HTMLButtonElement | null;
const optCards = document.querySelectorAll('.service-opt-card') as NodeListOf<HTMLDivElement>;
const btnNextStep = document.querySelector('.btn-next-step') as HTMLButtonElement | null;
const btnPrevStep = document.querySelector('.btn-prev-step') as HTMLButtonElement | null;
const step1 = document.getElementById('modalStep1') as HTMLDivElement | null;
const step2 = document.getElementById('modalStep2') as HTMLDivElement | null;
const step3 = document.getElementById('modalStep3') as HTMLDivElement | null;
const leadForm = document.getElementById('leadForm') as HTMLFormElement | null;
const btnCloseSuccess = document.querySelector('.btn-close-success') as HTMLButtonElement | null;

let selectedService = '';

function resetModal(): void {
  if (step1) step1.classList.add('active');
  if (step2) step2.classList.remove('active');
  if (step3) step3.classList.remove('active');
  optCards.forEach(c => c.classList.remove('selected'));
  if (btnNextStep) btnNextStep.setAttribute('disabled', 'true');
  if (leadForm) leadForm.reset();
  selectedService = '';
}

function closeModal(): void {
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

if (modal) {
  // Open modal
  triggerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Lock scrolling
      resetModal();
    });
  });

  // Close modal handlers
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }
  if (btnCloseSuccess) {
    btnCloseSuccess.addEventListener('click', closeModal);
  }
  
  modal.addEventListener('click', (e: MouseEvent) => {
    if (e.target === modal) closeModal();
  });
}

// Select Service (Step 1)
optCards.forEach(card => {
  card.addEventListener('click', () => {
    optCards.forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedService = card.getAttribute('data-service') || '';
    if (btnNextStep) btnNextStep.removeAttribute('disabled');
  });
});

// Go to Step 2
if (btnNextStep && step1 && step2) {
  btnNextStep.addEventListener('click', () => {
    step1.classList.remove('active');
    step2.classList.add('active');
  });
}

// Back to Step 1
if (btnPrevStep && step1 && step2) {
  btnPrevStep.addEventListener('click', () => {
    step2.classList.remove('active');
    step1.classList.add('active');
  });
}

// Submit Form (Step 2 to Step 3)
async function submitLeadToTurso(name: string, whatsapp: string, note: string, selectedService: string): Promise<void> {
  const url = import.meta.env.VITE_TURSO_DATABASE_URL;
  const token = import.meta.env.VITE_TURSO_AUTH_TOKEN;

  if (!url || !token || token.includes("PLACEHOLDER")) {
    console.warn('Turso database URL atau token belum dikonfigurasi di file .env. Data tidak disimpan ke cloud.');
    return;
  }

  // Mengubah protokol libsql:// menjadi https:// untuk HTTP REST API
  const httpUrl = url.replace('libsql://', 'https://');

  try {
    const payload = {
      requests: [
        {
          type: 'execute',
          stmt: {
            sql: `CREATE TABLE IF NOT EXISTS leads (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT,
              whatsapp TEXT,
              note TEXT,
              selected_service TEXT,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`
          }
        },
        {
          type: 'execute',
          stmt: {
            sql: 'INSERT INTO leads (name, whatsapp, note, selected_service) VALUES (?, ?, ?, ?)',
            args: [
              { type: 'text', value: name },
              { type: 'text', value: whatsapp },
              { type: 'text', value: note },
              { type: 'text', value: selectedService }
            ]
          }
        },
        {
          type: 'close'
        }
      ]
    };

    const response = await fetch(`${httpUrl}/v2/pipeline`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('Data lead berhasil disimpan ke database Turso.');
  } catch (error) {
    console.error('Gagal menyimpan data lead ke Turso:', error);
  }
}

if (leadForm && step2 && step3) {
  leadForm.addEventListener('submit', async (e: Event) => {
    e.preventDefault();
    
    const clientNameInput = document.getElementById('clientName') as HTMLInputElement | null;
    const clientWhatsappInput = document.getElementById('clientWhatsapp') as HTMLInputElement | null;
    const clientSpaceInput = document.getElementById('clientSpace') as HTMLTextAreaElement | null;
    
    const name = clientNameInput ? clientNameInput.value : '';
    const whatsapp = clientWhatsappInput ? clientWhatsappInput.value : '';
    const note = clientSpaceInput ? clientSpaceInput.value : '';
    
    // Kirim data ke Turso database secara asinkron
    submitLeadToTurso(name, whatsapp, note, selectedService);
    
    // Go to success
    step2.classList.remove('active');
    step3.classList.add('active');
  });
}

// ==========================================
// 5. LOCAL IMAGE LIGHTBOX (CARD-CONFINED ZOOM)
// ==========================================
const sliderImages = document.querySelectorAll('.slider-images-wrap img') as NodeListOf<HTMLImageElement>;

function openLocalLightbox(img: HTMLImageElement): void {
  const card = img.closest('.service-card-new') as HTMLDivElement | null;
  if (!card) return;
  
  const localLightbox = card.querySelector('.local-lightbox') as HTMLDivElement | null;
  const localLightboxImg = card.querySelector('.local-lightbox-img') as HTMLImageElement | null;
  
  if (localLightbox && localLightboxImg) {
    localLightboxImg.src = img.src;
    localLightbox.classList.add('active');
    localLightbox.setAttribute('aria-hidden', 'false');
  }
}

function closeAllLocalLightboxes(): void {
  const activeLightboxes = document.querySelectorAll('.local-lightbox.active');
  activeLightboxes.forEach(lbox => {
    lbox.classList.remove('active');
    lbox.setAttribute('aria-hidden', 'true');
  });
}

// CLICK ON IMAGE TO ZOOM IN CARD
sliderImages.forEach(img => {
  img.addEventListener('click', (e: MouseEvent) => {
    e.stopPropagation();
    openLocalLightbox(img);
  });
});

// Close buttons for local lightboxes
const localCloseButtons = document.querySelectorAll('.local-close') as NodeListOf<HTMLSpanElement>;
localCloseButtons.forEach(btn => {
  btn.addEventListener('click', (e: MouseEvent) => {
    e.stopPropagation();
    const localLightbox = btn.closest('.local-lightbox') as HTMLDivElement | null;
    if (localLightbox) {
      localLightbox.classList.remove('active');
      localLightbox.setAttribute('aria-hidden', 'true');
    }
  });
});

// Tap/click on overlay background to close
const localLightboxes = document.querySelectorAll('.local-lightbox') as NodeListOf<HTMLDivElement>;
localLightboxes.forEach(lbox => {
  lbox.addEventListener('click', (e: MouseEvent) => {
    if (e.target === lbox) {
      lbox.classList.remove('active');
      lbox.setAttribute('aria-hidden', 'true');
    }
  });
});

// ESC key to close all zoomed previews
document.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    closeAllLocalLightboxes();
  }
});
