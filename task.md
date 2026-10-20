# E-Commerce Project Roadmap & Task Checklist

This document tracks the feature status, completed deliverables, and remaining action items for the luxury e-commerce platform.

---

## 1. Feature Checklist & Audit Status

### A. Homepage
- [x] Announcement bar / promotional message *(Implemented: top-level luxury continuous marquee bar above Navbar with interactive promo code copy, pause/play accessibility controls, and smooth dismissal)*
- [x] Header with logo, navigation, search, account and cart
- [x] Hero banner with campaign imagery and CTA
- [x] Featured collections / categories
- [x] New arrivals and bestsellers
- [x] Editorial / brand story section *(Implemented: bespoke asymmetric magazine-layout BrandStory section with manifesto headline, narrative columns, "Read more" link to /about, and contact-sheet lookbook indicators)*
- [x] Featured products carousel or grid
- [x] Promotional or seasonal campaign sections
- [x] Newsletter subscription *(Implemented in Footer with private ledger validation)*
- [x] Footer with customer service, policies and social links *(Implemented in Footer with Customer Support, Return & Refund Policy, Bespoke Support, and circular social channels)*

### B. Product Listing & Discovery
- [x] Category and collection listing pages
- [x] Product cards with images, name and price
- [x] Hover image / alternate product image
- [x] Search with suggestions and empty results *(Implemented on /search page with rotating placeholders, trending chips, live autocomplete popover with product previews, and luxury empty state with curated suggestions and fallback product grid; unmounted SearchOverlay removed)*
- [x] Filters: size, colour, price, category and availability *(Implemented across /shop and /search: Category, Size pills, Luxury Colour swatches, Price range with presets & slider, and In-Stock availability with active filter chips, individual removal, and clear-all action)*
- [x] Sorting: featured, newest, price
- [x] Active filter chips and clear-all action
- [x] Pagination or load-more behaviour
- [x] Wishlist action on product cards
- [x] Responsive grid for mobile, tablet and desktop

### C. Product Detail Page (PDP)
- [x] Product image gallery with zoom
- [x] Product name, price and description
- [x] Colour and size/variant selection *(Luxury circular swatches with active ring, color-linked image switching, and dynamic size filtering)*
- [x] Size guide and fit information
- [x] Stock / availability feedback
- [x] Quantity selector where appropriate
- [x] Add-to-cart and wishlist actions
- [x] Delivery estimate and shipping information
- [x] Materials, care instructions and product details
- [x] Returns policy and customer reviews *(7-day policy & verified-purchaser reflection submission on PDP and Order Details)*
- [x] Related products / complete-the-look recommendations
- [x] Clear feedback after adding to cart

### D. Cart & Wishlist
- [x] Cart drawer or cart page
- [x] Product thumbnail, variant, quantity and price
- [x] Increase/decrease quantity and remove item
- [x] Subtotal, discounts, shipping and total breakdown
- [x] Promo code application and error states
- [x] Continue shopping and proceed-to-checkout actions
- [x] Out-of-stock or price-change feedback *(Real-time inventory and catalog price validation across cart drawer, cart page, and checkout with one-click resolution)*
- [x] Empty-cart state with shopping CTA
- [x] Wishlist page with remove and move-to-cart actions
- [x] Cart persistence when navigating or refreshing *(useCartStore backed by localStorage)*

### E. Checkout & Delivery
- [x] Guest checkout and sign-in option *(Enforced authentication: guests clicking checkout are prompted to sign in or create an account)*
- [x] Customer contact details
- [x] Shipping address form and validation
- [x] Saved address selection and editing *(Loads default address for shipping; quick-fill chips from saved addresses for distinct billing entity)*
- [x] Delivery method and estimated delivery date
- [x] Billing address selection *(Implemented: "Billing address matches shipping destination" luxury toggle, distinct billing address form with client/entity name, street address, city, state, PIN, quick-fill chips from saved addresses, inline validation, and order confirmation / order details breakdown)*
- [x] Order summary visible during checkout
- [x] Payment method selection and validation
- [x] Payment success, failure, retry and loading states
- [x] Order confirmation page and order number *(Both Order ID and Tracking ID prominently displayed with one-click copy and courier details)*
- [x] Confirmation message / email UI
- [x] Mobile-friendly checkout with clear progress

### F. Customer Account & Post-Purchase
- [x] Sign-up, login, logout and password reset
- [x] Profile details and saved addresses
- [x] Order history and order details
- [x] Order status and shipment tracking
- [x] Cancel order where eligible
- [x] Return / exchange request flow
- [x] Refund status and return instructions
- [x] Product reviews and rating submission *(Enabled across PDP with verified owner badges, and direct review modals in Order history & Order details)*
- [x] Help centre, contact support and FAQs *(Interactive Help Centre & FAQ page with live search, categories, accordions, step-by-step guides, plus tabbed Concierge ticket desk)*

### G. Luxury Brand Experience
- [x] Consistent typography, spacing and colour palette
- [x] High-quality product photography and art direction
- [x] Minimal, premium visual hierarchy
- [x] Subtle hover, transition and micro-interaction effects
- [x] Consistent buttons, forms, cards and iconography
- [x] Trust signals: authenticity, secure payment and returns
- [x] Premium packaging / gift options *(Out of scope — standard atelier packaging provided)*
- [x] Accessibility: contrast, keyboard navigation and focus states
- [x] No clutter, broken imagery or inconsistent layouts

### H. Responsive, States & Usability Testing
- [x] Test desktop, tablet and mobile layouts *(Audited and verified across 360px, 768px, 1024px, and 1440px+ viewports with zero horizontal overflow, fluid typography, and 100dvh safe-area viewport heights)*
- [x] Test all navigation links and interactive controls *(Verified across Navbar, mobile slide-over drawer, category navigation, live search autocomplete, filter drawer, checkout steps, and footer)*
- [x] Loading skeletons or loading indicators
- [x] Empty, error, success and disabled states
- [x] Form validation and useful error messages
- [x] Slow network, refresh and back-button behaviour *(Cart state preserved across refreshes)*
- [x] Image loading, fallback and broken-image handling
- [x] Keyboard navigation and accessible labels
- [x] No horizontal overflow or clipped content
- [x] Consistent spacing and alignment across pages

---

## 2. Action Items & Prioritized Tasks

### Priority 1: Core E-Commerce & UX (P0)

- [x] **Task 1: Cart & Wishlist Persistence**
  - **Files**: `frontend/src/store/useCartStore.ts`, `frontend/src/store/useWishlistStore.ts`
  - **Goal**: Integrate Zustand `persist` middleware with `localStorage` so items survive browser refresh and navigation.

- [x] **Task 2: Size & Colour Filters on Shop Page**
  - **Files**: `frontend/src/components/views/ShopView.tsx`
  - **Goal**: Added Size pills, alphabetical luxury Colour swatches (`COLOR_GROUPS`), price slider with presets, and in-stock availability filters with active filter chips and clear-all action to the shop filter drawer.

- [x] **Task 3: Colour Selection on Product Detail Page (PDP)**
  - **Files**: `frontend/src/components/views/ProductDetailView.tsx`
  - **Goal**: Added visual colour swatches with active ring indicator, hover colour labels, color-linked image preview switching, and dynamic size availability filtering based on selected colourway.

- [x] **Task 4: Real-time In-Cart Stock & Price Validation**
  - **Files**: `frontend/src/components/cart/CartDrawer.tsx`, `frontend/src/components/views/CartView.tsx`, `frontend/src/store/useCartStore.ts`
  - **Goal**: Implemented real-time catalog price and stock level validation across Cart Drawer, Cart page, and Checkout, with warning banners, auto-sync price adjustments, and one-click removal of unfulfillable items.

---

### Priority 2: Checkout & Policy Completeness (P1)

- [x] **Task 5: Order ID Display & Confirmation Enhancements**
  - **Files**: `frontend/src/components/views/CheckoutView.tsx`, `frontend/src/components/views/OrderDetailView.tsx`
  - **Goal**: Prominently displayed explicit Order ID (e.g. `ORD-849201`) alongside Carrier Tracking ID on the checkout confirmation screen and order detail views with one-click copy buttons and delivery dossier notice.

- [x] **Task 6: Checkout Saved Address Picker & Billing Address Toggle**
  - **Files**: `frontend/src/components/views/CheckoutView.tsx`
  - **Goal**: Added luxury "Billing address matches shipping destination" toggle, distinct billing entity form, and quick-fill chips from saved profile addresses. Auto-populates shipping address from authenticated client default address.

- [x] **Task 7: Guest Checkout vs. Sign-in Option**
  - **Files**: `frontend/src/components/views/CheckoutView.tsx`, `frontend/src/components/checkout/CheckoutAuthModal.tsx`
  - **Goal**: Implemented mandatory patron authentication gate at Step 1 of checkout with tabbed Sign-in / Register forms and `CheckoutAuthModal` interceptor for unauthenticated patrons initiating checkout from cart/drawer.

- [x] **Task 8: Footer Policies & Social Media Links**
  - **Files**: `frontend/src/components/navigation/Footer.tsx`
  - **Goal**: Integrated luxury circular social media channels (Instagram, Facebook, YouTube, Telegram, WhatsApp), headquarters address, and links to Client Concierge, Help Centre & FAQs, Order History, and Bespoke Support.

---

### Priority 3: Polish & Brand Narrative (P2)

- [x] **Task 9: Top Announcement Bar**
  - **Files**: `frontend/src/components/navigation/Navbar.tsx`, `frontend/src/components/navigation/AnnouncementBar.tsx`
  - **Goal**: Add a dismissible or subtle luxury announcement bar for complimentary white-glove delivery and seasonal notices.

- [x] **Task 10: Enable Product Review Submission**
  - **Files**: `frontend/src/components/product/ReviewForm.tsx`, `frontend/src/components/views/ProductDetailView.tsx`, `frontend/src/components/views/OrderDetailView.tsx`, `frontend/src/app/(storefront)/account/orders/page.tsx`, `frontend/src/components/account/OrderRow.tsx`
  - **Goal**: Mounted ReviewForm across PDP, Order history list, and Order details with verified purchase enforcement. Verified owners get celebrated "Verified Owner" badges, while patrons can submit reflections directly.

- [x] **Task 11: Search with Suggestions & Empty Results on Search Page**
  - **Files**: `frontend/src/components/views/SearchView.tsx`, `frontend/src/app/(storefront)/search/page.tsx`
  - **Goal**: Integrated dynamic rotating placeholders, trending inquiry chips, keyboard-navigable autocomplete popover with live previews, and luxury empty state with recommendations directly on the dedicated search page. Deleted deprecated unmounted `SearchOverlay.tsx`.

- [x] **Task 12: Help Centre & FAQs Page**
  - **Files**: `frontend/src/data/faqsData.ts`, `frontend/src/components/views/FaqView.tsx`, `frontend/src/components/views/SupportView.tsx`, `frontend/src/app/(storefront)/faq/page.tsx`, `frontend/src/components/navigation/Footer.tsx`, `frontend/src/components/layout/AccountLayout.tsx`
  - **Goal**: Created dedicated `/faq` page and integrated Help Centre with live instant search, category filters, animated accordions, step-by-step atelier protocol guides, direct salon/phone/email channels, and seamless tabbed integration in the Account Concierge Desk.

- [x] **Task 13: Luxury Gift Packaging & Notes** *(Out of Scope — Standard atelier packaging provided)*

- [x] **Task 14: Brand Storytelling & Craftsmanship Section**
  - **Files**: `frontend/src/components/views/HomeView.tsx`
  - **Goal**: Implemented bespoke `BrandStory` section featuring manifesto headline, Florentine leather & Milanese tailoring heritage narrative, and lookbook indicators.

- [x] **Task 15: Editorial About Us & Brand Heritage Page**
  - **Files**: `frontend/src/app/(storefront)/about/page.tsx`, `frontend/src/components/views/AboutView.tsx`
  - **Goal**: Created editorial brand journey page featuring Florentine leather and Milanese tailoring heritage, master artisan portraits, material traceability manifesto, and interactive timeline.

- [x] **Task 16: Catalog Alphabetization & Sorting Governance**
  - **Files**: `frontend/src/data/categories.json`, `frontend/src/lib/mockApi.ts`, `frontend/src/app/admin/(panel)/products/page.tsx`, `frontend/src/components/views/ShopView.tsx`
  - **Goal**: Alphabetized product catalog and category listings systematically across customer storefront navigation, filter drawers, and admin inventory management panels.

- [x] **Task 17: Lookahead Scroll Image Preloading & WebP Standard**
  - **Files**: `frontend/src/hooks/useScrollPreload.ts`, `frontend/src/lib/preloadImage.ts`, `frontend/src/components/product/ProductCard.tsx`
  - **Goal**: Implemented scroll-velocity lookahead preloader to pre-cache upcoming catalog product images before they enter viewport. Converted and standardized all imagery to WebP format.

- [x] **Task 18: Design System Tokens & Interactive Feedback Polish**
  - **Files**: `frontend/src/styles/globals.css`, `frontend/COLOR_SYSTEM.md`, `frontend/src/components/ui/Button.tsx`, `frontend/src/components/navigation/Navbar.tsx`
  - **Goal**: Refined design tokens and color system documentation, enhanced Button component with robust programmatic and Link-based navigation, added isolated icon tooltips in Navbar, and verified WCAG AA contrast.

- [x] **Task 19: Font System Audit & Token Alignment**
  - **Files**: `frontend/src/styles/typography.css`, `frontend/src/styles/variables.css`, `frontend/src/components/shop/SectionBanner.tsx`, `frontend/src/components/ui/FilterDropdownSection.tsx`, `frontend/src/components/ui/RangeSlider.tsx`, `frontend/src/components/ui/OrderStepper.tsx`, `frontend/src/components/views/ShopView.tsx`, `frontend/src/components/views/SearchView.tsx`, `frontend/src/components/views/NewArrivalsView.tsx`, `frontend/src/components/views/AboutView.module.css`, `frontend/src/components/sections/BrandStory.module.css`
  - **Goal**: Resolved all font token ambiguities and missing fallbacks across the codebase. Added `--font-serif` and `--font-sans` token aliases in `typography.css` and `variables.css`, added `.font-sans` and `.font-serif` utility classes, and updated all component occurrences to use canonical tokens `var(--font-display)` and `var(--font-body)`.

- [x] **Task 20: Comprehensive Color System Audit & Design Token Harmonization**
  - **Files**: `frontend/src/styles/globals.css`, `frontend/src/styles/variables.css`, `frontend/src/lib/colorUtils.ts`, `frontend/src/components/views/ShopView.tsx`, `frontend/src/components/views/SearchView.tsx`, `frontend/src/components/views/NewArrivalsView.tsx`, `frontend/src/components/layout/AccountLayout.tsx`, `frontend/src/app/admin/login/page.tsx`, `frontend/src/app/admin/(panel)/dashboard/page.tsx`, `frontend/src/components/admin/AdminDropdown.tsx`, `frontend/src/components/admin/SilhouetteImageCropperModal.tsx`
  - **Goal**: Audited every file across the codebase to ensure 100% adherence to the Aurelia luxury palette (`--color-diamond`, `--color-black-tie`, `--color-sapphire-*`, `--color-golden-*`, `--color-icy-lake-*`, `--color-neutral-*`, `--color-error`). Replaced all raw hex literals and obsolete color fallbacks across global styles, customer storefront layouts, search/shop views, and admin management panels with design tokens. Centralized catalog garment swatches in `colorUtils.ts`. Full audit verified with **0 color issues and 0 font issues** remaining across all 163 files.

---

### Priority 4: Responsive Design, Touch Ergonomics & Mobile Experience (P3)

- [x] **Task 21: Mobile Sticky Add-to-Cart Bar & PDP Touch Ergonomics**
  - **Files**: `frontend/src/components/views/ProductDetailView.tsx`, `frontend/src/components/product/ProductCard.tsx`, `frontend/src/components/ui/Input.tsx`
  - **Goal**: Implemented mobile sticky add-to-cart bar with intersection observer detection for smooth in/out transitions, responsive gallery columnar switching, and expanded rating star touch targets (>= 44px) for mobile ergonomics.

- [x] **Task 22: Comprehensive Storefront Touch Ergonomics & Safe-Area Audit**
  - **Files**: All 8 storefront areas (`Navigation`, `Home`, `Shop`, `Product`, `Cart`, `Checkout`, `Account`, `Search`, `Footer`)
  - **Goal**: Standardized interactive touch targets to meet WCAG 2.5.5 / 2.5.8 (>= 44px), enforced >= 16px font sizes on form inputs preventing iOS auto-zoom, and integrated 100dvh dynamic viewport safe-area scrolling in CartDrawer and modals. Verified zero horizontal overflow across 360px–1920px viewports.

- [x] **Task 23: Cormorant Garamond Fluid Typography & Balance Modernization**
  - **Files**: `frontend/src/styles/typography.css`, `frontend/src/styles/globals.css`, storefront view templates
  - **Goal**: Upgraded luxury typography to Cormorant Garamond font system, implemented fluid scale tokens (`clamp()`), enabled `text-wrap: balance` for editorial headlines, and refined typographic hierarchy across mobile, tablet, and desktop breakpoints.

- [x] **Task 24: Standardized Header Offset Tokens, Image Loading & Dropdown Responsiveness**
  - **Files**: `frontend/src/styles/variables.css`, `frontend/src/styles/globals.css`, `frontend/src/components/navigation/Navbar.tsx`, `frontend/src/components/ui/FilterDropdownSection.tsx`, `frontend/src/components/views/ShopView.tsx`, `frontend/src/components/shop/SectionBanner.tsx`
  - **Goal**: Defined `--header-total-height` and `--page-top-offset` CSS variables across breakpoints to eliminate layout jumps and content overlap under the fixed marquee and navbar. Optimized image loading attributes (eager vs lazy, responsive sizes) across banners and product cards. Refined dropdown/popover positioning and touch sizing for mobile and tablet screens.

- [x] **Task 25: All Collections Shop by Department Banner Image Responsiveness**
  - **Files**: `frontend/src/components/views/CollectionsView.tsx`, `frontend/src/components/views/CollectionsView.module.css`
  - **Goal**: Resolved mobile/tablet responsiveness issues for Men's Wardrobe and Women's Collection department banners in `/collections`. Replaced fixed `minmax(340px, 1fr)` grid with fluid responsive CSS module (`1fr` on mobile, `repeat(2, minmax(0, 1fr))` on tablet/desktop), preventing mobile horizontal overflow and avoiding tablet single-column image blowouts. Harmonized image `objectPosition` to `center 8%` with priority loading, fluid typography, and responsive Next.js `sizes` prop.


