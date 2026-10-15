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
- [ ] Filters: size, colour, price, category and availability *(Price, Category & Availability present; Size & Colour filters missing from /shop)*
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
- [ ] Returns policy and customer reviews *(7-day policy & review list present; ReviewForm submission is disabled)*
- [x] Related products / complete-the-look recommendations
- [x] Clear feedback after adding to cart

### D. Cart & Wishlist
- [x] Cart drawer or cart page
- [x] Product thumbnail, variant, quantity and price
- [x] Increase/decrease quantity and remove item
- [x] Subtotal, discounts, shipping and total breakdown
- [x] Promo code application and error states
- [x] Continue shopping and proceed-to-checkout actions
- [ ] Out-of-stock or price-change feedback *(No real-time cart warning prior to checkout submission)*
- [x] Empty-cart state with shopping CTA
- [x] Wishlist page with remove and move-to-cart actions
- [ ] Cart persistence when navigating or refreshing *(useCartStore lacks localStorage persistence)*

### E. Checkout & Delivery
- [ ] Guest checkout and sign-in option *(No guest/sign-in choice prompt or toggle)*
- [x] Customer contact details
- [x] Shipping address form and validation
- [ ] Saved address selection and editing *(Loads default address; no picker for multiple saved addresses)*
- [x] Delivery method and estimated delivery date
- [ ] Billing address selection *(No billing address form or "Same as shipping" toggle)*
- [x] Order summary visible during checkout
- [x] Payment method selection and validation
- [x] Payment success, failure, retry and loading states
- [ ] Order confirmation page and order number *(Tracking number shown, but Order ID is omitted from UI)*
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
- [ ] Product reviews and rating submission *(ReviewForm unmounted across PDP and Order history)*
- [ ] Help centre, contact support and FAQs *(Concierge ticket desk present; FAQs / Help Centre articles missing)*

### G. Luxury Brand Experience
- [x] Consistent typography, spacing and colour palette
- [x] High-quality product photography and art direction
- [x] Minimal, premium visual hierarchy
- [x] Subtle hover, transition and micro-interaction effects
- [x] Consistent buttons, forms, cards and iconography
- [x] Trust signals: authenticity, secure payment and returns
- [ ] Premium packaging / gift options if in scope *(No gift packaging or gift note selection)*
- [x] Accessibility: contrast, keyboard navigation and focus states
- [x] No clutter, broken imagery or inconsistent layouts

### H. Responsive, States & Usability Testing
- [x] Test desktop, tablet and mobile layouts
- [x] Test all navigation links and interactive controls
- [x] Loading skeletons or loading indicators
- [x] Empty, error, success and disabled states
- [x] Form validation and useful error messages
- [ ] Slow network, refresh and back-button behaviour *(Cart state reset on refresh)*
- [x] Image loading, fallback and broken-image handling
- [x] Keyboard navigation and accessible labels
- [x] No horizontal overflow or clipped content
- [x] Consistent spacing and alignment across pages

---

## 2. Action Items & Prioritized Tasks

### Priority 1: Core E-Commerce & UX (P0)

- [ ] **Task 1: Cart & Wishlist Persistence**
  - **Files**: `frontend/src/store/useCartStore.ts`, `frontend/src/store/useWishlistStore.ts`
  - **Goal**: Integrate Zustand `persist` middleware with `localStorage` so items survive browser refresh and navigation.

- [ ] **Task 2: Size & Colour Filters on Shop Page**
  - **Files**: `frontend/src/components/views/ShopView.tsx`
  - **Goal**: Add Size and Colour swatch filter controls to the shop filter drawer, mirroring the existing filter functionality in `SearchView.tsx`.

- [ ] **Task 3: Colour Selection on Product Detail Page (PDP)**
  - **Files**: `frontend/src/components/views/ProductDetailView.tsx`
  - **Goal**: Add visual colour swatches alongside the size buttons so clients can pick variant colours directly.

- [ ] **Task 4: Real-time In-Cart Stock & Price Validation**
  - **Files**: `frontend/src/components/cart/CartDrawer.tsx`, `frontend/src/components/views/CartView.tsx`
  - **Goal**: Flag out-of-stock items or price adjustments with clear inline notices before initiating checkout.

---

### Priority 2: Checkout & Policy Completeness (P1)

- [ ] **Task 5: Order ID Display & Confirmation Enhancements**
  - **Files**: `frontend/src/components/views/CheckoutView.tsx`
  - **Goal**: Display the explicit Order ID (e.g. `Order #ORD-849201`) on the order confirmation screen alongside the carrier tracking ID.

- [ ] **Task 6: Checkout Saved Address Picker & Billing Address Toggle**
  - **Files**: `frontend/src/components/views/CheckoutView.tsx`
  - **Goal**: Allow authenticated users to select between their saved addresses and add an optional "Billing address same as shipping" toggle.

- [ ] **Task 7: Guest Checkout vs. Sign-in Option**
  - **Files**: `frontend/src/components/views/CheckoutView.tsx`
  - **Goal**: Add a prominent sign-in prompt/toggle for unauthenticated users at step 1 of checkout.

- [ ] **Task 8: Footer Policies & Social Media Links**
  - **Files**: `frontend/src/components/navigation/Footer.tsx`, `frontend/src/app/(storefront)/policies/`
  - **Goal**: Add links to Privacy Policy, Terms of Service, and Shipping/Returns, plus luxury social media icons (Instagram, Pinterest, Facebook).

---

### Priority 3: Polish & Brand Narrative (P2)

- [ ] **Task 9: Top Announcement Bar**
  - **Files**: `frontend/src/components/navigation/Navbar.tsx` or `frontend/src/components/layout/StorefrontLayoutWrapper.tsx`
  - **Goal**: Add a dismissible or subtle luxury announcement bar for complimentary white-glove delivery and seasonal notices.

- [ ] **Task 10: Enable Product Review Submission**
  - **Files**: `frontend/src/components/product/ReviewForm.tsx`, `frontend/src/components/views/ProductDetailView.tsx`, `frontend/src/components/views/OrderDetailView.tsx`
  - **Goal**: Mount the review form on verified purchased orders or in an expandable modal on the PDP.

- [x] **Task 11: Search with Suggestions & Empty Results on Search Page**
  - **Files**: `frontend/src/components/views/SearchView.tsx`, `frontend/src/app/(storefront)/search/page.tsx`
  - **Goal**: Integrated dynamic rotating placeholders, trending inquiry chips, keyboard-navigable autocomplete popover with live previews, and luxury empty state with recommendations directly on the dedicated search page. Deleted deprecated unmounted `SearchOverlay.tsx`.

- [ ] **Task 12: Help Centre & FAQs Page**
  - **Files**: `frontend/src/components/views/SupportView.tsx`, `frontend/src/app/(storefront)/faq/page.tsx`
  - **Goal**: Provide an accordion FAQ covering sizing, bespoke tailoring, shipping times, and 7-day returns.

- [ ] **Task 13: Luxury Gift Packaging & Notes**
  - **Files**: `frontend/src/components/cart/CartDrawer.tsx`, `frontend/src/components/views/CheckoutView.tsx`
  - **Goal**: Add a checkbox for "Complimentary Atelier Gift Packaging" and optional personalized gift note input.

- [ ] **Task 14: Brand Storytelling & Craftsmanship Section**
  - **Files**: `frontend/src/components/views/HomeView.tsx`
  - **Goal**: Implement the `brand_story` section showcasing the Florentine leather and Milanese tailoring heritage rather than returning `null`.
