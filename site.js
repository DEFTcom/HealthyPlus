(() => {
  const interactionStyles = document.createElement('style');
  interactionStyles.textContent = `
    .product-pagination{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:55px 7vw 75px;border-top:1px solid rgba(8,44,72,.16);gap:30px}
    .product-pagination>a:first-child{text-align:left}.product-pagination>a:last-child{text-align:right}
    .product-pagination span,.all-products{font-size:8px;letter-spacing:.16em}
    .product-pagination strong{font-family:Georgia,serif;font-size:24px;font-weight:400;display:block;margin-top:12px}
    .all-products{border:1px solid rgba(8,44,72,.16);border-radius:30px;padding:13px 18px}
    @media(max-width:600px){.product-pagination{grid-template-columns:1fr 1fr;padding:40px 22px 60px}.product-pagination .all-products{display:none}.product-pagination strong{font-size:17px}}
  `;
  document.head.appendChild(interactionStyles);

  const header = document.querySelector('header');
  const menuButton = document.querySelector('.menu');
  const desktopNav = header?.querySelector('nav');

  if (header && menuButton && desktopNav) {
    const mobileNav = document.createElement('div');
    mobileNav.className = 'mobile-nav';
    mobileNav.setAttribute('aria-hidden', 'true');
    mobileNav.innerHTML = `
      <button class="mobile-close" aria-label="Close navigation">Close</button>
      <nav>${desktopNav.innerHTML}</nav>
      <a class="mobile-enquire" href="contact.html">Business enquiries <span>↗</span></a>
    `;
    document.body.appendChild(mobileNav);

    const toggleMenu = (open) => {
      mobileNav.classList.toggle('open', open);
      mobileNav.setAttribute('aria-hidden', String(!open));
      document.body.classList.toggle('menu-open', open);
      menuButton.setAttribute('aria-expanded', String(open));
    };

    menuButton.addEventListener('click', () => toggleMenu(true));
    mobileNav.querySelector('.mobile-close').addEventListener('click', () => toggleMenu(false));
    mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => toggleMenu(false)));
    addEventListener('keydown', (event) => {
      if (event.key === 'Escape') toggleMenu(false);
    });
  }

  const topButton = document.createElement('button');
  topButton.className = 'back-to-top';
  topButton.type = 'button';
  topButton.setAttribute('aria-label', 'Back to top');
  topButton.innerHTML = '<span>↑</span><small>TOP</small>';
  document.body.appendChild(topButton);
  addEventListener('scroll', () => topButton.classList.toggle('visible', scrollY > 520), { passive: true });
  topButton.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  document.querySelectorAll('img:not([loading])').forEach((image, index) => {
    if (index > 3) image.loading = 'lazy';
    image.decoding = 'async';
  });

  const storyTrack = document.querySelector('#storyTrack');
  if (storyTrack) {
    const storyCount = 16;
    storyTrack.innerHTML = Array.from({ length: storyCount }, (_, index) => {
      const number = String(index + 1).padStart(2, '0');
      return `
        <article class="story-card">
          <div class="story-media">
            <img class="story-poster" src="customer-stories/story-${number}.jpg" alt="Preview of HealthyPlus community story ${number}" loading="${index < 3 ? 'eager' : 'lazy'}">
            <video preload="none" playsinline poster="customer-stories/story-${number}.jpg" aria-label="HealthyPlus community story ${number}"></video>
            <button class="story-play" type="button" data-video="customer-stories/story-${number}.mp4" aria-label="Play HealthyPlus community story ${number}"><span>▶</span></button>
            <i class="story-number">${number} / ${storyCount}</i>
          </div>
          <div class="story-meta"><p>COMMUNITY STORY</p><span>In their own words</span></div>
        </article>`;
    }).join('');

    const storiesSection = storyTrack.closest('.stories');
    const formulaSection = document.querySelector('.formula-lab');
    if (formulaSection && storiesSection.nextElementSibling !== formulaSection) {
      formulaSection.parentNode.insertBefore(storiesSection, formulaSection);
    }
    const prevButton = storiesSection.querySelector('.story-prev');
    const nextButton = storiesSection.querySelector('.story-next');
    const step = () => {
      const card = storyTrack.querySelector('.story-card');
      return card ? card.getBoundingClientRect().width + 22 : 340;
    };
    const move = (direction) => storyTrack.scrollBy({ left: direction * step(), behavior: 'smooth' });
    prevButton.addEventListener('click', () => move(-1));
    nextButton.addEventListener('click', () => move(1));

    let carouselPaused = false;
    let carouselTimer;
    const stopAutoMove = () => {
      carouselPaused = true;
      storiesSection.classList.add('is-paused');
      clearInterval(carouselTimer);
    };
    const startAutoMove = () => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      carouselPaused = false;
      storiesSection.classList.remove('is-paused');
      clearInterval(carouselTimer);
      carouselTimer = setInterval(() => {
        const atEnd = storyTrack.scrollLeft + storyTrack.clientWidth >= storyTrack.scrollWidth - 12;
        storyTrack.scrollTo({ left: atEnd ? 0 : storyTrack.scrollLeft + step(), behavior: 'smooth' });
      }, 4800);
    };

    storiesSection.addEventListener('mouseenter', stopAutoMove);
    storiesSection.addEventListener('mouseleave', () => {
      const anyVideoPlaying = Array.from(storyTrack.querySelectorAll('video')).some((video) => !video.paused);
      if (!anyVideoPlaying) startAutoMove();
    });
    storyTrack.addEventListener('pointerdown', stopAutoMove, { passive: true });
    storyTrack.addEventListener('focusin', stopAutoMove);

    storyTrack.querySelectorAll('.story-play').forEach((button) => {
      button.addEventListener('click', async () => {
        const video = button.previousElementSibling;
        storyTrack.querySelectorAll('video').forEach((other) => {
          if (other !== video) other.pause();
        });
        storyTrack.querySelectorAll('.story-play').forEach((other) => other.classList.remove('is-hidden'));
        stopAutoMove();
        if (!video.src) {
          video.src = button.dataset.video;
          video.controls = true;
          video.load();
        }
        try {
          await video.play();
          button.closest('.story-media').classList.add('is-playing');
          button.classList.add('is-hidden');
        } catch {
          button.closest('.story-media').classList.remove('is-playing');
          button.classList.remove('is-hidden');
        }
      });
    });
    storyTrack.querySelectorAll('video').forEach((video) => {
      video.addEventListener('ended', () => {
        video.closest('.story-media').classList.remove('is-playing');
        video.nextElementSibling.classList.remove('is-hidden');
        startAutoMove();
      });
      video.addEventListener('pause', () => {
        if (!video.ended) video.nextElementSibling.classList.remove('is-hidden');
      });
    });
    startAutoMove();
  }
})();
