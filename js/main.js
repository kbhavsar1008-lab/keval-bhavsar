/* ==========================================================================
   Keval Satish Bhavsar — Portfolio interactions (jQuery 3.7.1)
   ========================================================================== */
$(function () {
  'use strict';

  var $html = $('html');
  var $window = $(window);
  var $header = $('#header');
  var $navLinks = $('#nav-links');
  var $menuToggle = $('#menu-toggle');
  var $toTop = $('#to-top');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var animate = $html.hasClass('anim');
  var finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $progress = $('#progress-bar');

  /* ---------- Page-load choreography ---------- */
  window.requestAnimationFrame(function () { $html.addClass('is-loaded'); });

  /* ---------- Footer year ---------- */
  $('#year').text(new Date().getFullYear());

  /* ---------- Theme toggle (saved per visitor) ---------- */
  var $themeBtn = $('#theme-toggle');

  function setThemeLabel() {
    var dark = $html.attr('data-theme') === 'dark';
    $themeBtn.attr('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  }
  setThemeLabel();

  $themeBtn.on('click', function () {
    var dark = $html.attr('data-theme') === 'dark';
    if (dark) { $html.removeAttr('data-theme'); } else { $html.attr('data-theme', 'dark'); }
    try { localStorage.setItem('theme', dark ? 'light' : 'dark'); } catch (e) { /* storage blocked */ }
    setThemeLabel();
  });

  /* ---------- Mobile menu ---------- */
  function closeMenu() {
    $navLinks.removeClass('is-open');
    $menuToggle.attr({ 'aria-expanded': 'false', 'aria-label': 'Open menu' });
  }

  $menuToggle.on('click', function () {
    var open = !$navLinks.hasClass('is-open');
    $navLinks.toggleClass('is-open', open);
    $menuToggle.attr({ 'aria-expanded': String(open), 'aria-label': open ? 'Close menu' : 'Open menu' });
  });

  $(document).on('keydown', function (e) {
    if (e.key === 'Escape' && $navLinks.hasClass('is-open')) { closeMenu(); $menuToggle.trigger('focus'); }
  });

  $(document).on('click', function (e) {
    if ($navLinks.hasClass('is-open') && !$(e.target).closest('#nav-links, #menu-toggle').length) closeMenu();
  });

  /* ---------- Smooth scroll with sticky-header offset ---------- */
  $('a[href^="#"]').on('click', function (e) {
    var id = $(this).attr('href');
    if (id.length < 2) return;
    var $target = $(id);
    if (!$target.length) return;

    e.preventDefault();
    closeMenu();
    var top = id === '#top' ? 0 : $target.offset().top - $header.outerHeight() - 8;

    $('html, body').stop().animate({ scrollTop: top }, reduceMotion ? 0 : 600, 'swing', function () {
      // Move keyboard focus to the section for accessibility
      if (!$target.is('[tabindex]')) $target.attr('tabindex', '-1');
      $target[0].focus({ preventScroll: true });
      if (history.replaceState) history.replaceState(null, '', id);
    });
  });

  $toTop.on('click', function () {
    $('html, body').stop().animate({ scrollTop: 0 }, reduceMotion ? 0 : 600);
  });

  /* ---------- Scroll: header shadow, back-to-top, active nav ---------- */
  var $sections = $('main section[id]');
  var ticking = false;

  function onScroll() {
    var y = $window.scrollTop();
    $header.toggleClass('is-scrolled', y > 8);

    var max = $(document).height() - $window.height();
    $progress.css('transform', 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')');
    $toTop.toggleClass('is-visible', y > 600);

    var pos = y + $header.outerHeight() + 120;
    var current = '';
    $sections.each(function () {
      if ($(this).offset().top <= pos) current = this.id;
    });
    // At the very bottom, highlight the last section
    if (y + $window.height() >= $(document).height() - 4) current = $sections.last().attr('id');

    $navLinks.find('.nav__link').each(function () {
      var match = $(this).attr('href') === '#' + current;
      $(this).toggleClass('is-active', match);
      if (match) { $(this).attr('aria-current', 'true'); } else { $(this).removeAttr('aria-current'); }
    });
    ticking = false;
  }

  $window.on('scroll resize', function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  });
  onScroll();

  /* ---------- Scroll reveals (staggered) ---------- */
  // Stagger cards that share a grid, and cascade the tags inside skill cards
  $('.grid').each(function () {
    $(this).children('.reveal').each(function (i) { this.style.setProperty('--d', (i * 110) + 'ms'); });
  });
  $('.skill-card').each(function () {
    $(this).find('.tag').each(function (i) { this.style.setProperty('--t', i); });
  });

  var $reveals = $('.reveal');
  if (!animate || !('IntersectionObserver' in window)) {
    $reveals.addClass('is-visible');
  } else {
    var io = new IntersectionObserver(function (entries) {
      $.each(entries, function (_, entry) {
        if (entry.isIntersecting) {
          $(entry.target).addClass('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    $reveals.each(function () { io.observe(this); });
  }

  /* ---------- Count-up stats (after the hero lands) ---------- */
  if (animate) {
    $('.count').each(function () {
      var $el = $(this);
      var end = parseInt($el.data('count'), 10) || 0;
      $el.text('0');
      $({ n: 0 }).delay(1100).animate({ n: end }, {
        duration: 1500,
        easing: 'swing',
        step: function (now) { $el.text(Math.round(now)); },
        complete: function () { $el.text(end); }
      });
    });
  }

  /* ---------- Portrait parallax (desktop mouse only) ---------- */
  if (animate && finePointer) {
    var $portrait = $('.portrait');
    $('.hero').on('mousemove', function (e) {
      var r = this.getBoundingClientRect();
      var mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      var my = ((e.clientY - r.top) / r.height - 0.5) * 2;
      $portrait[0].style.setProperty('--mx', mx.toFixed(3));
      $portrait[0].style.setProperty('--my', my.toFixed(3));
    }).on('mouseleave', function () {
      $portrait[0].style.setProperty('--mx', 0);
      $portrait[0].style.setProperty('--my', 0);
    });
  }

  /* ---------- Card spotlight follows the cursor ---------- */
  if (finePointer) {
    $(document).on('mousemove', '.card', function (e) {
      var r = this.getBoundingClientRect();
      this.style.setProperty('--sx', (e.clientX - r.left) + 'px');
      this.style.setProperty('--sy', (e.clientY - r.top) + 'px');
    });
  }
});
