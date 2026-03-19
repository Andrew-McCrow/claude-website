/**
 * Shared page components — nav and footer.
 *
 * Edit the HTML strings below to update the nav or footer across every page.
 * This script must be loaded before menu.js so that the injected elements
 * are in the DOM when menu.js initialises.
 */

(function () {
  // Derive the path prefix to assets/ based on where this script lives.
  // e.g. if loaded as "assets/js/components.js" → base = ""
  //      if loaded as "../assets/js/components.js" → base = "../"
  var scriptSrc = (document.currentScript && document.currentScript.src) || "";
  var base = scriptSrc.replace(/assets\/js\/components\.js[^/]*$/, "");
  // Strip the origin so we get a relative path only (works for file:// too)
  base = base.replace(/^https?:\/\/[^/]+/, "");

  // -------------------------------------------------------------------------
  // Navigation
  // -------------------------------------------------------------------------

  var NAV_HTML = [
    "<nav>",
    '  <a href="/" class="nav-logo">',
    '    <img src="' + base + 'assets/images/logo-primary.png" alt="Octopus AI" />',
    '    <span class="nav-logo-name">Octopus AI</span>',
    "  </a>",
    '  <ul class="nav-links">',
    '    <li class="nav-dropdown">',
    '      <button class="nav-dropdown-toggle" aria-expanded="false" aria-haspopup="true">',
    "        Use Cases",
    '        <svg class="nav-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>',
    "      </button>",
    '      <ul class="nav-dropdown-menu" role="menu">',
    '        <li role="none"><a href="/property-management" role="menuitem">Property Management</a></li>',
    '        <li role="none"><a href="/venture-capital" role="menuitem">Venture Capital</a></li>',
    "      </ul>",
    "    </li>",
    '    <li class="nav-dropdown">',
    '      <button class="nav-dropdown-toggle" aria-expanded="false" aria-haspopup="true">',
    "        Solutions",
    '        <svg class="nav-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>',
    "      </button>",
    '      <ul class="nav-dropdown-menu" role="menu">',
    '        <li role="none"><a href="/customer-support" role="menuitem">Customer Support</a></li>',
    '        <li role="none"><a href="/inbound-sales" role="menuitem">Inbound Sales</a></li>',
    '        <li role="none"><a href="/procurement" role="menuitem">Procurement</a></li>',
    '        <li role="none"><a href="/recruitment" role="menuitem">Recruitment</a></li>',
    '        <li role="none"><a href="/screening" role="menuitem">Screening</a></li>',
    '        <li role="none"><a href="/training" role="menuitem">Training</a></li>',
    "      </ul>",
    "    </li>",
    "  </ul>",
    '  <div class="nav-actions">',
    '    <a href="/contact" class="btn btn-primary nav-cta">Book Call</a>',
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
    '    <a href="/property-management">Property Management</a>',
    '    <a href="/venture-capital">Venture Capital</a>',
    '    <span class="mobile-menu-label">Solutions</span>',
    '    <a href="/customer-support">Customer Support</a>',
    '    <a href="/inbound-sales">Inbound Sales</a>',
    '    <a href="/procurement">Procurement</a>',
    '    <a href="/recruitment">Recruitment</a>',
    '    <a href="/screening">Screening</a>',
    '    <a href="/training">Training</a>',
    '    <a href="/contact" class="btn btn-primary mobile-menu-cta">Book Call</a>',
    "  </div>",
    "</div>",
  ].join("\n");

  // -------------------------------------------------------------------------
  // Footer
  // -------------------------------------------------------------------------

  var FOOTER_HTML = [
    '<div class="footer">',
    '  <div class="footer-brand">',
    '    <a href="/" aria-label="Go to homepage">',
    '      <img src="' + base + 'assets/images/logo-primary.png" alt="Octopus AI" />',
    "      <span>Octopus AI</span>",
    "    </a>",
    "  </div>",
    '  <span class="footer-meta">&copy; 2026 Octopus AI &middot; asktheoctopus.com</span>',
    '  <div class="footer-links">',
    '    <a href="/privacy-policy">Privacy</a>',
    '    <a href="/terms-of-use">Terms</a>',
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
