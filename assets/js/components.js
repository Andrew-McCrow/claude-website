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
    "<nav>",
    '  <a href="index.html#top" class="nav-logo">',
    '    <img src="assets/images/logo-primary.png" alt="Octopus AI" />',
    '    <span class="nav-logo-name">Octopus AI</span>',
    "  </a>",
    '  <ul class="nav-links">',
    '    <li class="nav-dropdown">',
    '      <button class="nav-dropdown-toggle" aria-expanded="false" aria-haspopup="true">',
    "        Use Cases",
    '        <svg class="nav-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>',
    "      </button>",
    '      <ul class="nav-dropdown-menu" role="menu">',
    '        <li role="none"><a href="property-management.html" role="menuitem">Property Management</a></li>',
    '        <li role="none"><a href="venture-capital.html" role="menuitem">Venture Capital</a></li>',
    "      </ul>",
    "    </li>",
    '    <li class="nav-dropdown">',
    '      <button class="nav-dropdown-toggle" aria-expanded="false" aria-haspopup="true">',
    "        Solutions",
    '        <svg class="nav-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>',
    "      </button>",
    '      <ul class="nav-dropdown-menu" role="menu">',
    '        <li role="none"><a href="customer-support.html" role="menuitem">Customer Support</a></li>',
    '        <li role="none"><a href="inbound-sales.html" role="menuitem">Inbound Sales</a></li>',
    '        <li role="none"><a href="procurement.html" role="menuitem">Procurement</a></li>',
    '        <li role="none"><a href="recruitment.html" role="menuitem">Recruitment</a></li>',
    '        <li role="none"><a href="screening.html" role="menuitem">Screening</a></li>',
    '        <li role="none"><a href="training.html" role="menuitem">Training</a></li>',
    "      </ul>",
    "    </li>",
    "  </ul>",
    '  <div class="nav-actions">',
    '    <a href="contact.html" class="btn btn-primary nav-cta">Book Call</a>',
    "    <button",
    '      class="menu-toggle"',
    '      type="button"',
    '      aria-label="Toggle navigation"',
    '      aria-expanded="false"',
    '      aria-controls="mobile-menu"',
    "    >",
    "      <span></span>",
    "      <span></span>",
    "      <span></span>",
    "    </button>",
    "  </div>",
    "</nav>",
    '<div id="mobile-menu" class="mobile-menu" hidden>',
    '  <div class="mobile-menu-inner">',
    '    <span class="mobile-menu-label">Use Cases</span>',
    '    <a href="property-management.html">Property Management</a>',
    '    <a href="venture-capital.html">Venture Capital</a>',
    '    <span class="mobile-menu-label">Solutions</span>',
    '    <a href="customer-support.html">Customer Support</a>',
    '    <a href="inbound-sales.html">Inbound Sales</a>',
    '    <a href="procurement.html">Procurement</a>',
    '    <a href="recruitment.html">Recruitment</a>',
    '    <a href="screening.html">Screening</a>',
    '    <a href="training.html">Training</a>',
    '    <a href="contact.html" class="btn btn-primary mobile-menu-cta">Book Call</a>',
    "  </div>",
    "</div>",
  ].join("\n");

  // -------------------------------------------------------------------------
  // Footer
  // -------------------------------------------------------------------------

  var FOOTER_HTML = [
    '<div class="footer">',
    '  <div class="footer-brand">',
    '    <a href="index.html#top" aria-label="Go to homepage">',
    '      <img src="assets/images/logo-primary.png" alt="Octopus AI" />',
    "      <span>Octopus AI</span>",
    "    </a>",
    "  </div>",
    '  <span class="footer-meta">&copy; 2026 Octopus AI &middot; asktheoctopus.com</span>',
    '  <div class="footer-links">',
    '    <a href="privacy-policy.html">Privacy</a>',
    '    <a href="terms-of-use.html">Terms</a>',
    "  </div>",
    "</div>",
  ].join("\n");

  // -------------------------------------------------------------------------
  // Inject into placeholders
  // -------------------------------------------------------------------------

  var navPlaceholder = document.getElementById("nav-placeholder");
  if (navPlaceholder) {
    navPlaceholder.outerHTML = NAV_HTML;
  }

  var footerPlaceholder = document.getElementById("footer-placeholder");
  if (footerPlaceholder) {
    footerPlaceholder.outerHTML = FOOTER_HTML;
  }
})();
