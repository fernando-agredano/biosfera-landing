gsap.registerPlugin(ScrollTrigger);


    /* ══════════════════════════════════════
       VINYL 3D — CSS 3D tilt reveal on scroll
    ══════════════════════════════════════ */
    gsap.fromTo('#vinylTilt',
      { rotateX: -76, scale: 0.82 },
      {
        rotateX: 0, scale: 1, ease: 'none',
        scrollTrigger: {
          trigger: '.vinyl-section',
          start:   'top 80%',
          end:     'center 40%',
          scrub:   1.8
        }
      }
    );
    gsap.from('.vinyl-text > *', {
      y: 30, opacity: 0, duration: 1.1, ease: 'power4.out', stagger: .18,
      scrollTrigger: {
        trigger: '.vinyl-text', start: 'top 84%',
        toggleActions: 'play none none none'
      }
    });
    gsap.from('.vinyl-fact', {
      x: -24, opacity: 0, duration: .7, ease: 'power3.out', stagger: .1,
      scrollTrigger: { trigger: '.vinyl-facts', start: 'top 85%' }
    });

    /* ══════════════════════════════════════
       3D CARD TILT — Magnetic hover
    ══════════════════════════════════════ */
    document.querySelectorAll('[data-tilt]').forEach(card => {
      const gloss = card.querySelector('.s-gloss');

      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x  = e.clientX - rect.left;
        const y  = e.clientY - rect.top;
        const w  = rect.width;
        const h  = rect.height;
        const nx = (x / w - 0.5) * 2; // -1 to 1
        const ny = (y / h - 0.5) * 2;

        gsap.to(card, {
          rotateY: nx * 13,
          rotateX: -ny * 9,
          transformPerspective: 900,
          duration: .35,
          ease: 'power2.out'
        });

        if (gloss) {
          gsap.to(gloss, {
            opacity: 1,
            x: x - w / 2,
            y: y - h / 2,
            duration: .25
          });
        }
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateX: 0, rotateY: 0,
          duration: .7, ease: 'elastic.out(1, 0.5)'
        });
        if (gloss) gsap.to(gloss, { opacity: 0, duration: .3 });
      });
    });

    /* ══════════════════════════════════════
       HERO ENTRANCE
    ══════════════════════════════════════ */
    gsap.set(['#h-eyebrow', '#h-scroll'], { opacity: 0 });

    const heroTl = gsap.timeline({ delay: .3 });
    heroTl
      .from('.hero-dj-wrap', { '--dj-x': '46%', opacity: 0, duration: 1.45, ease: 'expo.out' })
      .to('#h-eyebrow', { opacity: 1, duration: .8, ease: 'power3.out' }, '-=.7')
      .to('#h-scroll',  { opacity: 1, duration: .5 }, '-=.3');

    // Hero glow parallax
    gsap.to('.hero-glow', {
      y: '35%', ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
    });

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const heroEl = document.querySelector('.hero');
    const heroDj = document.querySelector('.hero-dj-wrap');

    if (!reduceMotion && heroDj) {
      gsap.to(heroDj, {
        '--dj-scroll-y': '72px',
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 }
      });
    }

    if (!reduceMotion && heroEl && heroDj) {
      heroEl.addEventListener('mousemove', e => {
        const rect = heroEl.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(heroDj, {
          '--dj-cursor-x': `${nx * 20}px`,
          '--dj-cursor-y': `${ny * 12}px`,
          '--dj-rotate': `${-1 + nx * 3}deg`,
          duration: .45,
          ease: 'power3.out'
        });
      }, { passive: true });

      heroEl.addEventListener('mouseleave', () => {
        gsap.to(heroDj, {
          '--dj-cursor-x': '0px',
          '--dj-cursor-y': '0px',
          '--dj-rotate': '-1deg',
          duration: .55,
          ease: 'power3.out'
        });
      });
    }

    const heroThreeWrap = document.getElementById('heroThreeWrap');
    const heroThreeCanvas = document.getElementById('heroThreeCanvas');

    if (heroThreeWrap && heroThreeCanvas && window.THREE) {
      const T = window.THREE;
      const scene = new T.Scene();
      const camera = new T.PerspectiveCamera(36, 1, 0.1, 100);
      camera.position.set(0, 0, 8.2);

      const renderer = new T.WebGLRenderer({
        canvas: heroThreeCanvas,
        alpha: true,
        antialias: true
      });
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));

      const cyan = 0x2aa7c8;

      const stage = new T.Group();
      const coreGroup = new T.Group();

      scene.add(stage);
      stage.add(coreGroup);

      const edgeMaterial = new T.MeshBasicMaterial({
        color: cyan,
        transparent: true,
        opacity: .92,
        blending: T.NormalBlending,
        depthWrite: false
      });
      const glowEdgeMaterial = new T.MeshBasicMaterial({
        color: cyan,
        transparent: true,
        opacity: .08,
        blending: T.NormalBlending,
        depthWrite: false
      });
      const edgeUnitGeometry = new T.CylinderGeometry(1, 1, 1, 7, 1);
      const edgeUp = new T.Vector3(0, 1, 0);

      const createSolidEdges = (geometry, radius, material) => {
        const group = new T.Group();
        const edges = new T.EdgesGeometry(geometry, 1);
        const positions = edges.attributes.position;

        for (let i = 0; i < positions.count; i += 2) {
          const start = new T.Vector3().fromBufferAttribute(positions, i);
          const end = new T.Vector3().fromBufferAttribute(positions, i + 1);
          const direction = end.clone().sub(start);
          const length = direction.length();

          if (length <= 0) continue;

          const edge = new T.Mesh(edgeUnitGeometry, material);
          edge.position.copy(start).add(end).multiplyScalar(.5);
          edge.quaternion.setFromUnitVectors(edgeUp, direction.normalize());
          edge.scale.set(radius, length, radius);
          group.add(edge);
        }

        return group;
      };

      const coreGeometry = new T.IcosahedronGeometry(2.3, 1);
      const core = createSolidEdges(coreGeometry, .018, edgeMaterial);
      const coreGlow = createSolidEdges(coreGeometry, .034, glowEdgeMaterial);
      coreGroup.add(coreGlow, core);

      const resizeHeroThree = () => {
        const rect = heroThreeWrap.getBoundingClientRect();
        const width = Math.max(1, rect.width);
        const height = Math.max(1, rect.height);
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };

      const updateHeroCrystals = elapsed => {
        core.rotation.x = elapsed * .16;
        core.rotation.y = elapsed * .22;
        coreGlow.rotation.copy(core.rotation);

        stage.rotation.y = Math.sin(elapsed * .18) * .08;
        stage.rotation.x = Math.cos(elapsed * .16) * .035;
      };

      if (window.ResizeObserver) {
        const observer = new ResizeObserver(resizeHeroThree);
        observer.observe(heroThreeWrap);
      } else {
        window.addEventListener('resize', resizeHeroThree, { passive: true });
      }

      requestAnimationFrame(() => {
        resizeHeroThree();

        if (reduceMotion) {
          updateHeroCrystals(0);
          renderer.render(scene, camera);
        } else {
          const clock = new T.Clock();
          const renderHeroThree = () => {
            const elapsed = clock.getElapsedTime();
            updateHeroCrystals(elapsed);
            renderer.render(scene, camera);
            requestAnimationFrame(renderHeroThree);
          };
          requestAnimationFrame(renderHeroThree);
        }
      });
    }

    /* ══════════════════════════════════════
       ABOUT
    ══════════════════════════════════════ */
    gsap.from('#about-frame', {
      clipPath: 'inset(100% 0% 0% 0%)', duration: 1.5, ease: 'expo.out',
      scrollTrigger: { trigger: '#about-frame', start: 'top 82%' }
    });
    gsap.fromTo('#about-img',
      { scale: 1.28, yPercent: -8 },
      { scale: 1, yPercent: 5, ease: 'none',
        scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: 1.2 } }
    );
    gsap.from('.about-text > *', {
      y: 32, opacity: 0, duration: 1.1, ease: 'power4.out', stagger: .18,
      scrollTrigger: {
        trigger: '.about-text', start: 'top 82%',
        toggleActions: 'play none none none'
      }
    });

    /* ══════════════════════════════════════
       SERVICES
    ══════════════════════════════════════ */
    gsap.from('.s-card', {
      y: 70, opacity: 0, duration: .85, ease: 'power3.out', stagger: .14,
      scrollTrigger: { trigger: '.services-grid', start: 'top 78%' }
    });

    /* ══════════════════════════════════════
       GALLERY — clip reveal + scale parallax
    ══════════════════════════════════════ */
    document.querySelectorAll('.g-item').forEach(item => {
      const img = item.querySelector('img');

      gsap.from(item, {
        clipPath: 'inset(100% 0% 0% 0%)', duration: 1.15, ease: 'expo.out',
        scrollTrigger: { trigger: item, start: 'top 92%', toggleActions: 'play none none none' }
      });

      gsap.fromTo(img,
        { scale: 1.28 },
        { scale: 1, ease: 'none',
          scrollTrigger: { trigger: item, start: 'top bottom', end: 'bottom top', scrub: 1 } }
      );
    });

    gsap.from('.gallery-head > *', {
      y: 35, opacity: 0, duration: .8, ease: 'power3.out', stagger: .12,
      scrollTrigger: { trigger: '.gallery-head', start: 'top 85%' }
    });

    /* ══════════════════════════════════════
       STATS COUNTERS
    ══════════════════════════════════════ */
    document.querySelectorAll('.stat-num').forEach(el => {
      const target = +el.dataset.target;
      const suffix = el.dataset.suffix;
      ScrollTrigger.create({
        trigger: el, start: 'top 82%', once: true,
        onEnter() {
          gsap.to({ v: 0 }, {
            v: target, duration: 2.2, ease: 'power2.out',
            onUpdate() { el.textContent = Math.round(this.targets()[0].v) + suffix; }
          });
        }
      });
    });

    /* ══════════════════════════════════════
       EQUIPMENT — stacked card reveal on scroll
       Each card slides in from the right on top of the previous
       Images are grayscale; hover restores color (CSS)
    ══════════════════════════════════════ */
    const hTrack = document.getElementById('hTrack');
    if (hTrack) {
      const cards = Array.from(hTrack.querySelectorAll('.eq-card'));
      const n = cards.length;

      // Assign z-index so each card layers on top of the previous
      cards.forEach((card, i) => gsap.set(card, { zIndex: i + 1 }));
      // All subsequent cards start off-screen to the right (viewport edge)
      if (n > 1) gsap.set(cards.slice(1), { x: window.innerWidth });

      // Timeline: each card slides in from viewport right edge to center
      const tl = gsap.timeline();
      cards.slice(1).forEach(card => {
        tl.to(card, { x: 0, ease: 'none', duration: 1 });
      });

      const mm = gsap.matchMedia();

      mm.add('(max-width: 1024px)', () => {
        ScrollTrigger.create({
          animation: tl,
          trigger: '.equipment',
          start: 'top 15%',
          end: () => `+=${(n - 1) * window.innerHeight}`,
          pin: true, scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true
        });
      });

      mm.add('(min-width: 1025px)', () => {
        ScrollTrigger.create({
          animation: tl,
          trigger: '.equipment',
          start: 'top top',
          end: () => `+=${(n - 1) * window.innerHeight}`,
          pin: true, scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true
        });
      });
    }

    /* ══════════════════════════════════════
       CTA
    ══════════════════════════════════════ */
    const ctaTl = gsap.timeline({
      scrollTrigger: { trigger: '.cta-section', start: 'top 72%' }
    });
    ctaTl
      .from('.cta-title', { y: 90, opacity: 0, duration: 1.2, ease: 'expo.out' })
      .from('.cta-text',  { y: 30, opacity: 0, duration: .8,  ease: 'power3.out' }, '-=.65')
      .from('.cta-btn',   { y: 20, opacity: 0, duration: .6,  ease: 'power3.out' }, '-=.45')
      .from('.cta-mail',  { opacity: 0, duration: .45 }, '-=.2');

    /* ══════════════════════════════════════
       UNIVERSAL — section titles & labels
       Se excluyen los que ya tienen animación
       propia para evitar conflictos.
    ══════════════════════════════════════ */
    gsap.utils.toArray('.section-title').forEach(el => {
      // Skip titles inside sections that animate their own children
      if (el.closest('.about') || el.closest('.vinyl-section')) return;
      gsap.from(el, {
        y: 40, opacity: 0, duration: 1.1, ease: 'power4.out',
        scrollTrigger: {
          trigger: el, start: 'top 88%',
          toggleActions: 'play none none none'
        }
      });
    });
    gsap.utils.toArray('.label').forEach(el => {
      if (el.closest('.about') || el.closest('.vinyl-section')) return;
      gsap.from(el, {
        x: -14, opacity: 0, duration: .7, ease: 'power3.out',
        scrollTrigger: {
          trigger: el, start: 'top 92%',
          toggleActions: 'play none none none'
        }
      });
    });

    /* ── Navbar: fondo al hacer scroll ── */
    const navEl = document.querySelector('#mainNav');
    if (navEl) {
      window.addEventListener('scroll', () => {
        navEl.classList.toggle('nav-scrolled', window.scrollY > 60);
      }, { passive: true });
    }

    gsap.from('footer > *', {
      y: 18, opacity: 0, duration: .65, stagger: .1, ease: 'power3.out',
      scrollTrigger: { trigger: 'footer', start: 'top 92%' }
    });

    window.addEventListener('load', () => ScrollTrigger.refresh());
