/**
 * Shared page components — nav and footer.
 *
 * Edit the HTML strings below to update the nav or footer across every page.
 * This script must be loaded before menu.js so that the injected elements
 * are in the DOM when menu.js initialises.
 */

(function () {
  // -------------------------------------------------------------------------
  // Navigation
  // Uses index.html#... hrefs everywhere — page-transition.js skips the
  // transition for same-page hash links, so this works correctly on index.html.
  // -------------------------------------------------------------------------

  var NAV_HTML = [
    '<nav>',
    '  <a href="index.html#top" class="nav-logo">',
    '    <img src="public/Logos/Logo - Primary Accent.png" alt="Octopus AI" />',
    '    <span class="nav-logo-name">Octopus AI</span>',
    '  </a>',
    '  <ul class="nav-links">',
    '    <li><a href="index.html#what">What</a></li>',
    '    <li><a href="index.html#how">How</a></li>',
    '    <li><a href="index.html#results">Results</a></li>',
    '  </ul>',
    '  <div class="nav-actions">',
    '    <a href="contact.html" class="btn btn-primary nav-cta">Book Call</a>',
    '    <button',
    '      class="menu-toggle"',
    '      type="button"',
    '      aria-label="Toggle navigation"',
    '      aria-expanded="false"',
    '      aria-controls="mobile-menu"',
    '    >',
    '      <span></span>',
    '      <span></span>',
    '      <span></span>',
    '    </button>',
    '  </div>',
    '</nav>',
    '<div id="mobile-menu" class="mobile-menu" hidden>',
    '  <div class="mobile-menu-inner">',
    '    <a href="index.html#what">What</a>',
    '    <a href="index.html#how">How</a>',
    '    <a href="index.html#results">Results</a>',
    '    <a href="contact.html" class="btn btn-primary mobile-menu-cta">Book Call</a>',
    '  </div>',
    '</div>',
  ].join('\n');

  // -------------------------------------------------------------------------
  // Footer
  // -------------------------------------------------------------------------

  var FOOTER_HTML = [
    '<div class="footer">',
    '  <div class="footer-brand">',
    '    <img src="public/Logos/Logo - Primary Accent.png" alt="Octopus AI" />',
    '    <span>Octopus AI</span>',
    '  </div>',
    '  <span class="footer-meta">&copy; 2026 Octopus AI &middot; asktheoctopus.com</span>',
    '  <div class="footer-links">',
    '    <a href="privacy-policy.html">Privacy</a>',
    '    <a href="terms-of-use.html">Terms</a>',
    '  </div>',
    '</div>',
  ].join('\n');

  // -------------------------------------------------------------------------
  // Inject into placeholders
  // -------------------------------------------------------------------------

  var navPlaceholder = document.getElementById('nav-placeholder');
  if (navPlaceholder) {
    navPlaceholder.outerHTML = NAV_HTML;
  }

  var footerPlaceholder = document.getElementById('footer-placeholder');
  if (footerPlaceholder) {
    footerPlaceholder.outerHTML = FOOTER_HTML;
  }
})();
