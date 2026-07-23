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
})();
