




const initHeroBackground = () => {
  const container = document.getElementById('hero3dCanvas');
  if (!container) return;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  container.appendChild(canvas);

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);


  let mouseX = 0.5;
  let mouseY = 0.5;
  let targetMouseX = 0.5;
  let targetMouseY = 0.5;
  
  document.addEventListener('mousemove', (e) => {
    targetMouseX = e.clientX / window.innerWidth;
    targetMouseY = e.clientY / window.innerHeight;
  });


  const waves = [
    { amplitude: 80, frequency: 0.003, speed: 0.4, opacity: 0.15, yOffset: 0.5, color: { r: 108, g: 92, b: 231 } },
    { amplitude: 60, frequency: 0.004, speed: 0.6, opacity: 0.12, yOffset: 0.52, color: { r: 93, g: 208, b: 255 } },
    { amplitude: 100, frequency: 0.002, speed: 0.3, opacity: 0.08, yOffset: 0.48, color: { r: 140, g: 107, b: 255 } },
    { amplitude: 40, frequency: 0.005, speed: 0.8, opacity: 0.1, yOffset: 0.55, color: { r: 93, g: 208, b: 255 } },
  ];


  const orbs = [
    { x: 0.15, y: 0.25, radius: 400, color: { r: 108, g: 92, b: 231 }, opacity: 0.12, speed: 0.0003 },
    { x: 0.85, y: 0.7, radius: 350, color: { r: 93, g: 208, b: 255 }, opacity: 0.08, speed: 0.0004 },
    { x: 0.5, y: 0.9, radius: 500, color: { r: 140, g: 107, b: 255 }, opacity: 0.06, speed: 0.0002 },
  ];


  const isLightMode = () => document.documentElement.getAttribute('data-theme') === 'light';


  const drawBackground = () => {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    if (isLightMode()) {

      gradient.addColorStop(0, '#fdf2f8');
      gradient.addColorStop(0.5, '#fce7f3');
      gradient.addColorStop(1, '#f3e8ff');
    } else {
      gradient.addColorStop(0, '#0a0a12');
      gradient.addColorStop(0.5, '#050509');
      gradient.addColorStop(1, '#08080f');
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };


  const drawOrbs = (time) => {
    const lightMode = isLightMode();
    const opacityMultiplier = lightMode ? 2.5 : 1; // Increase opacity in light mode
    
    orbs.forEach((orb, i) => {
      const offsetX = Math.sin(time * orb.speed + i) * 50;
      const offsetY = Math.cos(time * orb.speed * 0.7 + i) * 30;
      const parallaxX = (mouseX - 0.5) * 30;
      const parallaxY = (mouseY - 0.5) * 20;
      
      const x = orb.x * canvas.width + offsetX + parallaxX;
      const y = orb.y * canvas.height + offsetY + parallaxY;
      
      const opacity = orb.opacity * opacityMultiplier;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, orb.radius);
      gradient.addColorStop(0, `rgba(${orb.color.r}, ${orb.color.g}, ${orb.color.b}, ${opacity})`);
      gradient.addColorStop(0.5, `rgba(${orb.color.r}, ${orb.color.g}, ${orb.color.b}, ${opacity * 0.3})`);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    });
  };


  const drawWaves = (time) => {
    const lightMode = isLightMode();
    const opacityMultiplier = lightMode ? 2 : 1;
    
    waves.forEach((wave, waveIndex) => {
      const baseY = canvas.height * wave.yOffset;
      const parallaxOffset = (mouseY - 0.5) * 20 * (waveIndex + 1) * 0.3;
      
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      
      for (let x = 0; x <= canvas.width; x += 3) {
        const y = baseY + parallaxOffset +
          Math.sin(x * wave.frequency + time * wave.speed) * wave.amplitude +
          Math.sin(x * wave.frequency * 2 + time * wave.speed * 1.5) * wave.amplitude * 0.3 +
          Math.sin(x * wave.frequency * 0.5 + time * wave.speed * 0.8) * wave.amplitude * 0.5;
        
        ctx.lineTo(x, y);
      }
      
      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();
      

      const opacity = wave.opacity * opacityMultiplier;
      const gradient = ctx.createLinearGradient(0, baseY - wave.amplitude, 0, canvas.height);
      gradient.addColorStop(0, `rgba(${wave.color.r}, ${wave.color.g}, ${wave.color.b}, ${opacity})`);
      gradient.addColorStop(0.3, `rgba(${wave.color.r}, ${wave.color.g}, ${wave.color.b}, ${opacity * 0.5})`);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.fill();
    });
  };


  const drawLightStreaks = (time) => {
    const streakCount = 5;
    
    for (let i = 0; i < streakCount; i++) {
      const y = canvas.height * (0.3 + i * 0.12);
      const progress = ((time * 0.05 + i * 0.3) % 1);
      const x = progress * (canvas.width + 400) - 200;
      const width = 200 + Math.sin(time + i) * 50;
      
      const gradient = ctx.createLinearGradient(x, y, x + width, y);
      gradient.addColorStop(0, 'transparent');
      gradient.addColorStop(0.5, `rgba(93, 208, 255, ${0.03 + Math.sin(time + i) * 0.02})`);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y - 1, width, 2);
    }
  };


  const drawCenterGlow = (time) => {
    const pulse = Math.sin(time * 0.5) * 0.02 + 0.98;
    const centerX = canvas.width * 0.5 + (mouseX - 0.5) * 50;
    const centerY = canvas.height * 0.4 + (mouseY - 0.5) * 30;
    
    const gradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, 300 * pulse
    );
    gradient.addColorStop(0, 'rgba(108, 92, 231, 0.08)');
    gradient.addColorStop(0.5, 'rgba(93, 208, 255, 0.03)');
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };


  const drawVignette = () => {
    const gradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, canvas.height * 0.3,
      canvas.width / 2, canvas.height / 2, canvas.width * 0.8
    );
    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };


  let time = 0;
  const animate = () => {
    requestAnimationFrame(animate);
    time += 0.016;


    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;


    drawBackground();
    drawOrbs(time);
    drawWaves(time);
    drawLightStreaks(time);
    drawCenterGlow(time);
    drawVignette();
  };

  animate();
};


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeroBackground);
} else {
  initHeroBackground();
}


const enableRevealAnimations = () => {
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );
  revealEls.forEach(el => observer.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('is-visible'));
  }
};


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', enableRevealAnimations);
} else {
      enableRevealAnimations();
}




const initClientsMarquee = () => {
  const marquee = document.getElementById('clientsMarquee');
  if (!marquee) return;
  
  let currentX = 0;
  let lastScrollY = window.scrollY;
  let velocity = 0;
  let targetVelocity = 0;
  const baseSpeed = 0.3;
  const scrollMultiplier = 1.5;
  
  const updateMarquee = () => {

    velocity += (targetVelocity - velocity) * 0.08;
    

    currentX -= velocity;
    

    const marqueeWidth = marquee.scrollWidth / 2;
    

    if (currentX <= -marqueeWidth) {
      currentX += marqueeWidth;
    } else if (currentX >= 0) {
      currentX -= marqueeWidth;
    }
    
    marquee.style.transform = `translateX(${currentX}px)`;
    

    targetVelocity += (baseSpeed - targetVelocity) * 0.015;
    
    requestAnimationFrame(updateMarquee);
  };
  

  requestAnimationFrame(updateMarquee);
  

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const scrollDelta = scrollY - lastScrollY;
    


    if (scrollDelta > 0) {
      targetVelocity = baseSpeed + Math.min(Math.abs(scrollDelta) * scrollMultiplier, 12);
    } else if (scrollDelta < 0) {
      targetVelocity = -baseSpeed - Math.min(Math.abs(scrollDelta) * scrollMultiplier, 12);
    }
    
    lastScrollY = scrollY;
  }, { passive: true });
  

  marquee.addEventListener('mouseenter', () => {
    targetVelocity = 0;
  });
  
  marquee.addEventListener('mouseleave', () => {
    targetVelocity = baseSpeed;
  });
};


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initClientsMarquee);
} else {
  initClientsMarquee();
}


const revealEls = document.querySelectorAll('.reveal');


const isHomePage = window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/');

if (!isHomePage) {
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealEls.forEach(el => observer.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('is-visible'));
  }
}


const counters = document.querySelectorAll('[data-counter]');

const runCounter = el => {
  const target = Number(el.getAttribute('data-counter')) || 0;
  let current = 0;
  const duration = 1200;
  const start = performance.now();

  const step = now => {
    const progress = Math.min((now - start) / duration, 1);
    current = Math.floor(target * progress);
    el.textContent = current + (target >= 20 ? '+' : '');
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
};

if (counters.length) {
  const cObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          cObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(c => cObserver.observe(c));
}


const scrollTopBtn = document.getElementById('scrollTopBtn');
if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


const initVideoModal = () => {
const videoModal = document.getElementById('videoModal');
const videoFrame = document.getElementById('videoFrame');
  const videoModalClose = document.getElementById('videoModalClose');
const videoCards = document.querySelectorAll('.video-card');
const heroPlayBtn = document.querySelector('.hero-play');

  if (!videoModal) return;

const openVideo = (src, videoType) => {
  if (!videoModal) return;
  
  const modalContent = videoModal.querySelector('.video-modal');
  if (!modalContent) return;
  
  // Clear existing content
  if (videoFrame) {
    videoFrame.src = '';
    videoFrame.style.display = 'none';
  }
  
  // Remove existing video element if any
  const existingVideo = modalContent.querySelector('video');
  if (existingVideo) {
    existingVideo.pause();
    existingVideo.src = '';
    existingVideo.remove();
  }
  
  if (videoType === 'hls' || (src && src.includes('.m3u8'))) {
    // HLS video - use HTML5 video element
    const video = document.createElement('video');
    video.controls = true;
    video.autoplay = true;
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'contain';
    
    // Check if browser supports HLS natively (Safari, iOS)
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      video.play().catch(err => console.warn('Video autoplay failed:', err));
    } else if (typeof Hls !== 'undefined' && Hls.isSupported()) {
      // Use HLS.js for browsers that don't support HLS natively
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(err => console.warn('Video autoplay failed:', err));
      });
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          console.error('HLS error:', data);
        }
      });
    } else {
      // Fallback: try to play anyway (might work in some browsers)
      video.src = src;
      video.play().catch(err => {
        console.warn('HLS video playback failed. Browser may not support HLS.');
      });
    }
    
    modalContent.appendChild(video);
  } else {
    // Regular iframe video (YouTube, Vimeo, etc.)
    if (videoFrame) {
      videoFrame.src = src + (src.includes('?') ? '&' : '?') + 'autoplay=1';
      videoFrame.style.display = 'block';
    }
  }
  
  videoModal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
};

const closeVideo = () => {
  if (!videoModal) return;
  
  const modalContent = videoModal.querySelector('.video-modal');
  
  // Stop video playback
  if (modalContent) {
    const video = modalContent.querySelector('video');
    if (video) {
      video.pause();
      video.src = '';
      video.remove();
    }
  }
  
  // Clear iframe
  if (videoFrame) {
    videoFrame.src = '';
    videoFrame.style.display = 'none';
  }
  
  videoModal.classList.remove('is-open');
  document.body.style.overflow = '';
};

videoCards.forEach(card => {

  if (card.classList.contains('video-coming-soon')) return;
  
  card.addEventListener('click', () => {
    const src = card.getAttribute('data-video');
    const isSteamVideo = card.getAttribute('data-steam-video') === 'true';
    const videoType = card.getAttribute('data-video-type');
    
    if (src) {
      if (isSteamVideo && videoType === 'hls') {
        // HLS video - play in modal
        openVideo(src, 'hls');
      } else if (isSteamVideo || src.includes('steampowered.com')) {
        // Regular Steam link - open in new tab
        window.open(src, '_blank');
      } else {
        // Other videos - play in modal
        openVideo(src);
      }
    }
  });
});

if (heroPlayBtn) {
  heroPlayBtn.addEventListener('click', () => {
    const src = heroPlayBtn.getAttribute('data-video');
    if (src) openVideo(src);
  });
}

  if (videoModalClose) {
    videoModalClose.addEventListener('click', closeVideo);
  }

  videoModal.addEventListener('click', e => {
    if (e.target === videoModal) closeVideo();
  });

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && videoModal.classList.contains('is-open')) {
      closeVideo();
    }
  });
};


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initVideoModal);
} else {
  initVideoModal();
}


if (scrollTopBtn) {
  const handleScrollTopVisibility = () => {
    const y = window.scrollY || window.pageYOffset;
    const scrollTopLabel = document.querySelector('.scroll-top-label');
    
    if (y > window.innerHeight * 0.4) {
      scrollTopBtn.classList.add('visible');
      if (scrollTopLabel) {
        scrollTopLabel.classList.add('visible');
      }
    } else {
      scrollTopBtn.classList.remove('visible');
      if (scrollTopLabel) {
        scrollTopLabel.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScrollTopVisibility);
  handleScrollTopVisibility();
}


const initSectionVisibilityTracking = () => {
  const sections = document.querySelectorAll('section.hero, section.section');
  
  if (sections.length === 0 || !('IntersectionObserver' in window)) {
    return;
  }
  
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {

          entry.target.classList.add('section-visible');
        } else {

          entry.target.classList.remove('section-visible');
        }
      });
    },
    { 
      threshold: [0.1, 0.3, 0.5], // Multiple thresholds for smoother transitions
      rootMargin: '-50px 0px -50px 0px' // Trigger slightly before/after section enters viewport
    }
  );
  
  sections.forEach(section => {
    sectionObserver.observe(section);
  });
};


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSectionVisibilityTracking);
} else {
  initSectionVisibilityTracking();
}


const initWorkStickyScroll = () => {
  const section = document.querySelector('.work-sticky-section');
  if (!section) return;
  
  const cards = section.querySelectorAll('.work-sticky-card');
  const dots = section.querySelectorAll('.work-sticky-dot');
  
  if (cards.length === 0) return;
  
  let currentIndex = 0;
  
  const goToCard = (index) => {
    if (index === currentIndex) return;
    

    cards.forEach((card, i) => {
      card.classList.remove('is-active');
      if (i === index) {
        card.classList.add('is-active');
      }
    });
    

    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index);
    });
    
    currentIndex = index;
  };
  

  if (cards[0]) cards[0].classList.add('is-active');
  if (dots[0]) dots[0].classList.add('is-active');
  
  const handleWorkScroll = () => {
    const rect = section.getBoundingClientRect();
    const sectionHeight = section.offsetHeight;
    const viewportHeight = window.innerHeight;
    


    const triggerStart = viewportHeight * 0.7;
    

    const scrolled = triggerStart - rect.top;
    

    const totalDistance = sectionHeight - viewportHeight * 0.5;
    

    const progress = Math.max(0, Math.min(1, scrolled / totalDistance));
    

    const cardCount = cards.length;
    const cardIndex = Math.min(Math.floor(progress * cardCount), cardCount - 1);
    
    goToCard(cardIndex);
  };
  

  cards.forEach((card, index) => {
    card.addEventListener('click', () => {
      goToCard(index);
    });
  });
  

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToCard(index);
    });
  });
  

  window.addEventListener('scroll', handleWorkScroll, { passive: true });
  

  handleWorkScroll();
};


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWorkStickyScroll);
} else {
  initWorkStickyScroll();
}


const initTestimonialsStickyScroll = () => {
  const section = document.querySelector('.testimonials-sticky-section');
  if (!section) return;
  
  const cards = section.querySelectorAll('.testimonial-sticky-card');
  const dots = section.querySelectorAll('.testimonial-sticky-dot');
  
  if (cards.length === 0) return;
  
  let currentIndex = 0;
  
  const goToCard = (index) => {
    if (index === currentIndex) return;
    

    cards.forEach((card, i) => {
      card.classList.remove('is-active', 'is-prev');
      if (i < index) {
        card.classList.add('is-prev');
      } else if (i === index) {
        card.classList.add('is-active');
      }
    });
    

    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index);
    });
    
    currentIndex = index;
  };
  
  const handleScroll = () => {
    const rect = section.getBoundingClientRect();
    const sectionHeight = section.offsetHeight;
    const viewportHeight = window.innerHeight;
    

    const scrolled = -rect.top;
    const scrollableHeight = sectionHeight - viewportHeight;
    const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight));
    

    const cardCount = cards.length;
    const cardIndex = Math.min(Math.floor(progress * cardCount), cardCount - 1);
    
    goToCard(cardIndex);
  };
  

  window.addEventListener('scroll', handleScroll, { passive: true });
  

  handleScroll();
};


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTestimonialsStickyScroll);
} else {
  initTestimonialsStickyScroll();
}


const siteHeader = document.querySelector('header');
if (siteHeader) {
  const handleHeaderState = () => {
    const y = window.scrollY || window.pageYOffset;
    if (y > 20) {
      siteHeader.classList.add('header-solid');
    } else {
      siteHeader.classList.remove('header-solid');
    }
  };

  window.addEventListener('scroll', handleHeaderState);
  handleHeaderState();
}


const portfolioPills = document.querySelectorAll('.pill[data-scroll]');
const portfolioTabContents = document.querySelectorAll('.portfolio-tab-content');

if (portfolioPills.length) {

  const switchTab = (tabName) => {

    portfolioTabContents.forEach(content => {
      content.style.display = 'none';
    });


    const selectedContent = document.querySelector(`.portfolio-tab-content[data-tab="${tabName}"]`);
    if (selectedContent) {
      selectedContent.style.display = '';
      

      if (tabName === 'music') {
        setTimeout(() => {
          initMusicPlayer();
        }, 100);
      }
    }


    portfolioPills.forEach(p => p.classList.remove('is-active'));
    const activePill = document.querySelector(`.pill[data-scroll="#${tabName}"]`);
    if (activePill) {
      activePill.classList.add('is-active');
    }
  };

  portfolioPills.forEach(pill => {
    pill.addEventListener('click', e => {
      e.preventDefault();
      const targetSelector = pill.getAttribute('data-scroll');
      const tabName = targetSelector ? targetSelector.replace('#', '') : null;

      if (tabName) {
        switchTab(tabName);
      }
    });
  });


  if (portfolioTabContents.length > 0) {
    switchTab('credits');
  }
}


const typingEl = document.getElementById('heroTyping');
let typingTimeout = null;
let wordIndex = 0;
let charIndex = 0;
let deleting = false;
let settled = false;

const getTypingWords = (lang) => {
  if (!typingEl) return ['sound', 'music', 'audio'];
  const wordsAttr = lang === 'tr' ? 'data-words-tr' : 'data-words-en';
  const wordsStr = typingEl.getAttribute(wordsAttr) || (lang === 'tr' ? '["ses","müzik","melodi"]' : '["sound","music","audio"]');
  return JSON.parse(wordsStr);
};

const initTypingEffect = (lang) => {
  if (!typingEl) return;
  

  if (typingTimeout) {
    clearTimeout(typingTimeout);
  }
  wordIndex = 0;
  charIndex = 0;
  deleting = false;
  settled = false;
  
  const words = getTypingWords(lang);

  const typeNext = () => {
    if (settled) return;
    const currentWord = words[wordIndex];

    if (!deleting) {
      charIndex++;
      const text = ' ' + currentWord.slice(0, charIndex);
      typingEl.innerHTML = text + '<span class="typing-cursor">|</span>';

      typingEl.setAttribute('data-text', ' ' + currentWord.slice(0, charIndex));
      if (charIndex === currentWord.length) {
        if (wordIndex === words.length - 1) {

          settled = true;
          const text = ' ' + currentWord;
          typingEl.innerHTML = text + '<span class="typing-cursor">|</span>';
          typingEl.setAttribute('data-text', text);
          return;
        }
        deleting = true;
        typingTimeout = setTimeout(typeNext, 900);
        return;
      }
    } else {
      charIndex--;
      const text = ' ' + currentWord.slice(0, charIndex);
      typingEl.innerHTML = text + '<span class="typing-cursor">|</span>';
      typingEl.setAttribute('data-text', text);
      if (charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }

    const speed = deleting ? 60 : 90;
    typingTimeout = setTimeout(typeNext, speed);
  };


  typingTimeout = setTimeout(typeNext, 500);
};

if (typingEl) {
  initTypingEffect('en');
}


const translations = {
  en: {
    'music.player.default': 'Click a track to play',
    'music.player.playing': 'Now playing:',
    'music.player.paused': 'Paused:',
    'music.player.error': 'Error: Could not load audio. Please try another track.',
    'about.hero.kicker': 'ABOUT',
    'about.hero.title': 'About Us',
    'about.hero.subtitle': 'Istanbul-based game audio studio. Sound design, music, and technical audio - all from one focused team.',
    'about.section.kicker': 'ABOUT THE STUDIO',
    'about.section.title': '4GameAudio - An audio studio built for game makers.',
    'about.section.subtitle': 'We are a passionate team of sound designers, composers, and technical audio experts based in Istanbul. We provide professional audio solutions for games.',
    'about.stats.members': 'Team members',
    'about.stats.projects': 'Projects shipped',
    'about.stats.years': 'Years of experience',
    'about.card.hover': 'Hover to explore',
    'about.card1.title': 'Who We Are',
    'about.card1.text': 'Founded in Istanbul, 4GameAudio brings together musicians, composers, and sound engineers with decades of combined experience in live performance, studio production, and game audio.',
    'about.card2.title': 'Our Services',
    'about.card2.text': 'Music production & composition, sound design & SFX, sonic branding & jingles, mixing & mastering, live sound engineering, and Wwise/FMOD integration for games.',
    'about.card3.title': 'How We Work',
    'about.card3.text': 'We integrate seamlessly into your project process. Wwise, FMOD, Unity, Unreal - we work with your tools and ensure regular communication and transparent process management.',
    'about.card4.title': 'Our Tools',
    'about.card4.text': 'Pro Tools, Ableton, Logic Pro, Wwise, FMOD, synthesizers, DAWs, and professional studio equipment. Our team operates dedicated recording and mixing studios.',
    'about.card5.title': 'Why Choose Us',
    'about.card5.text': 'Stage-tested musicians, studio-trained engineers, and game audio specialists. We bring real-world performance experience and technical expertise to every project.',
    'about.team.kicker': 'Team',
    'about.team.title': 'Meet the Team',
    'about.team.subtitle': 'The talented individuals behind our audio production.',
    'about.team.seeMore': 'See more',
    'about.team.strengths': 'Strengths',
    'about.team.biography': 'Biography',
    'about.team.member1.strengths': '14 years of professional guitar experience shaped by stage performances and live music productions. Expert in music production, sound design, and audio implementation for games.',
    'about.team.member2.strengths': '6 years of classical and jazz education at Istanbul University State Conservatory and Yıldız Technical University. Expert in composition, orchestration, and adaptive music systems.',
    'about.team.member3.strengths': 'Trained in double bass at Istanbul Avni Akyol Fine Arts High School, continued at YTU Jazz. Expert in bass guitar, synthesizers, DAWs, and game audio sound design.',
    'about.team.member4.strengths': 'Nearly 5 years of studio experience in album production, TV/film sound design, mixing and mastering. Expert in FOH/monitor engineering, Wwise integration and technical sound design.',
    'about.team.member1.description': 'Musician and music producer specializing in live performance, music production, and sound design. 14 years of professional guitar experience.',
    'about.team.member2.description': 'Composer and sound designer combining academic music discipline with stage energy and modern production. 6 years of classical and jazz education.',
    'about.team.member1.kicker': 'Team Member',
    'about.team.member1.name': 'Emirhan Özer',
    'about.team.member1.role': 'Musician & Music Producer',
    'about.team.member1.title': 'About',
    'about.team.member1.subtitle': 'Musician and music producer specializing in live performance, music production, and sound design. 14 years of professional guitar experience.',
    'about.team.member1.bioTitle': 'Biography',
    'about.team.member1.bio': 'A musician and music producer who maintains live music performance, music production, and sound design as independent areas of expertise. 14 years of professional guitar experience has been shaped by stage performances, concert projects, and live music productions. As a music producer, has been involved in numerous single and album projects with different artists, taking an active role in recording, arrangement, and production processes. Extends production practice to sound design, commercial branding, jingles, and sonic branding, creating unique and memorable auditory identities for brands. Uses this experience at 4GameAudio to create comprehensive sound worlds for games, encompassing sound design, music production, and audio implementation processes.',
    'about.team.member1.contactTitle': 'Contact',
    'about.team.member1.email': 'Email: <a href="mailto:emirhanozer@4gameaudio.com">emirhanozer@4gameaudio.com</a>',
    'about.team.member1.workHistoryTitle': 'Work History',
    'about.team.member1.work1.title': 'Lead Sound Designer - Epic Games Studio',
    'about.team.member1.work1.period': '2020 - Present',
    'about.team.member1.work1.description': 'Led audio team for multiple AAA titles, implementing interactive sound systems using Wwise and FMOD. Collaborated with game designers to create adaptive audio that responds to player actions and game state.',
    'about.team.member1.work2.title': 'Senior Sound Designer - Indie Game Collective',
    'about.team.member1.work2.period': '2017 - 2020',
    'about.team.member1.work2.description': 'Created complete audio pipelines for indie games, from sound design to implementation. Worked on award-winning titles that received recognition for innovative audio design.',
    'about.team.member1.work3.title': 'Sound Designer - Mobile Game Studio',
    'about.team.member1.work3.period': '2014 - 2017',
    'about.team.member1.work3.description': 'Designed and implemented audio for mobile games, optimizing for performance and file size. Created sound libraries and templates used across multiple projects.',
    'about.team.member1.projectsTitle': 'Notable Projects',
    'about.team.member1.project1': '"Epic Quest" - AAA Action RPG (2022)',
    'about.team.member1.project2': '"Neon City" - Cyberpunk Shooter (2021)',
    'about.team.member1.project3': '"Mystic Realms" - Fantasy Adventure (2020)',
    'about.team.member1.project4': '"Indie Gem" - Award-winning Indie Title (2019)',
    'about.team.member1.project5': '"Mobile Legends" - Mobile Strategy Game (2018)',
    'about.team.member1.concertsTitle': 'Live Performances & Concerts',
    'about.team.member1.concert1': 'Istanbul Jazz Festival 2023 - Featured Guitarist',
    'about.team.member1.concert2': 'Akbank Jazz Festival 2022 - Live Performance',
    'about.team.member1.concert3': 'Babylon Istanbul 2021 - Solo Concert Series',
    'about.team.member1.concert4': 'Zorlu PSM 2020 - Opening Act',
    'about.team.member1.concert5': 'Salon IKSV 2019 - Acoustic Session',
    'about.team.member2.kicker': 'Team Member',
    'about.team.member2.name': 'Çınar Can İçli',
    'about.team.member2.role': 'Composer & Sound Designer',
    'about.team.member2.title': 'About',
    'about.team.member2.subtitle': 'Composer and sound designer combining academic music discipline with stage energy and modern production. 6 years of classical and jazz education.',
    'about.team.member2.bioTitle': 'Biography',
    'about.team.member2.bio': 'A composer and sound designer who combines academic music discipline with stage energy and modern production. 6 years of classical and jazz education at Istanbul University State Conservatory and Yıldız Technical University, blended with hundreds of concert performances across Turkey and published projects. Actively works on sonic branding and jingle projects for commercial brands. Uses this versatile experience at 4GameAudio for detailed SFX designs that define game atmospheres, compositions across different genres, and sonic branding work that gives identity to brands.',
    'about.team.member2.contactTitle': 'Contact',
    'about.team.member2.email': 'Email: <a href="mailto:cinarcanicli@4gameaudio.com">cinarcanicli@4gameaudio.com</a>',
    'about.team.member2.workHistoryTitle': 'Work History',
    'footer.text': '© 2025 4GAMEAUDIO. All rights reserved.',
    'footer.thanks': 'Special thanks to:',
    'footer.credits': 'SUAY AKBUDAK',
    'footer.and': '❤️',
    'footer.credits2': 'SELİN DEMİR',
    'about.team.member2.work1.title': 'Music Director - Symphony Interactive',
    'about.team.member2.work1.period': '2019 - Present',
    'about.team.member2.work1.description': 'Composed and directed music for multiple AAA titles, leading orchestras and working with live musicians. Developed adaptive music systems that seamlessly transition based on gameplay intensity and narrative moments.',
    'about.team.member2.work2.title': 'Composer - Indie Sound Collective',
    'about.team.member2.work2.period': '2016 - 2019',
    'about.team.member2.work2.description': 'Created original soundtracks for indie games, blending electronic and orchestral elements. Composed music for games that received critical acclaim and won awards for best soundtrack.',
    'about.team.member2.work3.title': 'Freelance Composer',
    'about.team.member2.work3.period': '2013 - 2016',
    'about.team.member2.work3.description': 'Composed music for various game projects, commercials, and short films. Built a diverse portfolio spanning multiple genres and styles.',
    'about.team.member2.concertsTitle': 'Live Performances & Concerts',
    'about.team.member2.concert1': 'Game Music Festival 2023 - Orchestral Performance',
    'about.team.member2.concert2': 'Indie Game Music Showcase 2022 - Live Concert',
    'about.team.member2.concert3': 'Video Game Orchestra Tour 2021 - Multiple Cities',
    'about.team.member2.concert4': 'Game Audio Network Guild Awards 2020 - Featured Performance',
    'about.team.member2.concert5': 'PAX East 2019 - Live Music Panel',
    'about.team.member2.projectsTitle': 'Notable Projects',
    'about.team.member2.project1': '"Epic Quest" - Full Orchestral Score (2022)',
    'about.team.member2.project2': '"Neon City" - Electronic Soundtrack (2021)',
    'about.team.member2.project3': '"Mystic Realms" - Fantasy Orchestral (2020)',
    'about.team.member2.project4': '"Indie Gem" - Award-winning Score (2019)',
    'about.team.member2.project5': '"Mobile Legends" - Adaptive Music System (2018)',
    

    'about.team.member3.name': 'Atakan Kotiloğlu',
    'about.team.member3.role': 'Bass Guitarist & Sound Designer',
    'about.team.member3.description': 'Bass guitarist and sound designer combining stage and studio experience with game audio. Active in projects Gevende, Selin Geçit, Dilan Balkay, and Kristal Kit.',
    'about.team.member3.kicker': 'Team Member',
    'about.team.member3.title': 'About',
    'about.team.member3.subtitle': 'Bass guitarist and sound designer bridging live music with interactive game audio.',
    'about.team.member3.bioTitle': 'Biography',
    'about.team.member3.bio': 'Atakan Kotiloğlu, whose foundations were laid with double bass training at Istanbul Avni Akyol Fine Arts High School, continued his academic development at Yıldız Technical University, Department of Music and Performing Arts (Jazz). He enriched the critical role of bass instruments in an ensemble, both rhythmically and frequency-focused, with the use of synthesizers and DAWs. Currently, he undertakes bass guitar, synth, and backing vocal roles in the projects Gevende, Selin Geçit, Dilan Balkay, and Kristal Kit. Atakan, who combines his wide range of sounds in stage and studio musician performances with the interactive dynamics of the gaming world, carries out his new projects and sound design processes under the umbrella of 4 Game Audio.',
    'about.team.member3.contactTitle': 'Contact',
    'about.team.member3.email': 'Email: <a href="mailto:atakan@4gameaudio.com">atakan@4gameaudio.com</a>',
    'about.team.member3.workHistoryTitle': 'Work History',
    'about.team.member3.work1.title': 'Bass Guitarist & Sound Designer - 4 Game Audio',
    'about.team.member3.work1.period': '2024 - Present',
    'about.team.member3.work1.description': 'Sound design and music production for games. Combining live music expertise with interactive audio.',
    'about.team.member3.work2.title': 'Session Musician - Various Projects',
    'about.team.member3.work2.period': '2018 - Present',
    'about.team.member3.work2.description': 'Bass guitar, synth, and backing vocals for Gevende, Selin Geçit, Dilan Balkay, and Kristal Kit.',
    'about.team.member3.projectsTitle': 'Notable Projects',
    'about.team.member3.project1': 'Gevende - Bass Guitar & Synth',
    'about.team.member3.project2': 'Selin Geçit - Session Musician',
    'about.team.member3.project3': 'Kristal Kit - Bass Guitar & Backing Vocals',
    

    'about.team.member4.name': 'Mehmet Arif Cengiz',
    'about.team.member4.role': 'Sound Engineer & Technical Audio Designer',
    'about.team.member4.description': 'Sound engineer with nearly 5 years of studio experience in album production, TV/film sound design, mixing and mastering.',
    'about.team.member4.kicker': 'Team Member',
    'about.team.member4.title': 'About',
    'about.team.member4.subtitle': 'Sound engineer specializing in FOH/monitor engineering, Wwise integration and technical sound design for games.',
    'about.team.member4.bioTitle': 'Biography',
    'about.team.member4.bio': 'Born in 1990, Mehmet Arif Cengiz first encountered technology with computers in 1995; as an active gamer since childhood, he embraced the digital world at an early age. Growing up in a musical family, he was surrounded by instruments and sound equipment, and took his first steps into professional music at a young age playing guitar and drums. After a year as a studio assistant, he won first place in the Music Technologies department at Istanbul Technical University in 2012; however, since he entered the industry at the same time, he preferred practical experience and ended his education in his second year. In his nearly five-year studio career, he worked in album production, sound design for TV series and films, mixing, and mastering. Since 2015, Cengiz has been working as a FOH and monitor engineer in live music, and currently operates his own studio; combining his studio and stage experience with Wwise integration and technical sound design to create living sound worlds for games.',
    'about.team.member4.contactTitle': 'Contact',
    'about.team.member4.email': 'Email: <a href="mailto:mehmetarifcengiz@4gameaudio.com">mehmetarifcengiz@4gameaudio.com</a>',
    'about.team.member4.workHistoryTitle': 'Work History',
    'about.team.member4.work1.title': 'FOH & Monitor Engineer',
    'about.team.member4.work1.period': '2015 - Present',
    'about.team.member4.work1.description': 'Working as a FOH and monitor engineer in live music productions. Operating his own studio for recording, mixing and mastering.',
    'about.team.member4.work2.title': 'Studio Sound Engineer',
    'about.team.member4.work2.period': '2012 - 2015',
    'about.team.member4.work2.description': 'Nearly 5 years of studio experience in album production, sound design for TV series and films, mixing and mastering.',
    'about.team.member4.projectsTitle': 'Notable Projects',
    'about.team.member4.project1': 'Various Album Productions - Studio Engineer',
    'about.team.member4.project2': 'TV Series & Film Sound Design',
    'about.team.member4.project3': 'Live Concert FOH Engineering',
    
    'home.testimonials.kicker': 'TESTIMONIALS',
    'home.testimonials.title': '"They stayed with us from prototype to launch."',
    'home.testimonials.subtitle': 'What partners, publishers, and teams say about working with us.',
    'home.testimonials.card1.name': 'Kaan Yılmaz',
    'home.testimonials.card1.role': 'Audio Lead, Peak Games',
    'home.testimonials.card2.name': 'Elif Demir',
    'home.testimonials.card2.role': 'Creative Director, TaleWorlds',
    'home.testimonials.card3.text': 'Their attention to detail in sound design brought our game world to life. The ambient soundscapes and character audio exceeded our expectations.',
    'home.testimonials.card3.name': 'Burak Özkan',
    'home.testimonials.card3.role': 'Game Director, Dream Games',
    'hero.stats.projects': 'Projects Delivered',
    'hero.stats.sounds': 'Sound Assets',
    'hero.tools': 'Tools we use',
    'hero.scroll': 'Scroll to explore',
    

    'services.hero.kicker': 'SERVICES',
    'services.hero.title': 'Audio Services',
    'services.hero.subtitle': 'From sound design to music composition and implementation, we offer comprehensive audio solutions for your game.',
    

    'portfolio.hero.kicker': 'PORTFOLIO',
    'portfolio.hero.title': 'Listen to some of our work.',
    'portfolio.hero.subtitle': 'Selected projects across different genres and platforms.',
    'portfolio.section.kicker': 'SELECTED WORK',
    'portfolio.section.title': 'A few of the projects we\'ve contributed to.',
    'portfolio.section.subtitle': 'Selected credits across games and platforms — from soundtrack to full audio production.',
    'portfolio.pill.credits': 'Credits',
    'portfolio.pill.videos': 'Videos',
    'portfolio.pill.music': 'Music',
    'portfolio.media.kicker': 'VIDEOS',
    'portfolio.media.title': 'Videos & music.',
    'portfolio.media.subtitle': 'Trailers and reels from our game audio work — sound design, music and in-game footage.',
    'portfolio.video.comingSoon': 'Coming Soon',
    'portfolio.music.comingSoon': 'Coming Soon',
    'portfolio.music.comingSoonText': 'New tracks are on the way!',
    

    'contact.hero.kicker': 'CONTACT',
    'contact.hero.title': 'Get in Touch',
    'contact.hero.subtitle': 'Ready to start your project? Send us a message and we\'ll get back to you shortly.',
    'contact.section.kicker': 'CONTACT',
    'contact.section.title': 'Let\'s start with a quick email.',
    'contact.section.subtitle': 'Sharing platforms, a rough schedule, and the type of game is usually enough for a first call.',
    'contact.form.name': 'Name',
    'contact.form.name.placeholder': 'Your name',
    'contact.form.email': 'Email',
    'contact.form.email.placeholder': 'you@studio.com',
    'contact.form.project': 'Project / Studio',
    'contact.form.project.placeholder': 'Project or studio name',
    'contact.form.details': 'Project details',
    'contact.form.details.placeholder': 'Genre, platforms, dates, links…',
    'contact.form.submit': 'Send message',
    'contact.aside.title': 'Direct contact',
    'contact.aside.email': 'Email: <a href="mailto:info@4gameaudio.com">info@4gameaudio.com</a>',
    'contact.aside.phone': 'Phone: <a href="tel:+905312898493">+90 531 289 84 93</a>',
    'contact.aside.location': 'Location: Istanbul, Turkey (remote-friendly)',
    'contact.aside.note': 'Most first calls happen online. Any builds, videos or documents you can share help us get specific very quickly.',
    

    'social.follow': 'Follow Us',
    'social.scrollTop': 'Scroll to top',
    

    'home.music.kicker': 'Featured',
    'home.music.title': 'Featured Music',
    'home.music.subtitle': 'A selection of themes and in-game tracks from our projects.',
    'home.contact.kicker': 'GET IN TOUCH',
    'home.contact.title': 'Ready to start your project?',
    'home.contact.subtitle': 'Let\'s discuss how we can bring your game\'s audio to life. Reach out and we\'ll get back to you soon.',
    'home.contact.button': 'Contact Us',
    'home.newsletter.email.placeholder': 'you@studio.com',
    

    'portfolio.item1.label': 'PC / Action RPG',
    'portfolio.item1.title': 'Awakening of the Titans',
    'portfolio.item1.meta': 'Epic orchestral score, massive creature sound design, environmental ambiences and Wwise implementation.',
    'portfolio.item2.label': 'PC / Adventure',
    'portfolio.item2.title': 'Frozen Giants',
    'portfolio.item2.meta': 'Ambient soundscapes, wind and snow foley, mythical creature audio and dynamic weather systems.',
    'portfolio.item3.label': 'Open World / Fantasy',
    'portfolio.item3.title': 'Skybound Voyage',
    'portfolio.item3.meta': 'Airship engine sounds, sailing ambiences, port city atmospheres and FMOD integration.',
    'portfolio.item4.label': 'Indie / Pixel RPG',
    'portfolio.item4.title': 'Bridge of Sorcery',
    'portfolio.item4.meta': 'Retro-style battle music, 8-bit spell effects, combat sound design and Unity audio implementation.',
    'portfolio.item5.label': 'Steam / Multiplayer Card Game',
    'portfolio.item5.title': 'Bogos Binted?',
    'portfolio.item5.meta': 'Full audio production for a quirky alien card game. Original soundtrack, character voices, UI sound design, and Steam integration. Published on Steam with Very Positive reviews (682+ reviews).',
    'portfolio.item5.steam': 'View on Steam',
    'portfolio.bundles.title': 'Available Steam bundles',
    'portfolio.bundles.item1.name': 'Bogos Binted? Dripped Out Edition',
    'portfolio.bundles.item1.note': 'Base game + Fashion Pack DLC',
    'portfolio.bundles.item2.name': 'Bogos Binted? & Hoop Fighters',
    'portfolio.bundles.item2.note': 'Party bundle with Hoop Fighters',
    'portfolio.bundles.item3.name': 'Bogos Binted? & Lost Lullabies',
    'portfolio.bundles.item3.note': 'Atmospheric horror + Bogos Binted?',
    'portfolio.item6.label': 'Steam / Indie Adventure',
    'portfolio.item6.title': 'enderman',
    'portfolio.item6.meta': 'Complete audio design for a sci-fi adventure game. Atmospheric soundscapes, alien character audio, environmental ambiences, and interactive music systems. Published on Steam.',
    'portfolio.item6.steam': 'View on Steam',
  },
  tr: {
    'badge.gameAudio': 'Oyun Ses Stüdyosu',
    'hero.title.prefix': 'Tasarlıyoruz',
    'hero.title.suffix': 'oyunlar ve interaktif deneyimler için.',
    'hero.lead':
      'Ses tasarımı, müzik ve teknik ses — hepsi tek bir odaklı ekipten.',
    'hero.meta.sound': 'Ses Tasarımı',
    'hero.meta.music': 'Müzik',
    'hero.meta.impl': 'Uygulama',
    'hero.cta.primary': 'Projeyi başlat',
    'hero.cta.secondary': 'Çalışmalarımız',
    'hero.play': 'Şimdi dinle',
    'hero.stats.projects': 'Tamamlanan Proje',
    'hero.stats.sounds': 'Ses Varlığı',
    'hero.tools': 'Kullandığımız araçlar',
    'hero.scroll': 'Keşfetmek için kaydır',
    'hero.visual.title': 'Üretim odaklı ses ekibi.',
    'hero.visual.text': 'Zaman çizelgenize, platformlarınıza ve araçlarınıza entegre oluyoruz; böylece ses kararları üretimi destekliyor, engellemiyor.',
    
    'nav.home': 'ANA SAYFA',
    'nav.about': 'HAKKIMIZDA',
    'nav.services': 'HİZMETLER',
    'nav.portfolio': 'PORTFÖY',
    'nav.contact': 'İLETİŞİM',
    
    'home.music.kicker': 'ÖNE ÇIKAN',
    'home.music.title': 'Öne Çıkan Müzikler',
    'home.music.subtitle': 'Projelerimizden temalar ve oyun içi parçalardan bir seçki.',
    'home.contact.kicker': 'İLETİŞİME GEÇİN',
    'home.contact.title': 'Projenize başlamaya hazır mısınız?',
    'home.contact.subtitle': 'Oyununuzun sesini hayata geçirmek için nasıl çalışabileceğimizi konuşalım. Bize ulaşın, en kısa sürede dönüş yapalım.',
    'home.contact.button': 'Bize Ulaşın',
    'music.player.default': 'Çalmak için bir parça seçin',
    'music.player.playing': 'Şu an çalıyor:',
    'music.player.paused': 'Duraklatıldı:',
    'music.player.error': 'Hata: Ses yüklenemedi. Lütfen başka bir parça deneyin.',
    
    'home.work.kicker': 'NASIL ÇALIŞIYORUZ',
    'home.work.title': 'Uzun vadeli ortaklıkları seviyoruz.',
    'home.work.subtitle': 'Sadece bir fragman veya bir kilometre taşı yerine, oyunları tam yaşam döngüleri boyunca desteklemeye alışkınız.',
    'home.work.card1.kicker': 'GÜVENİLİR',
    'home.work.card1.title': 'Planlı ve şeffaf',
    'home.work.card1.text': 'Net programlar, düzenli kontroller ve kimseyi şaşırtmayan revizyon turları. Herkes kimin neyi ne zaman yaptığını biliyor.',
    'home.work.card2.kicker': 'YARATICI',
    'home.work.card2.title': 'Oyununuzun dilinde',
    'home.work.card2.text': 'Her yere aynı "ses paketi"ni uygulamıyoruz. Ses dili, dünyanızın türüne, temposuna ve tonuna uyuyor.',
    'home.work.card3.kicker': 'TEKNİK',
    'home.work.card3.title': 'Teknik olarak sağlam',
    'home.work.card3.text': 'Üretimde hayatta kalan sistemler tasarlıyoruz: middleware, motor ve platform kısıtlamaları brief\'in bir parçası, sonradan düşünülmüş değil.',
    
    'home.testimonials.kicker': 'REFERANSLAR',
    'home.testimonials.title': '"Prototipten lansa kadar bizimle kaldılar."',
    'home.testimonials.subtitle': 'Ortaklar, yayıncılar ve ekipler bizimle çalışmayla ilgili neler söylüyor.',
    'home.testimonials.card1.text': '"Program sıkıştığında bile panik yapmadılar. Her iterasyon temiz teslimatlar ve net notlarla geldi, dahili ses ekibimizden baskıyı aldılar."',
    'home.testimonials.card1.name': 'Kaan Yılmaz',
    'home.testimonials.card1.role': 'Ses Yönetmeni, Peak Games',
    'home.testimonials.card2.text': '"Tüm ses tarafını onlara devretmek çok fazla zihinsel alan açtı. Ayrıca oyunun tonunu tanımlamaya yardımcı olan güçlü yaratıcı fikirler de katkıda bulundular."',
    'home.testimonials.card2.name': 'Elif Demir',
    'home.testimonials.card2.role': 'Yaratıcı Yönetmen, TaleWorlds',
    'home.testimonials.card3.text': '"Ses tasarımındaki detaylara gösterdikleri özen oyun dünyamızı hayata geçirdi. Ortam ses tasarımları ve karakter sesleri beklentilerimizi aştı."',
    'home.testimonials.card3.name': 'Burak Özkan',
    'home.testimonials.card3.role': 'Oyun Direktörü, Dream Games',
    
    'home.clients.kicker': 'MÜŞTERİLER',
    'home.clients.title': 'Yanında oturmak istediğimiz stüdyolar.',
    
    'home.newsletter.kicker': 'BÜLTEN',
    'home.newsletter.title': 'Sadece önemli şeyleri gönderiyoruz.',
    'home.newsletter.subtitle': 'Yeni yayınlar, sahne arkası notları ve ara sıra fırsatlar. Yılda birkaç e-posta, her hafta değil.',
    'home.newsletter.email': 'E-posta',
    'home.newsletter.email.placeholder': 'siz@studyo.com',
    'home.newsletter.button': 'Listeye katıl',
    
    'social.follow': 'BİZİ TAKİP EDİN',
    'social.scrollTop': 'YUKARI KAYDIR',
    
    'footer.text': '© 2025 4GAMEAUDIO. Tüm hakları saklıdır.',
    'footer.thanks': 'Özel teşekkürler:',
    'footer.credits': 'SUAY AKBUDAK',
    'footer.and': '❤️',
    'footer.credits2': 'SELİN DEMİR',
    'footer.role': '',

    'about.hero.kicker': 'HAKKIMIZDA',
    'about.hero.title': 'Hakkımızda',
    'about.hero.subtitle':
      'Tek çatı altında ses tasarımı, müzik prodüksiyonu ve teknik ses hizmeti sunan oyun odaklı bir ekibiz.',
    'about.section.kicker': 'STÜDYO HAKKINDA',
    'about.section.title': '4GameAudio - Oyun yapımcıları için kurulmuş bir ses stüdyosu.',
    'about.section.subtitle': 'İstanbul merkezli, ses tasarımcıları, besteciler ve teknik ses uzmanlarından oluşan tutkulu bir ekibiz. Oyunlar için profesyonel ses çözümleri sunuyoruz.',
    'about.stats.members': 'Ekip üyesi',
    'about.stats.projects': 'Tamamlanan proje',
    'about.stats.years': 'Yıllık deneyim',
    'about.card1.title': 'Biz Kimiz',
    'about.card1.text': 'İstanbul\'da kurulan 4GameAudio, canlı performans, stüdyo prodüksiyonu ve oyun sesi alanlarında onlarca yıllık deneyime sahip müzisyenler, besteciler ve ses mühendislerini bir araya getiriyor.',
    'about.card2.title': 'Hizmetlerimiz',
    'about.card2.text': 'Müzik prodüksiyonu ve beste, ses tasarımı ve SFX, sonic branding ve jingle, miks ve mastering, canlı ses mühendisliği ve oyunlar için Wwise/FMOD entegrasyonu.',
    'about.card3.title': 'Çalışma Şeklimiz',
    'about.card3.text': 'Proje sürecinize sorunsuz entegre oluyoruz. Wwise, FMOD, Unity, Unreal - kullandığınız araçlarla çalışır, düzenli iletişim ve şeffaf süreç yönetimi sağlarız.',
    'about.card4.title': 'Araçlarımız',
    'about.card4.text': 'Pro Tools, Ableton, Logic Pro, Wwise, FMOD, synthesizer\'lar, DAW\'lar ve profesyonel stüdyo ekipmanları. Ekibimiz özel kayıt ve miks stüdyoları işletmektedir.',
    'about.card5.title': 'Neden Biz',
    'about.card5.text': 'Sahne deneyimli müzisyenler, stüdyo eğitimli mühendisler ve oyun sesi uzmanları. Her projeye gerçek dünya performans deneyimi ve teknik uzmanlık getiriyoruz.',
    'about.card.hover': 'Keşfetmek için üzerine gel',
    'about.team.kicker': 'EKİP',
    'about.team.title': 'Ekiple Tanışın',
    'about.team.subtitle': 'Ses üretimimizin arkasındaki yetenekli bireyler.',
    'about.team.seeMore': 'Daha fazla',
    'about.team.strengths': 'Güçlü Yönler',
    'about.team.biography': 'Biyografi',
    'about.team.member1.strengths': 'Sahne performansları ve canlı müzik prodüksiyonlarıyla şekillenen 14 yıllık profesyonel gitar deneyimi. Müzik prodüksiyonu, ses tasarımı ve oyunlar için ses entegrasyonu konusunda uzman.',
    'about.team.member2.strengths': 'İstanbul Üniversitesi Devlet Konservatuvarı ve Yıldız Teknik Üniversitesi\'nde 6 yıllık klasik ve caz eğitimi. Kompozisyon, orkestrasyon ve adaptif müzik sistemleri konusunda uzman.',
    'about.team.member3.strengths': 'İstanbul Avni Akyol Güzel Sanatlar Lisesi\'nde kontrbas eğitimi, YTÜ Caz bölümünde devam etti. Bas gitar, synthesizer, DAW ve oyun sesi tasarımı konusunda uzman.',
    'about.team.member4.strengths': 'Albüm prodüksiyonu, TV/film ses tasarımı, miks ve mastering alanlarında yaklaşık 5 yıllık stüdyo deneyimi. FOH/monitör mühendisliği, Wwise entegrasyonu ve teknik ses tasarımı konusunda uzman.',
    'about.team.member1.description': 'Canlı performans, müzik prodüksiyonu ve ses tasarımında uzmanlaşmış müzisyen ve müzik prodüktörü. 14 yıllık profesyonel gitaristlik deneyimi.',
    'about.team.member2.description': 'Akademik müzik disiplinini sahne enerjisi ve modern prodüksiyonla birleştiren besteci ve ses tasarımcısı. 6 yıllık klasik ve caz eğitimi.',
    'about.team.member1.kicker': 'Ekip Üyesi',
    'about.team.member1.name': 'Emirhan Özer',
    'about.team.member1.role': 'Müzisyen & Müzik Prodüktörü',
    'about.team.member1.title': 'Hakkında',
    'about.team.member1.subtitle': 'Canlı performans, müzik prodüksiyonu ve ses tasarımında uzmanlaşmış müzisyen ve müzik prodüktörü. 14 yıllık profesyonel gitaristlik deneyimi.',
    'about.team.member1.bioTitle': 'Biyografi',
    'about.team.member1.bio': 'Canlı müzik performansı, müzik prodüksiyonu ve ses tasarımını bağımsız uzmanlık alanları olarak sürdüren bir müzisyen ve müzik prodüktörüdür. 14 yıllık profesyonel gitaristlik deneyimi; sahne performansları, konser projeleri ve canlı müzik üretimleriyle şekillenmiştir. Müzik prodüktörü olarak, farklı sanatçılarla gerçekleştirilen çok sayıda single ve albüm çalışmasında yer almış; kayıt, aranje ve prodüksiyon süreçlerinde aktif rol üstlenmiştir. Prodüksiyon pratiğini; ses tasarımı, commercial branding, jingle ve sonic branding alanlarına taşıyarak markalar için özgün ve akılda kalıcı işitsel kimlikler üretmektedir. Birikimini, 4GameAudio bünyesinde; oyunlar için ses tasarımı, müzik prodüksiyonu ve ses entegrasyon süreçlerini kapsayan bütüncül ses dünyaları oluşturmak amacıyla kullanmaktadır.',
    'about.team.member1.contactTitle': 'İletişim',
    'about.team.member1.email': 'E-posta: <a href="mailto:emirhanozer@4gameaudio.com">emirhanozer@4gameaudio.com</a>',
    'about.team.member1.workHistoryTitle': 'İş Geçmişi',
    'about.team.member1.work1.title': 'Baş Ses Tasarımcısı - Epic Games Studio',
    'about.team.member1.work1.period': '2020 - Günümüz',
    'about.team.member1.work1.description': 'Birden fazla AAA oyun için ses ekibine liderlik ettim, Wwise ve FMOD kullanarak interaktif ses sistemleri uyguladım. Oyuncu eylemlerine ve oyun durumuna yanıt veren adaptif sesler oluşturmak için oyun tasarımcılarıyla işbirliği yaptım.',
    'about.team.member1.work2.title': 'Kıdemli Ses Tasarımcısı - Indie Game Collective',
    'about.team.member1.work2.period': '2017 - 2020',
    'about.team.member1.work2.description': 'Bağımsız oyunlar için ses tasarımından uygulamaya kadar eksiksiz ses pipeline\'ları oluşturdum. Yenilikçi ses tasarımıyla tanınan ödüllü oyunlarda çalıştım.',
    'about.team.member1.work3.title': 'Ses Tasarımcısı - Mobile Game Studio',
    'about.team.member1.work3.period': '2014 - 2017',
    'about.team.member1.work3.description': 'Mobil oyunlar için performans ve dosya boyutu için optimize edilmiş sesler tasarladım ve uyguladım. Birden fazla projede kullanılan ses kütüphaneleri ve şablonlar oluşturdum.',
    'about.team.member1.projectsTitle': 'Önemli Projeler',
    'about.team.member1.project1': '"Epic Quest" - AAA Aksiyon RPG (2022)',
    'about.team.member1.project2': '"Neon City" - Cyberpunk Shooter (2021)',
    'about.team.member1.project3': '"Mystic Realms" - Fantastik Macera (2020)',
    'about.team.member1.project4': '"Indie Gem" - Ödüllü Bağımsız Oyun (2019)',
    'about.team.member1.project5': '"Mobile Legends" - Mobil Strateji Oyunu (2018)',
    'about.team.member1.concertsTitle': 'Canlı Performanslar & Konserler',
    'about.team.member1.concert1': 'İstanbul Caz Festivali 2023 - Öne Çıkan Gitarist',
    'about.team.member1.concert2': 'Akbank Caz Festivali 2022 - Canlı Performans',
    'about.team.member1.concert3': 'Babylon İstanbul 2021 - Solo Konser Serisi',
    'about.team.member1.concert4': 'Zorlu PSM 2020 - Açılış Sanatçısı',
    'about.team.member1.concert5': 'Salon IKSV 2019 - Akustik Oturum',
    'about.team.member2.kicker': 'Ekip Üyesi',
    'about.team.member2.name': 'Çınar Can İçli',
    'about.team.member2.role': 'Besteci & Ses Tasarımcısı',
    'about.team.member2.title': 'Hakkında',
    'about.team.member2.subtitle': 'Akademik müzik disiplinini sahne enerjisi ve modern prodüksiyonla birleştiren besteci ve ses tasarımcısı. 6 yıllık klasik ve caz eğitimi.',
    'about.team.member2.bioTitle': 'Biyografi',
    'about.team.member2.bio': 'Akademik müzik disiplinini sahne enerjisi ve modern prodüksiyonla birleştiren bir besteci ve ses tasarımcısıdır. İstanbul Üniversitesi Devlet Konservatuarı ve Yıldız Teknik Üniversitesi\'ndeki 6 yıllık klasik ve caz eğitimi, Türkiye genelinde yüzlerce konser performansı ve yayınladığı projeleriyle harmanlanmıştır. Aktif olarak commercial markalar için sonic branding ve jingle çalışmaları yapmaktadır. Bu çok yönlü tecrübesini 4GameAudio bünyesinde, oyunların atmosferini belirleyen detaylı SFX tasarımları, farklı türlerdeki besteleri ve markalara kimlik kazandıran sonic branding çalışmaları için kullanmaktadır.',
    'about.team.member2.contactTitle': 'İletişim',
    'about.team.member2.email': 'E-posta: <a href="mailto:cinarcanicli@4gameaudio.com">cinarcanicli@4gameaudio.com</a>',
    'about.team.member2.workHistoryTitle': 'İş Geçmişi',
    'about.team.member2.work1.title': 'Müzik Direktörü - Symphony Interactive',
    'about.team.member2.work1.period': '2019 - Günümüz',
    'about.team.member2.work1.description': 'Birden fazla AAA oyun için müzik besteledim ve yönettim, orkestralara liderlik ettim ve canlı müzisyenlerle çalıştım. Oynanış yoğunluğuna ve anlatı anlarına göre sorunsuz geçiş yapan adaptif müzik sistemleri geliştirdim.',
    'about.team.member2.work2.title': 'Besteci - Indie Sound Collective',
    'about.team.member2.work2.period': '2016 - 2019',
    'about.team.member2.work2.description': 'Bağımsız oyunlar için elektronik ve orkestral unsurları harmanlayan özgün müzikler yarattım. En iyi müzik ödülü alan ve eleştirel beğeni toplayan oyunlar için müzik besteledim.',
    'about.team.member2.work3.title': 'Serbest Besteci',
    'about.team.member2.work3.period': '2013 - 2016',
    'about.team.member2.work3.description': 'Çeşitli oyun projeleri, reklamlar ve kısa filmler için müzik besteledim. Birden fazla tür ve stili kapsayan çeşitli bir portföy oluşturdum.',
    'about.team.member2.concertsTitle': 'Canlı Performanslar & Konserler',
    'about.team.member2.concert1': 'Oyun Müziği Festivali 2023 - Orkestral Performans',
    'about.team.member2.concert2': 'Bağımsız Oyun Müziği Gösterisi 2022 - Canlı Konser',
    'about.team.member2.concert3': 'Video Oyunu Orkestrası Turu 2021 - Birden Fazla Şehir',
    'about.team.member2.concert4': 'Oyun Ses Ağı Loncası Ödülleri 2020 - Özel Performans',
    'about.team.member2.concert5': 'PAX East 2019 - Canlı Müzik Paneli',
    'about.team.member2.projectsTitle': 'Önemli Projeler',
    'about.team.member2.project1': '"Epic Quest" - Tam Orkestral Partisyon (2022)',
    'about.team.member2.project2': '"Neon City" - Elektronik Müzik (2021)',
    'about.team.member2.project3': '"Mystic Realms" - Fantastik Orkestral (2020)',
    'about.team.member2.project4': '"Indie Gem" - Ödüllü Partisyon (2019)',
    'about.team.member2.project5': '"Mobile Legends" - Adaptif Müzik Sistemi (2018)',
    

    'about.team.member3.name': 'Atakan Kotiloğlu',
    'about.team.member3.role': 'Bas Gitarist & Ses Tasarımcısı',
    'about.team.member3.description': 'Sahne ve stüdyo deneyimini oyun sesiyle birleştiren bas gitarist ve ses tasarımcısı. Gevende, Selin Geçit, Dilan Balkay ve Kristal Kit projelerinde aktif.',
    'about.team.member3.kicker': 'Ekip Üyesi',
    'about.team.member3.title': 'Hakkında',
    'about.team.member3.subtitle': 'Canlı müziği interaktif oyun sesiyle buluşturan bas gitarist ve ses tasarımcısı.',
    'about.team.member3.bioTitle': 'Biyografi',
    'about.team.member3.bio': 'Temelleri İstanbul Avni Akyol Güzel Sanatlar Lisesi\'nde kontrbas eğitimiyle atılan Atakan Kotiloğlu, akademik gelişimini Yıldız Teknik Üniversitesi Müzik ve Sahne Sanatları Bölümü (Caz) ile sürdürdü. Bas enstrümanlarının bir topluluk içindeki kritik rolünü hem ritmik hem de frekans odaklı olarak synthesizer ve DAW kullanımıyla zenginleştirdi. Şu anda Gevende, Selin Geçit, Dilan Balkay ve Kristal Kit projelerinde bas gitar, synth ve backing vokal görevlerini üstleniyor. Sahne ve stüdyo müzisyeni performanslarındaki geniş ses yelpazesini oyun dünyasının interaktif dinamikleriyle birleştiren Atakan, yeni projelerini ve ses tasarım süreçlerini 4 Game Audio çatısı altında yürütmektedir.',
    'about.team.member3.contactTitle': 'İletişim',
    'about.team.member3.email': 'E-posta: <a href="mailto:atakan@4gameaudio.com">atakan@4gameaudio.com</a>',
    'about.team.member3.workHistoryTitle': 'İş Geçmişi',
    'about.team.member3.work1.title': 'Bas Gitarist & Ses Tasarımcısı - 4 Game Audio',
    'about.team.member3.work1.period': '2024 - Günümüz',
    'about.team.member3.work1.description': 'Oyunlar için ses tasarımı ve müzik prodüksiyonu. Canlı müzik uzmanlığını interaktif sesle birleştiriyor.',
    'about.team.member3.work2.title': 'Seans Müzisyeni - Çeşitli Projeler',
    'about.team.member3.work2.period': '2018 - Günümüz',
    'about.team.member3.work2.description': 'Gevende, Selin Geçit, Dilan Balkay ve Kristal Kit için bas gitar, synth ve backing vokal.',
    'about.team.member3.projectsTitle': 'Önemli Projeler',
    'about.team.member3.project1': 'Gevende - Bas Gitar & Synth',
    'about.team.member3.project2': 'Selin Geçit - Seans Müzisyeni',
    'about.team.member3.project3': 'Kristal Kit - Bas Gitar & Backing Vokal',
    

    'about.team.member4.name': 'Mehmet Arif Cengiz',
    'about.team.member4.role': 'Ses Mühendisi & Teknik Ses Tasarımcısı',
    'about.team.member4.description': 'Albüm prodüksiyonu, TV/film ses tasarımı, miks ve mastering alanlarında yaklaşık 5 yıllık stüdyo deneyimine sahip ses mühendisi.',
    'about.team.member4.kicker': 'Ekip Üyesi',
    'about.team.member4.title': 'Hakkında',
    'about.team.member4.subtitle': 'FOH/monitör mühendisliği, Wwise entegrasyonu ve oyunlar için teknik ses tasarımı konusunda uzman ses mühendisi.',
    'about.team.member4.bioTitle': 'Biyografi',
    'about.team.member4.bio': '1990 doğumlu Mehmet Arif Cengiz, teknolojiyle 1995\'te bilgisayarlarla tanıştı; çocukluktan beri aktif bir oyuncu olarak dijital dünyayı erken yaşta benimsedi. Müzikal bir ailede büyüyerek enstrümanlar ve ses ekipmanlarıyla çevrili bir ortamda yetişti ve gitar ile davul çalarak genç yaşta profesyonel müziğe ilk adımlarını attı. Bir yıl stüdyo asistanlığının ardından 2012\'de İstanbul Teknik Üniversitesi Müzik Teknolojileri bölümünü birincilikle kazandı; ancak aynı dönemde sektöre girdiği için pratik deneyimi tercih ederek eğitimini ikinci yılında sonlandırdı. Yaklaşık beş yıllık stüdyo kariyerinde albüm prodüksiyonu, dizi ve film ses tasarımı, miks ve mastering çalışmalarında yer aldı. 2015\'ten bu yana canlı müzikte FOH ve monitör mühendisi olarak çalışan Cengiz, şu anda kendi stüdyosunu işletmekte; stüdyo ve sahne deneyimini Wwise entegrasyonu ve teknik ses tasarımıyla birleştirerek oyunlar için yaşayan ses dünyaları oluşturmaktadır.',
    'about.team.member4.contactTitle': 'İletişim',
    'about.team.member4.email': 'E-posta: <a href="mailto:mehmetarifcengiz@4gameaudio.com">mehmetarifcengiz@4gameaudio.com</a>',
    'about.team.member4.workHistoryTitle': 'İş Geçmişi',
    'about.team.member4.work1.title': 'FOH & Monitör Mühendisi',
    'about.team.member4.work1.period': '2015 - Günümüz',
    'about.team.member4.work1.description': 'Canlı müzik prodüksiyonlarında FOH ve monitör mühendisi olarak çalışıyor. Kayıt, miks ve mastering için kendi stüdyosunu işletiyor.',
    'about.team.member4.work2.title': 'Stüdyo Ses Mühendisi',
    'about.team.member4.work2.period': '2012 - 2015',
    'about.team.member4.work2.description': 'Albüm prodüksiyonu, dizi ve film ses tasarımı, miks ve mastering alanlarında yaklaşık 5 yıllık stüdyo deneyimi.',
    'about.team.member4.projectsTitle': 'Önemli Projeler',
    'about.team.member4.project1': 'Çeşitli Albüm Prodüksiyonları - Stüdyo Mühendisi',
    'about.team.member4.project2': 'TV Dizileri & Film Ses Tasarımı',
    'about.team.member4.project3': 'Canlı Konser FOH Mühendisliği',

    'services.hero.kicker': 'HİZMETLER',
    'services.hero.title': 'Ses Hizmetleri',
    'services.hero.subtitle':
      'Oyunlar, fragmanlar ve yeni medya için tasarlanmış uçtan uca ses hizmetleri.',
    'services.section.kicker': 'HİZMETLER',
    'services.section.title': 'Etkileşimli ekipler için UÇTAN UCA ses hizmetleri.',
    'services.section.subtitle':
      'İsterseniz tüm ses pipeline\'ını üstleniyor, isterseniz ekibinizi belirli alanlarda destekliyoruz.',
    'services.card1.title': 'Ses Tasarımı',
    'services.card1.text': 'Karakterler, UI, sistemler, atmosfer – oyunun yoluna çıkmadan etkiyi satan sesler.',
    'services.card2.title': 'Müzik & Partisyon',
    'services.card2.text': 'Menü temaları, savaş ipuçları, atmosferik katmanlar ve oyuncuyla savaşmak yerine onu takip eden interaktif müzik sistemleri.',
    'services.card4.title': 'Uygulama',
    'services.card4.text': 'Wwise, FMOD veya yerel motor sesi – olay tasarımı, RTPC, miksaj, profil oluşturma ve optimizasyonlar doğrudan motor içinde bağlanmış.',
    'services.card5.title': 'Teknik Ses',
    'services.card5.text': 'Ses pipeline\'ınızı kırılgan yerine sağlam yapan küçük araçlar, ses odaklı sistemler ve otomasyon.',
    'services.card6.title': 'Danışmanlık',
    'services.card6.text': 'Hala ses ekibinizi kuruyorsanız, rol tanımı, işe alma planları ve gerçekçi üretim yol haritaları konusunda yardımcı oluyoruz.',

    'portfolio.hero.kicker': 'PORTFÖY',
    'portfolio.hero.title': 'Çalışmalarımızdan bazılarını dinleyin.',
    'portfolio.hero.subtitle':
      'Farklı tür ve platformlardan seçilmiş projeler.',
    'portfolio.pill.credits': 'PROJELER',
    'portfolio.pill.videos': 'VİDEOLAR',
    'portfolio.pill.music': 'MÜZİK',
    'portfolio.section.kicker': 'SEÇİLİ İŞLER',
    'portfolio.section.title': 'Katkıda bulunduğumuz projelerden birkaçı.',
    'portfolio.section.subtitle':
      'Oyunlar ve platformlar arasında seçilmiş işler — soundtrack\'ten tam ses prodüksiyonuna.',
    'portfolio.media.kicker': 'VİDEOLAR',
    'portfolio.media.title': 'Videolar & müzik.',
    'portfolio.media.subtitle': 'Oyun sesi çalışmalarımızdan fragmanlar ve reel\'ler — ses tasarımı, müzik ve oyun içi görüntüler.',
    'portfolio.video.comingSoon': 'Yakında',
    'portfolio.music.comingSoon': 'Yakında',
    'portfolio.music.comingSoonText': 'Yeni parçalar yolda!',
    'portfolio.item1.label': 'PC / Aksiyon RPG',
    'portfolio.item1.title': 'Titanların Uyanışı',
    'portfolio.item1.meta': 'Epik orkestral müzik, devasa yaratık ses tasarımı, çevresel atmosferler ve Wwise entegrasyonu.',
    'portfolio.item2.label': 'PC / Macera',
    'portfolio.item2.title': 'Donmuş Devler',
    'portfolio.item2.meta': 'Atmosferik ses manzaraları, rüzgar ve kar efektleri, mitolojik yaratık sesleri ve dinamik hava sistemleri.',
    'portfolio.item3.label': 'Açık Dünya / Fantezi',
    'portfolio.item3.title': 'Gökyüzü Yolculuğu',
    'portfolio.item3.meta': 'Hava gemisi motor sesleri, yelken atmosferleri, liman şehri ortamları ve FMOD entegrasyonu.',
    'portfolio.item4.label': 'Bağımsız / Piksel RPG',
    'portfolio.item4.title': 'Büyücüler Köprüsü',
    'portfolio.item4.meta': 'Retro tarzı savaş müziği, 8-bit büyü efektleri, dövüş ses tasarımı ve Unity ses entegrasyonu.',
    'portfolio.item5.label': 'Steam / Çok Oyunculu Kart Oyunu',
    'portfolio.item5.title': 'Bogos Binted?',
    'portfolio.item5.meta': 'Tuhaf uzaylı kart oyunu için tam ses prodüksiyonu. Orijinal soundtrack, karakter sesleri, arayüz ses tasarımı ve Steam entegrasyonu. Steam\'de Çok Olumlu yorumlarla yayınlandı (682+ inceleme).',
    'portfolio.item5.steam': 'Steam\'de Görüntüle',
    'portfolio.bundles.title': 'Mevcut Steam paketleri',
    'portfolio.bundles.item1.name': 'Bogos Binted? Dripped Out Edition',
    'portfolio.bundles.item1.note': 'Ana oyun + Moda Paketi DLC',
    'portfolio.bundles.item2.name': 'Bogos Binted? & Hoop Fighters',
    'portfolio.bundles.item2.note': 'Hoop Fighters ile parti paketi',
    'portfolio.bundles.item3.name': 'Bogos Binted? & Lost Lullabies',
    'portfolio.bundles.item3.note': 'Atmosferik korku + Bogos Binted?',
    'portfolio.item6.label': 'Steam / Bağımsız Macera',
    'portfolio.item6.title': 'enderman',
    'portfolio.item6.meta': 'Bilim kurgu macera oyunu için eksiksiz ses tasarımı. Atmosferik ses manzaraları, uzaylı karakter sesleri, çevresel ambiyanslar ve interaktif müzik sistemleri. Steam\'de yayınlandı.',
    'portfolio.item6.steam': 'Steam\'de Görüntüle',

    'contact.hero.kicker': 'İLETİŞİM',
    'contact.hero.title': 'Bize Ulaşın',
    'contact.hero.subtitle':
      'Kısa bir mesaj, projeyi anlamamız ve ilk görüşmeyi planlamamız için yeterli.',
    'contact.section.kicker': 'İLETİŞİM',
    'contact.section.title': 'Kısa bir mail ile başlayalım.',
    'contact.section.subtitle':
      'Platform, kaba takvim ve oyunun türünü paylaşmanız, ilk görüşme için genelde yeterli oluyor.',
    'contact.form.name': 'Ad',
    'contact.form.name.placeholder': 'Adınız',
    'contact.form.email': 'E-posta',
    'contact.form.email.placeholder': 'siz@studyo.com',
    'contact.form.project': 'Proje / Stüdyo',
    'contact.form.project.placeholder': 'Proje veya stüdyo adı',
    'contact.form.details': 'Proje detayları',
    'contact.form.details.placeholder': 'Tür, platformlar, tarihler, linkler…',
    'contact.form.submit': 'Mesaj gönder',
    'contact.aside.title': 'Doğrudan iletişim',
    'contact.aside.email': 'E-posta: <a href="mailto:info@4gameaudio.com">info@4gameaudio.com</a>',
    'contact.aside.phone': 'Telefon: <a href="tel:+905312898493">+90 531 289 84 93</a>',
    'contact.aside.location': 'Konum: İstanbul, Türkiye (uzaktan çalışma dostu)',
    'contact.aside.note': 'Çoğu ilk görüşme online gerçekleşir. Paylaşabileceğiniz build\'ler, videolar veya belgeler bizi çok hızlı bir şekilde spesifik hale getirmemize yardımcı olur.'
  }
};

const defaultLang = 'en';
let currentLang = defaultLang;

const ROUTES = {
  en: {
    home: 'index.html',
    about: 'about',
    services: 'services',
    portfolio: 'portfolio',
    contact: 'contact'
  },
  tr: {
    home: 'index.html',
    about: 'hakkimizda',
    services: 'hizmetler',
    portfolio: 'portfolyo',
    contact: 'iletisim'
  }
};

const detectPageFromPath = (path) => {
  const p = (path || '').toLowerCase();
  if (p.includes('about.html') || p.includes('/about') || p.includes('/hakkimizda')) return 'about';
  if (p.includes('services.html') || p.includes('/services') || p.includes('/hizmetler')) return 'services';
  if (p.includes('portfolio.html') || p.includes('/portfolio') || p.includes('/portfolyo')) return 'portfolio';
  if (p.includes('contact.html') || p.includes('/contact') || p.includes('/iletisim')) return 'contact';
  return 'index';
};

const detectLangFromPath = (path) => {
  const p = (path || '').toLowerCase();
  if (p.includes('/hakkimizda') || p.includes('/hizmetler') || p.includes('/portfolyo') || p.includes('/iletisim')) {
    return 'tr';
  }
  return null;
};

const updateLocalizedLinks = (lang) => {
  const routes = ROUTES[lang] || ROUTES.en;
  document.querySelectorAll('a[data-route]').forEach(link => {
    const route = link.getAttribute('data-route');
    const href = routes[route] || (lang === 'tr' ? 'index.html' : 'index.html');
    link.setAttribute('href', href);
  });
};


const originalTexts = new Map();

const originalPlaceholders = new Map();

const storeOriginalTexts = () => {
  document.querySelectorAll('[data-i18n-key]').forEach(el => {
    const key = el.getAttribute('data-i18n-key');
    if (!originalTexts.has(key)) {

      if (el.classList.contains('magic')) {
        const magicText = el.querySelector('.magic-text');
        if (magicText) {
          originalTexts.set(key, magicText.textContent);
        }
      } else {
        originalTexts.set(key, el.innerHTML || el.textContent);
      }
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (!originalPlaceholders.has(key)) {
      originalPlaceholders.set(key, el.placeholder);
    }
  });
};

const restoreOriginalTexts = () => {
  document.querySelectorAll('[data-i18n-key]').forEach(el => {
    const key = el.getAttribute('data-i18n-key');
    const original = originalTexts.get(key);
    if (original) {

      if (el.classList.contains('magic')) {
        const magicText = el.querySelector('.magic-text');
        if (magicText) {
          magicText.textContent = original;
        }
      } else {
        el.innerHTML = original;
      }
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const original = originalPlaceholders.get(key);
    if (original) {
      el.placeholder = original;
    }
  });
};

const applyTranslations = lang => {
  const dict = translations[lang];
  

  const pageTitles = {
    en: {
      'index': '4GameAudio | Game Audio & Sound Design Studio',
      'about': '4GameAudio | About Us',
      'services': '4GameAudio | Our Services',
      'portfolio': '4GameAudio | Portfolio',
      'contact': '4GameAudio | Contact',
      'team-member-1': '4GameAudio | Emirhan Özer',
      'team-member-2': '4GameAudio | Çınar Can İçli'
    },
    tr: {
      'index': '4GameAudio | Oyun Ses ve Müzik Stüdyosu',
      'about': '4GameAudio | Hakkımızda',
      'services': '4GameAudio | Hizmetlerimiz',
      'portfolio': '4GameAudio | Portfolyo',
      'contact': '4GameAudio | İletişim',
      'team-member-1': '4GameAudio | Emirhan Özer',
      'team-member-2': '4GameAudio | Çınar Can İçli'
    }
  };
  

  const path = window.location.pathname;
  let currentPage = detectPageFromPath(path);
  if (path.includes('team-member-1.html')) currentPage = 'team-member-1';
  else if (path.includes('team-member-2.html')) currentPage = 'team-member-2';
  

  if (pageTitles[lang] && pageTitles[lang][currentPage]) {
    document.title = pageTitles[lang][currentPage];
  }
  
  if (lang === 'en') {

    restoreOriginalTexts();

    if (typingEl) {
      initTypingEffect('en');
    }

    if (musicNow && !currentTrack) {
      musicNow.textContent = getTranslation('music.player.default');
    } else if (musicNow && currentTrack) {
      updateTimestamp();
    }
    return;
  }
  

  if (!dict) return;

  document.querySelectorAll('[data-i18n-key]').forEach(el => {
    const key = el.getAttribute('data-i18n-key');
    const value = dict[key];

    if (value && value.trim() !== '') {

      if (el.classList.contains('magic')) {
        const magicText = el.querySelector('.magic-text');
        if (magicText) {
          magicText.textContent = value;
        }
      } else if (value.includes('<')) {

        el.innerHTML = value;
      } else {
        el.textContent = value;
      }
    }

  });
  

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const value = dict[key];
    if (value && value.trim() !== '') {
      el.placeholder = value;
    }
  });
  

  if (lang === 'tr' || lang === 'en') {
    initTypingEffect(lang);
  }
  

  if (musicNow && !currentTrack) {
    musicNow.textContent = getTranslation('music.player.default');
  } else if (musicNow && currentTrack) {
    updateTimestamp();
  }
};


const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    const emoji = theme === 'dark' ? '🌙' : '☀️';

    if (!themeToggle.querySelector('.theme-emoji')) {
      themeToggle.innerHTML = `<span class="theme-emoji">${emoji}</span>`;
    } else {
      themeToggle.querySelector('.theme-emoji').textContent = emoji;
    }
  }
};


const initializeTheme = () => {
  let currentTheme = localStorage.getItem('theme') || 'dark';

applyTheme(currentTheme);

  const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(currentTheme);
  });
}
};


initializeTheme();
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeTheme);
} else {

  initializeTheme();
}


const initializeLanguage = () => {
  storeOriginalTexts();
  

  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang');
  const pathLang = detectLangFromPath(window.location.pathname);
  const savedLang = localStorage.getItem('language');
  if (urlLang === 'tr' || urlLang === 'en') {
    currentLang = urlLang;
  } else if (pathLang === 'tr') {
    currentLang = 'tr';
  } else if (savedLang === 'tr' || savedLang === 'en') {
    currentLang = savedLang;
  } else {
    currentLang = defaultLang;
  }
  localStorage.setItem('language', currentLang);

  const applyTranslationsNow = () => {
    applyTranslations(currentLang);
    updateLocalizedLinks(currentLang);
  };
  

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyTranslationsNow);
  } else {

    applyTranslationsNow();
  }
  

const langToggle = document.getElementById('langToggle');
if (langToggle) {

    langToggle.classList.add('init-loading');
    

    if (currentLang === 'tr') {
      langToggle.classList.add('active');
    } else {
      langToggle.classList.remove('active');
    }
    

    const slider = langToggle.querySelector('.lang-toggle-slider');
    if (slider) {
      slider.offsetHeight;
    }
    

    setTimeout(() => {
      langToggle.classList.remove('init-loading');
    }, 150);
  
  let isToggling = false;
  
  const handleLangToggle = () => {
    if (isToggling) return;
    isToggling = true;
    
    if (currentLang === 'en') {
      currentLang = 'tr';
      langToggle.classList.add('active');
      localStorage.setItem('language', 'tr');
      applyTranslations('tr');
      updateLocalizedLinks('tr');
    } else {
      currentLang = 'en';
      langToggle.classList.remove('active');
      localStorage.setItem('language', 'en');
      applyTranslations('en');
      updateLocalizedLinks('en');
    }
    
    setTimeout(() => {
      isToggling = false;
    }, 300);
  };
  
  langToggle.addEventListener('click', handleLangToggle);
  langToggle.addEventListener('touchend', (e) => {
    e.preventDefault();
    handleLangToggle();
  });
}
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeLanguage);
} else {
  initializeLanguage();
}


let musicAudio = null;
let musicNow = null;
let musicTracks = null;
let musicProgressBar = null;
let musicProgressFill = null;
let musicProgressHandle = null;
let musicCurrentTime = null;
let musicTotalTime = null;
let currentTrack = null;
let timestampInterval = null;
let isDragging = false;


const initMusicPlayer = () => {
  musicAudio = document.getElementById('musicAudio');
  musicNow = document.getElementById('musicNow');
  musicTracks = document.querySelectorAll('.music-track');
  musicProgressBar = document.getElementById('musicProgressBar');
  musicProgressFill = document.getElementById('musicProgressFill');
  musicProgressHandle = document.getElementById('musicProgressHandle');
  musicCurrentTime = document.getElementById('musicCurrentTime');
  musicTotalTime = document.getElementById('musicTotalTime');
  

  if (musicTracks && musicTracks.length > 0) {
    musicTracks.forEach(track => {

      if (track.dataset.initialized) return;
      track.dataset.initialized = 'true';
      
      track.addEventListener('click', () => {
        playTrack(track);
      });
      

      track.style.cursor = 'pointer';
    

      track.addEventListener('dblclick', (e) => {
        e.preventDefault();
        stopTrack();
      });
    });
  }
  

  if (musicAudio && !musicAudio.dataset.initialized) {
    musicAudio.dataset.initialized = 'true';
    
    musicAudio.addEventListener('loadedmetadata', () => {
      updateTimestamp();
      updateProgressBar();
      if (musicTotalTime && musicAudio.duration) {
        musicTotalTime.textContent = formatTime(musicAudio.duration);
      }
    });
    
    musicAudio.addEventListener('ended', () => {
      stopTrack();
    });
    
    musicAudio.addEventListener('timeupdate', () => {
      updateTimestamp();
    });
    
    musicAudio.addEventListener('error', () => {
      if (musicNow) {
        musicNow.textContent = getTranslation('music.player.error') || 'Error: Could not load audio. Please try another track.';
      }
      stopTimestampUpdates();
      if (currentTrack) {
        currentTrack.classList.remove('is-playing', 'is-paused');
        updatePlayIcon(currentTrack, false);
      }
    });
  }
  

  if (musicProgressBar && !musicProgressBar.dataset.initialized) {
    musicProgressBar.dataset.initialized = 'true';
    
    musicProgressBar.addEventListener('click', (e) => {
      seekToPosition(e);
    });
    

    let isDraggingProgress = false;
    
    const handleMouseMove = (e) => {
      if (isDraggingProgress) {
        seekToPosition(e);
      }
    };
    
    const handleMouseUp = () => {
      isDraggingProgress = false;
      isDragging = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    musicProgressBar.addEventListener('mousedown', (e) => {
      isDraggingProgress = true;
      isDragging = true;
      seekToPosition(e);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    });
    

    musicProgressBar.addEventListener('touchstart', (e) => {
      isDraggingProgress = true;
      isDragging = true;
      const touch = e.touches[0];
      const fakeEvent = { clientX: touch.clientX };
      seekToPosition(fakeEvent);
    });
    
    musicProgressBar.addEventListener('touchmove', (e) => {
      if (isDraggingProgress) {
        e.preventDefault();
        const touch = e.touches[0];
        const fakeEvent = { clientX: touch.clientX };
        seekToPosition(fakeEvent);
      }
    });
    
    musicProgressBar.addEventListener('touchend', () => {
      isDraggingProgress = false;
      isDragging = false;
    });
  }
};


const formatTime = (seconds) => {
  if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};


const updateProgressBar = () => {
  if (!musicAudio || !musicProgressFill || !musicProgressHandle) return;
  const current = musicAudio.currentTime || 0;
  const duration = musicAudio.duration || 0;
  
  if (duration > 0 && !isDragging) {
    const percentage = (current / duration) * 100;
    musicProgressFill.style.width = percentage + '%';
    musicProgressHandle.style.left = percentage + '%';
  }
};


const getTranslation = (key) => {
  const dict = translations[currentLang];
  if (dict && dict[key]) {
    return dict[key];
  }

  const enDict = translations['en'];
  return (enDict && enDict[key]) ? enDict[key] : key;
};


const updateTimestamp = () => {
  if (!musicAudio || !musicNow) return;
  const current = musicAudio.currentTime || 0;
  const duration = musicAudio.duration || 0;
  const trackName = currentTrack ? currentTrack.getAttribute('data-track-name') : '';
  

  if (musicCurrentTime) {
    musicCurrentTime.textContent = formatTime(current);
  }
  if (musicTotalTime && duration > 0) {
    musicTotalTime.textContent = formatTime(duration);
  }
  
  if (trackName && duration > 0) {
    const playingText = getTranslation('music.player.playing');
    musicNow.textContent = `${playingText} ${trackName}`;
  } else if (trackName) {
    const playingText = getTranslation('music.player.playing');
    musicNow.textContent = `${playingText} ${trackName}`;
  } else {
    musicNow.textContent = getTranslation('music.player.default');
  }
  

  updateProgressBar();
};


const stopTimestampUpdates = () => {
  if (timestampInterval) {
    clearInterval(timestampInterval);
    timestampInterval = null;
  }
};


const startTimestampUpdates = () => {
  stopTimestampUpdates();
  updateTimestamp();
  timestampInterval = setInterval(() => {
    updateTimestamp();
    updateProgressBar();
  }, 100);
};


const seekToPosition = (e) => {
  if (!musicAudio || !musicProgressBar) return;
  const rect = musicProgressBar.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
  
  if (musicAudio.duration) {
    musicAudio.currentTime = (percentage / 100) * musicAudio.duration;
    updateProgressBar();
    updateTimestamp();
  }
};


const updatePlayIcon = (trackElement, isPlaying) => {
  const icon = trackElement.querySelector('.music-track-play-icon');
  if (icon) {
    icon.textContent = isPlaying ? '⏸' : '▶';
  }
};


const playTrack = (trackElement) => {
  if (!musicAudio) return;
  
  const audioUrl = trackElement.getAttribute('data-audio-url');
  if (!audioUrl) return;
  

  if (currentTrack === trackElement && !musicAudio.paused) {
    musicAudio.pause();
    stopTimestampUpdates();
    trackElement.classList.remove('is-playing');
    trackElement.classList.add('is-paused');
    updatePlayIcon(trackElement, false);
    const pausedText = getTranslation('music.player.paused');
    musicNow.textContent = `${pausedText} ${trackElement.getAttribute('data-track-name')}`;
    return;
  }
  

  if (currentTrack === trackElement && musicAudio.paused) {
    musicAudio.play();
    trackElement.classList.remove('is-paused');
    trackElement.classList.add('is-playing');
    updatePlayIcon(trackElement, true);
    startTimestampUpdates();
    return;
  }
  

  if (currentTrack && currentTrack !== trackElement) {
    currentTrack.classList.remove('is-playing', 'is-paused');
    updatePlayIcon(currentTrack, false);
  }
  

  currentTrack = trackElement;
  musicAudio.src = audioUrl;
  

  musicAudio.play().then(() => {
    trackElement.classList.add('is-playing');
    trackElement.classList.remove('is-paused');
    updatePlayIcon(trackElement, true);
    startTimestampUpdates();
  }).catch((error) => {
    console.error('Error playing audio:', error);
    musicNow.textContent = getTranslation('music.player.error') || 'Error: Could not play audio. Please try another track.';
  });
};


const stopTrack = () => {
  if (!musicAudio) return;
  musicAudio.pause();
  musicAudio.currentTime = 0;
  stopTimestampUpdates();
  if (currentTrack) {
    currentTrack.classList.remove('is-playing', 'is-paused');
    updatePlayIcon(currentTrack, false);
  }
  currentTrack = null;
  musicNow.textContent = getTranslation('music.player.default');
  

  if (musicProgressFill) musicProgressFill.style.width = '0%';
  if (musicProgressHandle) musicProgressHandle.style.left = '0%';
  if (musicCurrentTime) musicCurrentTime.textContent = '0:00';
  if (musicTotalTime) musicTotalTime.textContent = '0:00';
};


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMusicPlayer);
} else {
  initMusicPlayer();
}


const updateActiveNavLink = () => {
  const navLinks = document.querySelectorAll('nav a');
  const currentPath = window.location.pathname;
  const currentPage = currentPath.split('/').pop() || 'index.html';
  
  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    const linkPage = linkHref.split('/').pop() || 'index.html';
    

    link.classList.remove('active');
    

    if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
      link.classList.add('active');
    }
  });
};


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateActiveNavLink);
} else {
  updateActiveNavLink();
}


const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {

    navLinks.forEach(l => l.classList.remove('active'));

    link.classList.add('active');
  });
});


const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const mobileMenuClose = document.getElementById('mobileMenuClose');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');

const closeMobileMenu = () => {
  if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
  if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('active');
  document.body.style.overflow = '';
};

if (mobileMenuToggle && mobileMenuOverlay) {

  mobileMenuToggle.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('active');
    mobileMenuOverlay.classList.toggle('active');
    document.body.style.overflow = mobileMenuOverlay.classList.contains('active') ? 'hidden' : '';
  });


  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMobileMenu);
  }


  mobileMenuOverlay.addEventListener('click', (e) => {
    if (e.target === mobileMenuOverlay) {
      closeMobileMenu();
    }
  });


  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
      

      mobileMenuLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });


  const updateMobileMenuActiveLink = () => {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    mobileMenuLinks.forEach(link => {
      const linkHref = link.getAttribute('href');
      const linkPage = linkHref.split('/').pop() || 'index.html';
      
      link.classList.remove('active');
      if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
        link.classList.add('active');
      }
    });
  };


  updateMobileMenuActiveLink();
}


const initCustomCursor = () => {
  const cursor = document.getElementById('customCursor');
  if (!cursor) return;

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;


  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouchDevice) {
    cursor.style.display = 'none';
    document.body.style.cursor = 'auto';
    return;
  }


  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });


  const animateCursor = () => {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;
    
    cursorX += dx * 0.4;
    cursorY += dy * 0.4;
    
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    
    requestAnimationFrame(animateCursor);
  };
  animateCursor();


  const interactiveElements = document.querySelectorAll(
    'a, .music-track, .theme-toggle, .lang-toggle, .video-thumbnail, .portfolio-item, .social-bar a, .card, .about-card, .team-card, .pill, .video-card, .video-overlay, .play-circle, .music-player, .music-coming-soon'
  );
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
    });
    
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
    });
  });


  const buttonElements = document.querySelectorAll('button, .btn-primary, .btn-outline, .hero-play');
  
  buttonElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('button-hover');
    });
    
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('button-hover');
    });
  });

  document.addEventListener('pointerover', (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (
      target.closest(
        'a, button, .btn-primary, .btn-outline, .hero-play, .theme-toggle, .lang-toggle, .mobile-menu-toggle, .scroll-top-btn, .pill, .music-track, .video-card, .video-overlay, .play-circle, .music-player, .music-coming-soon, .portfolio-item, .card, .about-card, .team-card'
      )
    ) {
      cursor.classList.add('hover');
    }
  });

  document.addEventListener('pointerout', (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (
      target.closest(
        'a, button, .btn-primary, .btn-outline, .hero-play, .theme-toggle, .lang-toggle, .mobile-menu-toggle, .scroll-top-btn, .pill, .music-track, .video-card, .video-overlay, .play-circle, .music-player, .music-coming-soon, .portfolio-item, .card, .about-card, .team-card'
      )
    ) {
      cursor.classList.remove('hover');
    }
  });


  document.addEventListener('mousedown', () => {
    cursor.classList.add('click');
  });

  document.addEventListener('mouseup', () => {
    cursor.classList.remove('click');
  });


  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
  });
};


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCustomCursor);
} else {
  initCustomCursor();
}




const initTeamCardToggle = () => {
  const toggleButtons = document.querySelectorAll('.team-card-toggle');
  
  toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.team-card');
      const isExpanded = card.classList.toggle('is-expanded');
      const currentLang = localStorage.getItem('language') || 'en';
      
      button.textContent = isExpanded 
        ? (currentLang === 'tr' ? 'Daha az göster' : 'Show less')
        : (currentLang === 'tr' ? 'Daha fazla göster' : 'Show more');
    });
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTeamCardToggle);
} else {
  initTeamCardToggle();
}










const EMAILJS_CONFIG = {
  publicKey: 'YOUR_PUBLIC_KEY', // Replace with your EmailJS public key
  serviceId: 'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
  contactTemplateId: 'YOUR_CONTACT_TEMPLATE_ID', // Template for contact form
  newsletterTemplateId: 'YOUR_NEWSLETTER_TEMPLATE_ID', // Template for newsletter
  targetEmail: 'sosohelmet@gmail.com' // Email address to receive messages
};


const spamProtection = {

  submissions: JSON.parse(sessionStorage.getItem('form_submissions') || '{}'),
  

  checkHoneypot: (form) => {
    const honeypot = form.querySelector('input[name="_honeypot"]');
    return honeypot && honeypot.checked === true;
  },
  
 
  checkSubmitSpeed: (form, minSeconds = 3) => {
    const loadTime = form.querySelector('#formLoadTime');
    if (!loadTime || !loadTime.value) return false;
    const elapsed = (Date.now() - parseInt(loadTime.value)) / 1000;
    return elapsed < minSeconds;
  },
  

  checkRateLimit: (formType, maxPerHour = 5) => {
    const now = Date.now();
    const hourAgo = now - (60 * 60 * 1000);
    

    if (spamProtection.submissions[formType]) {
      spamProtection.submissions[formType] = spamProtection.submissions[formType].filter(t => t > hourAgo);
    } else {
      spamProtection.submissions[formType] = [];
    }
    

    if (spamProtection.submissions[formType].length >= maxPerHour) {
      return true; // Rate limited
    }
    

    spamProtection.submissions[formType].push(now);
    sessionStorage.setItem('form_submissions', JSON.stringify(spamProtection.submissions));
    return false;
  },
  

  checkSuspiciousContent: (text) => {
    const suspiciousPatterns = [
      /\[url=/i,
      /\[link=/i,
      /<a\s+href/i,
      /viagra|cialis|casino|lottery|bitcoin.*free/i,
      /click here.*http/i
    ];
    return suspiciousPatterns.some(pattern => pattern.test(text));
  }
};

const initEmailJS = () => {
  const contactForm = document.getElementById('contactForm');
  const contactStatus = document.getElementById('contactFormStatus');
  const redirectInput = document.getElementById('formRedirect');
  
  if (contactForm) {
    const currentLang = localStorage.getItem('language') || 'en';
    
    if (redirectInput) {
      const currentUrl = window.location.origin + window.location.pathname;
      redirectInput.value = currentUrl + '?submitted=success';
    }
    
    contactForm.addEventListener('submit', (e) => {
      if (typeof spamProtection !== 'undefined') {
        if (spamProtection.checkHoneypot(contactForm)) {
          e.preventDefault();
          console.log('Spam detected: honeypot filled');
          contactStatus.style.display = 'block';
          contactStatus.style.color = '#10b981';
          contactStatus.textContent = currentLang === 'tr' 
            ? 'Mesajınız gönderildi!'
            : 'Message sent!';
          return;
        }

        const details = contactForm.querySelector('#details');
        if (details && spamProtection.checkSuspiciousContent(details.value)) {
          e.preventDefault();
          contactStatus.style.display = 'block';
          contactStatus.style.color = '#ef4444';
          contactStatus.textContent = currentLang === 'tr'
            ? 'Mesajınız şüpheli içerik içeriyor.'
            : 'Your message contains suspicious content.';
          return;
        }
      }
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = currentLang === 'tr' ? 'Gönderiliyor...' : 'Sending...';
      
      console.log('=== Formspark Submission ===');
      console.log('Form ID: Oasy45CXs');
      console.log('Endpoint: https://submit-form.com/Oasy45CXs');
      console.log('Form will submit normally (no AJAX)');
    });
    
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('submitted') === 'success') {
      contactStatus.style.display = 'block';
      contactStatus.style.color = '#10b981';
      contactStatus.textContent = currentLang === 'tr' 
        ? 'Mesajınız gönderildi! En kısa sürede size dönüş yapacağız.'
        : 'Message sent! We\'ll get back to you soon.';
      
      window.history.replaceState({}, '', window.location.pathname);
      
      setTimeout(() => {
        if (contactForm) contactForm.reset();
      }, 100);
    }
  }
  

  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterStatus = document.getElementById('newsletterFormStatus');
  
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const currentLang = localStorage.getItem('language') || 'en';
      const submitBtn = newsletterForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      const emailInput = newsletterForm.querySelector('#newsletter-email');
      

      if (spamProtection.checkRateLimit('newsletter', 2)) {
        newsletterStatus.style.display = 'block';
        newsletterStatus.style.color = '#ef4444';
        newsletterStatus.textContent = currentLang === 'tr'
          ? 'Çok fazla kayıt denemesi. Lütfen daha sonra tekrar deneyin.'
          : 'Too many subscription attempts. Please try again later.';
        return;
      }
      

      submitBtn.disabled = true;
      submitBtn.textContent = currentLang === 'tr' ? 'Kaydediliyor...' : 'Subscribing...';
      

      if (EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY') {

        const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
        const email = emailInput.value;
        
        if (!subscribers.includes(email)) {
          subscribers.push({ email, date: new Date().toISOString() });
          localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
        }
        
        newsletterStatus.style.display = 'block';
        newsletterStatus.style.color = '#f59e0b';
        newsletterStatus.textContent = currentLang === 'tr'
          ? 'Demo modu: Email kaydedildi (localStorage). EmailJS yapılandırması için main.js dosyasını güncelleyin.'
          : 'Demo mode: Email saved (localStorage). Update main.js to configure EmailJS.';
        newsletterForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        return;
      }
      
      const formData = {
        subscriber_email: emailInput.value,
        subscription_date: new Date().toLocaleDateString('tr-TR'),
        to_email: EMAILJS_CONFIG.targetEmail
      };
      
      try {
        await emailjs.send(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.newsletterTemplateId,
          formData
        );
        
        newsletterStatus.style.display = 'block';
        newsletterStatus.style.color = '#10b981';
        newsletterStatus.textContent = currentLang === 'tr'
          ? 'Bültene kaydoldunuz! Yılda birkaç önemli güncelleme göndereceğiz.'
          : 'You\'re subscribed! We\'ll send you important updates a few times a year.';
        newsletterForm.reset();
        
      } catch (error) {
        console.error('EmailJS error:', error);
        newsletterStatus.style.display = 'block';
        newsletterStatus.style.color = '#ef4444';
        newsletterStatus.textContent = currentLang === 'tr'
          ? 'Bir hata oluştu. Lütfen tekrar deneyin.'
          : 'An error occurred. Please try again.';
      }
      
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    });
  }
};


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initEmailJS);
} else {
  initEmailJS();
}


const initMagicStars = () => {
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  
  const animateStar = (star) => {
    star.style.setProperty("--star-left", `${rand(-10, 100)}%`);
    star.style.setProperty("--star-top", `${rand(-40, 80)}%`);
    star.style.animation = "none";
    star.offsetHeight; // Trigger reflow
    star.style.animation = "";
  };
  
  const stars = document.querySelectorAll(".magic-star");
  let index = 0;
  
  stars.forEach((star) => {
    setTimeout(() => {
      animateStar(star);
      setInterval(() => animateStar(star), 1000);
    }, index++ * 333);
  });
};


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMagicStars);
} else {
  initMagicStars();
}

