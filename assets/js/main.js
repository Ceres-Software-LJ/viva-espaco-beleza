/* ============================================================
   VIVA ESPAÇO DE BELEZA — interações da landing page
   JavaScript puro, sem dependências.
   Módulos: navbar, menu mobile, fade-in, FAQ, depoimentos, rodapé.
   ============================================================ */
(function () {
  'use strict';

  var REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Navbar: estado ao rolar ---------- */
  function initHeader() {
    var header = document.getElementById('site-header');
    if (!header) return;

    var ticking = false;

    function update() {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });

    update();
  }

  /* ---------- 2. Menu mobile ---------- */
  function initMobileMenu() {
    var btn = document.getElementById('menu-btn');
    var menu = document.getElementById('menu-mobile');
    var icon = document.getElementById('menu-icon');
    if (!btn || !menu || !icon) return;

    function setOpen(isOpen) {
      menu.classList.toggle('hidden', !isOpen);
      btn.setAttribute('aria-expanded', String(isOpen));
      btn.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
      icon.querySelector('use').setAttribute('href', isOpen ? '#i-close' : '#i-menu');
    }

    btn.addEventListener('click', function () {
      setOpen(menu.classList.contains('hidden'));
    });

    // Fecha ao escolher uma seção
    menu.addEventListener('click', function (event) {
      if (event.target.closest('a')) setOpen(false);
    });

    // Fecha com a tecla Esc
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !menu.classList.contains('hidden')) {
        setOpen(false);
        btn.focus();
      }
    });

    // Fecha ao voltar para o layout desktop
    var desktop = window.matchMedia('(min-width: 1024px)');
    if (typeof desktop.addEventListener === 'function') {
      desktop.addEventListener('change', function (event) {
        if (event.matches) setOpen(false);
      });
    }
  }

  /* ---------- 3. Fade-in ao rolar ---------- */
  var STAGGER_MS = 90;   // atraso entre itens vizinhos
  var STAGGER_MAX = 3;   // máximo de itens escalonados por grupo

  function initReveal() {
    var items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;

    // Sem suporte a IntersectionObserver ou com movimento reduzido: mostra tudo
    if (!('IntersectionObserver' in window) || REDUCED_MOTION) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.style.transitionDelay = revealDelay(el) + 'ms';
        el.classList.add('is-visible');
        observer.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    items.forEach(function (el) { observer.observe(el); });
  }

  // Escalona a entrada de itens irmãos (grids de cards, por exemplo)
  function revealDelay(el) {
    var siblings = Array.prototype.slice.call(
      el.parentElement.querySelectorAll(':scope > [data-reveal]')
    );
    var index = siblings.indexOf(el);
    return Math.min(index < 0 ? 0 : index, STAGGER_MAX) * STAGGER_MS;
  }

  /* ---------- 4. FAQ (acordeão acessível) ---------- */
  function initFaq() {
    var triggers = document.querySelectorAll('.faq-trigger');

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var item = trigger.closest('.faq-item');
        var willOpen = item.getAttribute('data-open') !== 'true';
        item.setAttribute('data-open', String(willOpen));
        trigger.setAttribute('aria-expanded', String(willOpen));
      });
    });
  }

  /* ---------- 5. Depoimentos: esteira contínua ----------
     Duplica os cards para o loop fechar sem emenda e calcula a
     duração pela largura de uma volta, para a velocidade ficar
     constante independente de quantos depoimentos existirem.
     -------------------------------------------------------- */
  var MARQUEE_VELOCIDADE = 45;  // pixels por segundo

  function initMarquee() {
    var track = document.getElementById('depo-track');
    if (!track) return;

    var cards = Array.prototype.slice.call(track.children);
    if (!cards.length) return;

    // Movimento reduzido: deixa como lista rolável, sem animar
    if (REDUCED_MOTION) return;

    // Largura de uma volta = soma dos cards já com a margem
    var volta = cards.reduce(function (total, card) {
      var estilo = window.getComputedStyle(card);
      return total + card.offsetWidth + parseFloat(estilo.marginRight || 0);
    }, 0);

    if (!volta) return;

    // A cópia é decorativa: o leitor de tela já leu a primeira
    cards.forEach(function (card) {
      var clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });

    track.style.setProperty('--marquee-duration', (volta / MARQUEE_VELOCIDADE).toFixed(1) + 's');
  }

  /* ---------- 5b. Vídeo de fundo do hero ----------
     O vídeo só é baixado quando vale a pena: tela grande, conexão
     boa e sem preferência por movimento reduzido. Fora disso, fica
     o poster (já definido no HTML) e nenhum byte é gasto.
     ------------------------------------------------- */
  var VIDEO_MIN_WIDTH = 768;

  function initHeroVideo() {
    var video = document.getElementById('hero-video');
    if (!video) return;

    if (REDUCED_MOTION) return;
    if (window.innerWidth < VIDEO_MIN_WIDTH) return;

    // Respeita economia de dados e conexões lentas
    var conexao = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conexao) {
      if (conexao.saveData) return;
      if (/(^|-)(2g|slow-2g)$/.test(conexao.effectiveType || '')) return;
    }

    adicionarFonte(video, video.dataset.webm, 'video/webm');
    adicionarFonte(video, video.dataset.mp4, 'video/mp4');
    video.load();

    // Alguns navegadores recusam autoplay; o poster segue no lugar
    var promessa = video.play();
    if (promessa && promessa.catch) promessa.catch(function () {});

    pausarForaDaTela(video);
  }

  function adicionarFonte(video, url, tipo) {
    if (!url) return;
    var fonte = document.createElement('source');
    fonte.src = url;
    fonte.type = tipo;
    video.appendChild(fonte);
  }

  // Economiza bateria quando o hero sai da tela
  function pausarForaDaTela(video) {
    if (!('IntersectionObserver' in window)) return;

    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var p = video.play();
          if (p && p.catch) p.catch(function () {});
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.01 }).observe(video);
  }

  /* ---------- 6. Esmaltação progressiva ----------
     A foto das unhas é pintada conforme o scroll: a camada de cima
     (unhas esmaltadas) é revelada de baixo para cima.

     Em telas grandes a seção fica presa por ~2 telas e o progresso vem
     de quanto já se rolou dentro dela. Em telas menores o progresso vem
     da posição da foto na viewport, sem prender nada.
     ------------------------------------------------------------------ */
  var PIN_MIN_WIDTH = 1024;   // largura mínima para fixar a seção
  var PIN_MIN_HEIGHT = 700;   // altura mínima (evita cortar o conteúdo)
  var PINTURA_FIM = 0.62;     // fração do scroll em que a pintura termina

  function initEsmalte() {
    var secao = document.getElementById('experiencia');
    var figura = document.getElementById('esmalte');
    if (!secao || !figura) return;

    var pintada = figura.querySelector('.esmalte-pintada');
    var brilho = figura.querySelector('.esmalte-brilho');
    var destaques = Array.prototype.slice.call(secao.querySelectorAll('.exp-item'));

    // Movimento reduzido: entrega o resultado final, sem animar
    if (REDUCED_MOTION) {
      pintada.style.clipPath = 'none';
      return;
    }

    var preso = false;
    var ticking = false;

    function configurar() {
      preso = window.innerWidth >= PIN_MIN_WIDTH && window.innerHeight >= PIN_MIN_HEIGHT;
      secao.classList.toggle('is-pinned', preso);
      secao.classList.toggle('exp-pinned', preso);
      atualizar();
    }

    // 0 = nenhuma unha pintada · 1 = fim da seção
    function progresso() {
      var r = secao.getBoundingClientRect();

      if (preso) {
        var curso = secao.offsetHeight - window.innerHeight;
        return curso > 0 ? limitar(-r.top / curso) : 1;
      }

      // Sem fixação: usa a posição da própria foto na tela
      var f = figura.getBoundingClientRect();
      var inicio = window.innerHeight * 0.92;
      var fim = window.innerHeight * 0.30;
      return limitar((inicio - f.top) / (inicio - fim));
    }

    function atualizar() {
      var p = progresso();
      var pintura = limitar(p / PINTURA_FIM);

      pintada.style.clipPath = 'inset(' + (100 - pintura * 100).toFixed(2) + '% 0 0 0)';

      // O brilho acompanha a linha do esmalte e some no fim
      if (brilho) {
        var subida = -(figura.offsetHeight * pintura) + 'px';
        brilho.style.transform = 'translateY(' + subida + ')';
        brilho.style.opacity = pintura > 0.02 && pintura < 0.98 ? '1' : '0';
      }

      // Destaques entram em sequência enquanto a seção está presa
      if (preso) {
        destaques.forEach(function (item, i) {
          var gatilho = 0.20 + i * 0.13;
          item.classList.toggle('is-in', p >= gatilho);
        });
      }

      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(atualizar);
    }, { passive: true });

    window.addEventListener('resize', configurar, { passive: true });
    configurar();
  }

  function limitar(v) {
    return v < 0 ? 0 : v > 1 ? 1 : v;
  }

  /* ---------- 7. Ano do rodapé ---------- */
  function initYear() {
    var slot = document.getElementById('ano');
    if (slot) slot.textContent = String(new Date().getFullYear());
  }

  /* ---------- Inicialização ---------- */
  function init() {
    initHeader();
    initMobileMenu();
    initReveal();
    initFaq();
    initMarquee();
    initHeroVideo();
    initEsmalte();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
