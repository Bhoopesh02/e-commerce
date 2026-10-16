export interface FaqItem {
  id: string;
  category: 'bespoke-sizing' | 'shipping-delivery' | 'returns-exchanges' | 'garment-care' | 'payments-privilege';
  categoryLabel: string;
  question: string;
  answer: string;
  tags: string[];
}

export interface HelpGuide {
  id: string;
  category: string;
  title: string;
  readingTime: string;
  summary: string;
  steps: string[];
}

export const FAQ_CATEGORIES = [
  { id: 'all', label: 'All Questions' },
  { id: 'bespoke-sizing', label: 'Bespoke & Sizing' },
  { id: 'shipping-delivery', label: 'White-Glove Shipping' },
  { id: 'returns-exchanges', label: '7-Day Returns' },
  { id: 'garment-care', label: 'Garment Care & Archive' },
  { id: 'payments-privilege', label: 'Payments & Privilege' },
] as const;

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-01',
    category: 'bespoke-sizing',
    categoryLabel: 'Bespoke & Sizing',
    question: 'How does bespoke tailoring and private fitting work at Aurelia?',
    answer: 'Every bespoke silhouette begins with an atelier fitting consultation. Our master tailors accommodate up to 32 distinct anatomical posture measurements. We offer complimentary digital fit consultations via video link or in-person private salon appointments at our Bengaluru penthouse atelier.',
    tags: ['bespoke', 'tailoring', 'fitting', 'custom', 'measurements', 'salon', 'appointment'],
  },
  {
    id: 'faq-02',
    category: 'bespoke-sizing',
    categoryLabel: 'Bespoke & Sizing',
    question: 'What sizing standards does Aurelia use across its collections?',
    answer: 'Our silhouettes adhere to European luxury sizing (IT/FR 34–48, UK 6–20, US 2–16). Exact centimeter and inch measurements for chest, natural waist, sleeve length, shoulder span, and hem drape are cataloged under the "Size Guide" on every Product Detail Page.',
    tags: ['size', 'sizing', 'measurements', 'chart', 'guide', 'european'],
  },
  {
    id: 'faq-03',
    category: 'bespoke-sizing',
    categoryLabel: 'Bespoke & Sizing',
    question: 'Can I request custom adjustments or personalized initials embroidery?',
    answer: 'Yes. We offer bespoke hand-embroidered monograms on pure silk linings, interior pockets, and cuffs. Simply submit an inquiry via our Concierge Desk or contact your dedicated client stylist after placing your commission with your order reference number.',
    tags: ['monogram', 'embroidery', 'custom', 'adjustments', 'initials'],
  },
  {
    id: 'faq-04',
    category: 'bespoke-sizing',
    categoryLabel: 'Bespoke & Sizing',
    question: 'Can I request fabric swatches prior to acquiring a piece?',
    answer: 'Certainly. Registered patrons can request our complimentary Atelier Swatch Folio containing tactile samples of our Florentine double-faced wool, pure mulberry silk charmeuse, and Grade-A Mongolian cashmere.',
    tags: ['swatches', 'fabric', 'samples', 'wool', 'cashmere', 'silk'],
  },
  {
    id: 'faq-05',
    category: 'shipping-delivery',
    categoryLabel: 'White-Glove Shipping',
    question: 'What are your delivery timelines and courier procedures?',
    answer: 'Domestic shipments across India are packaged in our signature hard-shell presentation boxes and dispatched via climate-controlled courier within 24 to 48 hours. Metropolitan deliveries arrive within 2–3 business days. All packages require an authorized adult signature upon arrival.',
    tags: ['shipping', 'delivery', 'timelines', 'courier', 'white glove', 'speed'],
  },
  {
    id: 'faq-06',
    category: 'shipping-delivery',
    categoryLabel: 'White-Glove Shipping',
    question: 'Is shipping complimentary for all orders?',
    answer: 'Complimentary insured white-glove delivery is extended to all atelier orders across India, with zero minimum spend thresholds. International shipping is also complimentary for orders exceeding $500 equivalent.',
    tags: ['free shipping', 'complimentary', 'delivery charge', 'cost'],
  },
  {
    id: 'faq-07',
    category: 'shipping-delivery',
    categoryLabel: 'White-Glove Shipping',
    question: 'How do I monitor and track my commission once dispatched?',
    answer: 'Once your commission passes our final inspection seal, you receive real-time SMS and email notifications with your dedicated Waybill tracking code. You can also view live courier milestones anytime under Account > Orders > Track Order.',
    tags: ['tracking', 'courier', 'waybill', 'status', 'milestones'],
  },
  {
    id: 'faq-08',
    category: 'shipping-delivery',
    categoryLabel: 'White-Glove Shipping',
    question: 'Do you deliver internationally, and who handles customs duties?',
    answer: 'We deliver to over 45 countries worldwide via DHL Express. All international consignments are dispatched Delivered Duty Paid (DDP); local customs clearances and import duties are entirely covered by Aurelia with no supplementary fees upon arrival.',
    tags: ['international', 'customs', 'duties', 'worldwide', 'dhl', 'global'],
  },
  {
    id: 'faq-09',
    category: 'returns-exchanges',
    categoryLabel: '7-Day Returns',
    question: 'What is the Aurelia 7-day return and exchange policy?',
    answer: 'We extend a 7-calendar-day return and exchange window from the date of confirmed delivery. Garments must remain unworn, unaltered, and unwashed with all atelier tamper seals, fabric tags, and silk dust bags intact.',
    tags: ['returns', 'refund', 'exchange', 'policy', '7 days', 'seal'],
  },
  {
    id: 'faq-10',
    category: 'returns-exchanges',
    categoryLabel: '7-Day Returns',
    question: 'How is reverse courier pickup scheduled for returns?',
    answer: 'Simply visit Account > Orders, select your delivered order, and click "Request Return". Choose your preferred pickup date and convenient 2-hour window. Our reverse courier will arrive with pre-printed luxury return pouches.',
    tags: ['pickup', 'courier', 'reverse', 'schedule', 'appointment'],
  },
  {
    id: 'faq-11',
    category: 'returns-exchanges',
    categoryLabel: '7-Day Returns',
    question: 'How soon will my refund be processed and credited?',
    answer: 'Upon safe return to our atelier and inspection by our textile conservators (typically 24–48 hours), refunds are settled back to your original payment method (Credit Card, UPI, or Net Banking) within 3–5 business days.',
    tags: ['refund', 'settlement', 'timeline', 'money back', 'credit'],
  },
  {
    id: 'faq-12',
    category: 'returns-exchanges',
    categoryLabel: '7-Day Returns',
    question: 'Are bespoke or monogrammed pieces eligible for return?',
    answer: 'Due to their individualized fabrication, pieces with custom monograms or tailored anatomical alterations cannot be returned for monetary refund. However, our master tailors provide complimentary secondary fitting alterations until the silhouette sits impeccably.',
    tags: ['bespoke return', 'custom refund', 'alterations', 'monogram'],
  },
  {
    id: 'faq-13',
    category: 'garment-care',
    categoryLabel: 'Garment Care & Archive',
    question: 'How should I care for my mulberry silk and double-faced cashmere?',
    answer: 'Pure mulberry silk and double-faced cashmere should only be entrusted to specialists in eco-luxury dry cleaning. Never apply direct steam iron pressure to silk; use a cool pressing cloth or gentle vertical steaming. Store on contoured wooden hangers inside breathable cotton covers.',
    tags: ['care', 'silk', 'cashmere', 'dry cleaning', 'steaming', 'preservation'],
  },
  {
    id: 'faq-14',
    category: 'garment-care',
    categoryLabel: 'Garment Care & Archive',
    question: 'Do you offer garment repair or button replacement services?',
    answer: 'Yes. Every Aurelia creation includes complimentary lifetime archive care: replacement of lost horn or mother-of-pearl buttons, seam re-tacking, and lining stabilization. Contact the Concierge Desk to request an archive restoration pouch.',
    tags: ['repair', 'buttons', 'lifetime', 'restoration', 'alteration'],
  },
  {
    id: 'faq-15',
    category: 'payments-privilege',
    categoryLabel: 'Payments & Privilege',
    question: 'Which payment instruments and currencies are accepted?',
    answer: 'We support all major luxury cards (Visa, MasterCard, American Express, Diners Club) via encrypted Adyen tokenization, Instant UPI (Google Pay, PhonePe, Paytm), and Luxury Net Banking. All transactions are protected by 256-bit AES cryptographic standards.',
    tags: ['payment', 'adyen', 'upi', 'credit card', 'amex', 'security'],
  },
  {
    id: 'faq-16',
    category: 'payments-privilege',
    categoryLabel: 'Payments & Privilege',
    question: 'How do I access Private Ledger invitations and salon viewings?',
    answer: 'Clients who subscribe to The Private Ledger or complete a verified atelier commission receive private digital invitations to new seasonal collection releases 48 hours prior to public availability, as well as RSVP access to salon trunk shows.',
    tags: ['private ledger', 'vip', 'salon', 'privilege', 'invitation', 'trunk show'],
  },
];

export const HELP_GUIDES: HelpGuide[] = [
  {
    id: 'guide-sizing',
    category: 'Bespoke Sizing',
    title: 'The Atelier Measurement Protocol',
    readingTime: '3 min read',
    summary: 'A refined guide to taking your anatomical measurements accurately before ordering tailoring or bias-cut gowns.',
    steps: [
      'Use a flexible tailor measuring tape while wearing light undergarments.',
      'Bust/Chest: Measure around the fullest circumference, keeping the tape comfortably level across the shoulder blades.',
      'Natural Waist: Measure at the narrowest point of your torso, typically 2.5 cm above the navel.',
      'Lower Hip: Stand with heels together and measure around the widest point of the hip and glutes.',
      'Sleeve Length: Measure from the base of the neck, across the shoulder point, down to the wrist bone.',
    ],
  },
  {
    id: 'guide-returns',
    category: 'White-Glove Returns',
    title: 'The 7-Day Return & Courier Exchange Process',
    readingTime: '2 min read',
    summary: 'How to arrange seamless reverse courier collection from your residence without printing labels or leaving home.',
    steps: [
      'Locate your commission in your Private Client Account under "Orders".',
      'Click "Request Return" and select whether you prefer a size exchange or original payment settlement.',
      'Place the unworn garment in its protective silk garment cover and original hard-shell presentation box.',
      'Hand the parcel to our white-glove courier agent during your confirmed 2-hour appointment window.',
      'Track the return inspection and automatic bank refund via your account dashboard.',
    ],
  },
  {
    id: 'guide-preservation',
    category: 'Textile Conservation',
    title: 'Preserving Fine Silk, Wool & Cashmere',
    readingTime: '4 min read',
    summary: 'Atelier preservation techniques to ensure your heirloom silhouettes retain their fluid drape and tactile richness for decades.',
    steps: [
      'Air garments for 4–6 hours after wear before placing them back into the wardrobe.',
      'Never store fine cashmere or knitwear on hangers; fold with acid-free tissue paper on a cedar shelf.',
      'Use natural lavender or cedar sachets rather than chemical moth repellents.',
      'Address water spots or liquid droplets immediately by gently blotting with an undyed silk cloth — never rub.',
      'Entrust garments to accredited luxury dry cleaners who utilize hydrocarbon or liquid silicone solvents.',
    ],
  },
];
