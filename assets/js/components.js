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

  var uc = base + "pages/use-cases/";
  var sol = base + "pages/solutions/";
  var con = base + "pages/contact/";
  var pol = base + "pages/policies/";

  var NAV_HTML = [
    "<nav>",
    '  <a href="' + base + 'index.html" class="nav-logo">',
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
    '        <li role="none"><a href="' + uc + 'property-management.html" role="menuitem">Property Management</a></li>',
    '        <li role="none"><a href="' + uc + 'venture-capital.html" role="menuitem">Venture Capital</a></li>',
    "      </ul>",
    "    </li>",
    '    <li class="nav-dropdown">',
    '      <button class="nav-dropdown-toggle" aria-expanded="false" aria-haspopup="true">',
    "        Solutions",
    '        <svg class="nav-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>',
    "      </button>",
    '      <ul class="nav-dropdown-menu" role="menu">',
    '        <li role="none"><a href="' + sol + 'customer-support.html" role="menuitem">Customer Support</a></li>',
    '        <li role="none"><a href="' + sol + 'inbound-sales.html" role="menuitem">Inbound Sales</a></li>',
    '        <li role="none"><a href="' + sol + 'procurement.html" role="menuitem">Procurement</a></li>',
    '        <li role="none"><a href="' + sol + 'recruitment.html" role="menuitem">Recruitment</a></li>',
    '        <li role="none"><a href="' + sol + 'screening.html" role="menuitem">Screening</a></li>',
    '        <li role="none"><a href="' + sol + 'training.html" role="menuitem">Training</a></li>',
    "      </ul>",
    "    </li>",
    "  </ul>",
    '  <div class="nav-actions">',
    '    <a href="' + con + 'contact.html" class="btn btn-primary nav-cta">Book Call</a>',
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
    '    <a href="' + uc + 'property-management.html">Property Management</a>',
    '    <a href="' + uc + 'venture-capital.html">Venture Capital</a>',
    '    <span class="mobile-menu-label">Solutions</span>',
    '    <a href="' + sol + 'customer-support.html">Customer Support</a>',
    '    <a href="' + sol + 'inbound-sales.html">Inbound Sales</a>',
    '    <a href="' + sol + 'procurement.html">Procurement</a>',
    '    <a href="' + sol + 'recruitment.html">Recruitment</a>',
    '    <a href="' + sol + 'screening.html">Screening</a>',
    '    <a href="' + sol + 'training.html">Training</a>',
    '    <a href="' + con + 'contact.html" class="btn btn-primary mobile-menu-cta">Book Call</a>',
    "  </div>",
    "</div>",
  ].join("\n");

  // -------------------------------------------------------------------------
  // Footer
  // -------------------------------------------------------------------------

  var FOOTER_HTML = [
    '<div class="footer">',
    '  <div class="footer-brand">',
    '    <a href="' + base + 'index.html" aria-label="Go to homepage">',
    '      <img src="' + base + 'assets/images/logo-primary.png" alt="Octopus AI" />',
    "      <span>Octopus AI</span>",
    "    </a>",
    "  </div>",
    '  <span class="footer-meta">&copy; 2026 Octopus AI &middot; asktheoctopus.com</span>',
    '  <div class="footer-links">',
    '    <a href="' + pol + 'privacy-policy.html">Privacy</a>',
    '    <a href="' + pol + 'terms-of-use.html">Terms</a>',
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
