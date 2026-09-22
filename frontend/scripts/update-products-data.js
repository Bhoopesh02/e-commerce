const fs = require('fs');
const path = require('path');

const existingProducts = require('../src/data/products.json');

const newProducts = [
  // Outerwear
  {
    id: "prod_out_003",
    slug: "cocoon-wool-duster-coat",
    name: "Cocoon Wool Duster Coat",
    subtitle: "Heavyweight Double-Weave Virgin Wool",
    description: "An oversized cocoon silhouette crafted from insulating double-weave virgin wool with dropped shoulders, minimalist welt pockets, and a clean notched collar.",
    details: [
      "100% pure virgin wool double-cloth",
      "Concealed horn button fastening with storm tab",
      "Generous cocoon drape with walking vent",
      "Handcrafted in Biella, Italy"
    ],
    materials: ["100% Virgin Wool", "Cupro Bemberg lining"],
    careGuide: ["Dry clean with eco-solvent only", "Store on broad cedar hanger"],
    categoryId: "cat_outerwear",
    price: 36499,
    compareAtPrice: 44000,
    images: [
      "/images/sections/products/outerwear/cocoon-wool-duster-coat-1.webp",
      "/images/sections/products/outerwear/cocoon-wool-duster-coat-2.webp"
    ],
    variants: [
      { sku: "CDC-OAT-S", size: "S", color: "Oatmeal Melange", stock: 3 },
      { sku: "CDC-OAT-M", size: "M", color: "Oatmeal Melange", stock: 4 },
      { sku: "CDC-OAT-L", size: "L", color: "Oatmeal Melange", stock: 2 }
    ],
    availability: "in_stock",
    rating: { average: 4.8, count: 26 },
    featured: true,
    isNewArrival: true,
    isTrending: true,
    tags: ["new-arrival", "outerwear", "wool", "coat"],
    storefronts: ["a", "b"]
  },
  {
    id: "prod_out_004",
    slug: "double-faced-wool-trench-coat",
    name: "Double-Faced Wool Trench Coat",
    subtitle: "Storm-Flap Belted Trench",
    description: "A reimagined architectural trench coat cut from unlined double-faced wool. Features sweeping raglan sleeves, storm gun-flaps, and an adjustable horn-buckle belt.",
    details: [
      "Water-repellent finished wool gabardine",
      "Hand-finished invisible perimeter stitching",
      "Detachable throat latch and storm yoke",
      "Horn buckle cinch belt with D-ring accents"
    ],
    materials: ["90% Virgin Wool, 10% Cashmere"],
    careGuide: ["Specialist dry clean only", "Steam press gently"],
    categoryId: "cat_outerwear",
    price: 39999,
    compareAtPrice: 48500,
    images: [
      "/images/sections/products/outerwear/double-faced-wool-trench-coat-1.webp",
      "/images/sections/products/outerwear/double-faced-wool-trench-coat-2.webp"
    ],
    variants: [
      { sku: "DWT-CAM-S", size: "S", color: "Classic Camel", stock: 2 },
      { sku: "DWT-CAM-M", size: "M", color: "Classic Camel", stock: 3 },
      { sku: "DWT-CAM-L", size: "L", color: "Classic Camel", stock: 1 }
    ],
    availability: "low_stock",
    rating: { average: 4.9, count: 18 },
    featured: true,
    isNewArrival: true,
    isTrending: false,
    tags: ["new-arrival", "outerwear", "trench", "signature"],
    storefronts: ["a", "b"]
  },
  {
    id: "prod_out_005",
    slug: "shearling-aviator-jacket",
    name: "Shearling Aviator Jacket",
    subtitle: "Tuscan Merino Shearling & Antiqued Leather",
    description: "Rugged elegance defined by thick Spanish merino shearling and hand-waxed distressed calfskin. Dual collar buckled straps and heavy palladium zips seal out arctic drafts.",
    details: [
      "100% genuine merino shearling fur interior",
      "Antiqued full-grain calfskin leather exterior",
      "Double buckle throat strap and waist adjustment tabs",
      "Chunky two-way palladium zipper hardware"
    ],
    materials: ["100% Merino Shearling Fur", "100% Calfskin Leather"],
    careGuide: ["Professional leather and shearling clean only", "Keep away from damp areas"],
    categoryId: "cat_outerwear",
    price: 46999,
    compareAtPrice: 56000,
    images: [
      "/images/sections/products/outerwear/shearling-aviator-jacket-1.webp",
      "/images/sections/products/outerwear/shearling-aviator-jacket-2.webp"
    ],
    variants: [
      { sku: "SHR-BRN-38", size: "38R", color: "Dark Espresso", stock: 1 },
      { sku: "SHR-BRN-40", size: "40R", color: "Dark Espresso", stock: 2 },
      { sku: "SHR-BRN-42", size: "42R", color: "Dark Espresso", stock: 1 }
    ],
    availability: "low_stock",
    rating: { average: 5.0, count: 21 },
    featured: false,
    isNewArrival: true,
    isTrending: true,
    tags: ["new-arrival", "outerwear", "shearling", "winter"],
    storefronts: ["a", "b"]
  },
  {
    id: "prod_out_006",
    slug: "storm-resistant-technical-parka",
    name: "Storm-Resistant Technical Parka",
    subtitle: "Italian 3-Layer Performance Membrane",
    description: "Architectural foul-weather protection rendered in a refined matte finish. Features taped ergonomic seams, a magnet-snap storm flap, and lightweight goose-down thermal quilting.",
    details: [
      "20,000mm hydrostatic head waterproof rating",
      "Breathable membrane bonded to Italian micro-twill",
      "90/10 RDS certified goose down fill (750 fill power)",
      "Concealed magnetic placket closures"
    ],
    materials: ["Performance Polyamide shell", "Goose down insulation"],
    careGuide: ["Gentle machine wash cold with technical wash", "Tumble dry low with dryer balls"],
    categoryId: "cat_outerwear",
    price: 32999,
    compareAtPrice: 39000,
    images: [
      "/images/sections/products/outerwear/storm-resistant-technical-parka-1.webp",
      "/images/sections/products/outerwear/storm-resistant-technical-parka-2.webp"
    ],
    variants: [
      { sku: "PRK-BLK-M", size: "M", color: "Stealth Black", stock: 5 },
      { sku: "PRK-BLK-L", size: "L", color: "Stealth Black", stock: 4 },
      { sku: "PRK-BLK-XL", size: "XL", color: "Stealth Black", stock: 2 }
    ],
    availability: "in_stock",
    rating: { average: 4.7, count: 19 },
    featured: false,
    isNewArrival: false,
    isTrending: true,
    tags: ["outerwear", "parka", "technical", "all-weather"],
    storefronts: ["a", "b"]
  },

  // Tailoring
  {
    id: "prod_tai_002",
    slug: "architectural-peplum-waistcoat",
    name: "Architectural Peplum Waistcoat",
    subtitle: "Sculpted Wool Barathea",
    description: "A modern structural vest with an angled asymmetrical hemline, internal boned bodice structure, and fabric-covered buttons.",
    details: [
      "Structured virgin wool barathea cloth",
      "Interior corset boning for tailored posture support",
      "Clean welt pockets and cinched rear adjuster",
      "Handmade pick-stitch finishing"
    ],
    materials: ["100% Wool Barathea", "100% Silk lining"],
    careGuide: ["Dry clean only", "Cool iron over damp press cloth"],
    categoryId: "cat_tailoring",
    price: 15499,
    compareAtPrice: 18999,
    images: [
      "/images/sections/products/tailoring/architectural-peplum-waistcoat-1.webp",
      "/images/sections/products/tailoring/architectural-peplum-waistcoat-2.webp"
    ],
    variants: [
      { sku: "WST-BLK-36", size: "36", color: "Onyx Black", stock: 4 },
      { sku: "WST-BLK-38", size: "38", color: "Onyx Black", stock: 5 },
      { sku: "WST-BLK-40", size: "40", color: "Onyx Black", stock: 2 }
    ],
    availability: "in_stock",
    rating: { average: 4.8, count: 14 },
    featured: false,
    isNewArrival: true,
    isTrending: false,
    tags: ["new-arrival", "tailoring", "waistcoat", "vest"],
    storefronts: ["a", "b"]
  },
  {
    id: "prod_tai_003",
    slug: "florentine-hourglass-tuxedo-jacket",
    name: "Florentine Hourglass Tuxedo Jacket",
    subtitle: "Silk Duchesse Peak Lapel",
    description: "An evening sartorial tour-de-force cut with high armholes, sweeping silk duchesse lapels, and a floating horsehair canvas chest piece.",
    details: [
      "Super 150s Australian merino wool",
      "Glossy silk duchesse facing on lapels and jetted pockets",
      "Hand-set natural horn button",
      "Florentine cut silhouette with sculpted waist"
    ],
    materials: ["90% Super 150s Wool, 10% Silk Duchesse"],
    careGuide: ["Specialist dry clean only", "Store with shoulder contour form"],
    categoryId: "cat_tailoring",
    price: 26999,
    compareAtPrice: 32000,
    images: [
      "/images/sections/products/tailoring/florentine-hourglass-tuxedo-jacket-1.webp",
      "/images/sections/products/tailoring/florentine-hourglass-tuxedo-jacket-2.webp"
    ],
    variants: [
      { sku: "TXJ-BLK-38", size: "38R", color: "Midnight Noir", stock: 3 },
      { sku: "TXJ-BLK-40", size: "40R", color: "Midnight Noir", stock: 3 },
      { sku: "TXJ-BLK-42", size: "42R", color: "Midnight Noir", stock: 1 }
    ],
    availability: "in_stock",
    rating: { average: 4.9, count: 22 },
    featured: true,
    isNewArrival: true,
    isTrending: true,
    tags: ["new-arrival", "tailoring", "tuxedo", "evening"],
    storefronts: ["a", "b"]
  },
  {
    id: "prod_tai_004",
    slug: "minimalist-crepe-collarless-blazer",
    name: "Minimalist Crepe Collarless Blazer",
    subtitle: "Fluid Japanese Wool Crepe",
    description: "A stripped-back clean jacket with zero exterior stitching, hidden magnetic front closure, and fluid drape that transitions effortlessly from day to night.",
    details: [
      "High-twist Japanese wool crepe with natural stretch",
      "Concealed front closure for clean monolithic look",
      "Minimalist welt pockets and unvented hem",
      "Fully lined in breathable cupro"
    ],
    materials: ["100% Japanese Wool Crepe", "100% Cupro lining"],
    careGuide: ["Dry clean only", "Hang immediately after wearing"],
    categoryId: "cat_tailoring",
    price: 19999,
    compareAtPrice: 24000,
    images: [
      "/images/sections/products/tailoring/minimalist-crepe-collarless-blazer-1.webp",
      "/images/sections/products/tailoring/minimalist-crepe-collarless-blazer-2.webp"
    ],
    variants: [
      { sku: "MCB-IVR-S", size: "S", color: "Ivory Ecru", stock: 2 },
      { sku: "MCB-IVR-M", size: "M", color: "Ivory Ecru", stock: 4 },
      { sku: "MCB-IVR-L", size: "L", color: "Ivory Ecru", stock: 1 }
    ],
    availability: "low_stock",
    rating: { average: 4.6, count: 17 },
    featured: false,
    isNewArrival: false,
    isTrending: false,
    tags: ["tailoring", "blazer", "minimalist", "crepe"],
    storefronts: ["a", "b"]
  },
  {
    id: "prod_tai_005",
    slug: "pinstripe-deconstructed-wool-suit",
    name: "Pinstripe Deconstructed Wool Suit",
    subtitle: "Milanese Chalk Pinstripe",
    description: "Lightweight deconstructed two-piece suiting made without heavy shoulder pads. Features subtle chalk striping and double reverse pleated trousers.",
    details: [
      "Super 130s Italian wool woven in Biella",
      "Deconstructed soft shoulder construction",
      "Double horn button single-breasted jacket",
      "Matching forward-pleated tailored trousers"
    ],
    materials: ["100% Super 130s Virgin Wool"],
    careGuide: ["Dry clean with eco-solvent", "Brush with horsehair garment brush"],
    categoryId: "cat_tailoring",
    price: 34999,
    compareAtPrice: 42000,
    images: [
      "/images/sections/products/tailoring/pinstripe-deconstructed-wool-suit-1.webp",
      "/images/sections/products/tailoring/pinstripe-deconstructed-wool-suit-2.webp"
    ],
    variants: [
      { sku: "PST-CHA-38", size: "38R", color: "Charcoal Pinstripe", stock: 3 },
      { sku: "PST-CHA-40", size: "40R", color: "Charcoal Pinstripe", stock: 4 },
      { sku: "PST-CHA-42", size: "42R", color: "Charcoal Pinstripe", stock: 2 }
    ],
    availability: "in_stock",
    rating: { average: 4.8, count: 20 },
    featured: true,
    isNewArrival: true,
    isTrending: true,
    tags: ["new-arrival", "tailoring", "suit", "pinstripe"],
    storefronts: ["a", "b"]
  },
  {
    id: "prod_tai_006",
    slug: "pleated-wide-leg-palazzo-trousers",
    name: "Pleated Wide-Leg Palazzo Trousers",
    subtitle: "High-Waisted Structured Trousers",
    description: "A theatrical wide-leg silhouette with deep knife pleats, extended tab waistband, and elegant floor puddle hemline.",
    details: [
      "Heavyweight fluid wool twill",
      "Double knife pleats down each leg crease",
      "Concealed tab waistband with internal waist grip",
      "Side slant pockets and rear jetted pocket"
    ],
    materials: ["100% Virgin Wool Twill"],
    careGuide: ["Dry clean only", "Press crease with damp cloth"],
    categoryId: "cat_tailoring",
    price: 14999,
    compareAtPrice: 18000,
    images: [
      "/images/sections/products/tailoring/pleated-wide-leg-palazzo-trousers-1.webp",
      "/images/sections/products/tailoring/pleated-wide-leg-palazzo-trousers-2.webp"
    ],
    variants: [
      { sku: "WLT-KHA-30", size: "30W", color: "Pale Khaki", stock: 5 },
      { sku: "WLT-KHA-32", size: "32W", color: "Pale Khaki", stock: 6 },
      { sku: "WLT-KHA-34", size: "34W", color: "Pale Khaki", stock: 3 }
    ],
    availability: "in_stock",
    rating: { average: 4.7, count: 29 },
    featured: false,
    isNewArrival: true,
    isTrending: true,
    tags: ["new-arrival", "tailoring", "trousers", "pleated"],
    storefronts: ["a", "b"]
  },

  // Eveningwear
  {
    id: "prod_eve_002",
    slug: "corseted-taffeta-gala-gown",
    name: "Corseted Taffeta Gala Gown",
    subtitle: "Structural Boned Bodice with Sweeping Skirt",
    description: "An opulent gala silhouette featuring an internal cupped corset bodice in rich silk taffeta that rustles delicately with every step.",
    details: [
      "100% Italian silk-blend taffeta",
      "Internal 12-bone structured bustier support",
      "Dramatic floor-length full circle volume",
      "Concealed back zipper with hand-stitched hook and eye"
    ],
    materials: ["65% Silk, 35% Polyester Taffeta"],
    careGuide: ["Specialist eveningwear dry clean only", "Store hanging inside protective garment bag"],
    categoryId: "cat_eveningwear",
    price: 48999,
    compareAtPrice: 58000,
    images: [
      "/images/sections/products/eveningwear/corseted-taffeta-gala-gown-1.webp",
      "/images/sections/products/eveningwear/corseted-taffeta-gala-gown-2.webp",
      "/images/sections/products/eveningwear/corseted-taffeta-gala-gown-3.webp"
    ],
    variants: [
      { sku: "COR-EMR-XS", size: "XS", color: "Emerald Forest", stock: 1 },
      { sku: "COR-EMR-S", size: "S", color: "Emerald Forest", stock: 2 },
      { sku: "COR-EMR-M", size: "M", color: "Emerald Forest", stock: 1 }
    ],
    availability: "low_stock",
    rating: { average: 4.9, count: 16 },
    featured: true,
    isNewArrival: true,
    isTrending: true,
    tags: ["new-arrival", "eveningwear", "gown", "gala"],
    storefronts: ["a", "b"]
  },
  {
    id: "prod_eve_003",
    slug: "midnight-velvet-column-dress",
    name: "Midnight Velvet Column Dress",
    subtitle: "Silk-Silk Velvet Column Silhouette",
    description: "Sumptuous silk velvet in deepest midnight hue, cut close to the body with an asymmetric mock neck and a daring thigh-high side walking slit.",
    details: [
      "Luminous silk-blend pile velvet",
      "Subtle stretch mesh foundation for sculpted fit",
      "High architectural mock collar",
      "Reinforced concealed side walking slit"
    ],
    materials: ["82% Rayon, 18% Silk Velvet"],
    careGuide: ["Dry clean only", "Steam from inside out to restore velvet pile"],
    categoryId: "cat_eveningwear",
    price: 34999,
    compareAtPrice: 41000,
    images: [
      "/images/sections/products/eveningwear/midnight-velvet-column-dress-1.webp",
      "/images/sections/products/eveningwear/midnight-velvet-column-dress-2.webp",
      "/images/sections/products/eveningwear/midnight-velvet-column-dress-3.webp"
    ],
    variants: [
      { sku: "VLV-MID-S", size: "S", color: "Midnight Abyss", stock: 3 },
      { sku: "VLV-MID-M", size: "M", color: "Midnight Abyss", stock: 4 },
      { sku: "VLV-MID-L", size: "L", color: "Midnight Abyss", stock: 2 }
    ],
    availability: "in_stock",
    rating: { average: 4.8, count: 23 },
    featured: false,
    isNewArrival: true,
    isTrending: true,
    tags: ["new-arrival", "eveningwear", "velvet", "column-dress"],
    storefronts: ["a", "b"]
  },
  {
    id: "prod_eve_004",
    slug: "nocturne-satin-bias-slip-gown",
    name: "Nocturne Satin Bias Slip Gown",
    subtitle: "Heavyweight Liquid Satin",
    description: "Effortless 90s minimalism re-engineered in heavyweight liquid satin. The bias cut hugs curves naturally without cling, terminating in a puddle hem.",
    details: [
      "Ultra-dense 280gsm silk-satin weave",
      "45-degree true bias cut for liquid drape",
      "Delicate rouleau spaghetti straps",
      "Low cowl back feature"
    ],
    materials: ["100% Silk Charmeuse"],
    careGuide: ["Delicate dry clean only", "Low steam only"],
    categoryId: "cat_eveningwear",
    price: 29999,
    compareAtPrice: 35000,
    images: [
      "/images/sections/products/eveningwear/nocturne-satin-bias-slip-gown-1.webp",
      "/images/sections/products/eveningwear/nocturne-satin-bias-slip-gown-2.webp"
    ],
    variants: [
      { sku: "SLP-BLK-XS", size: "XS", color: "Obsidian Noir", stock: 2 },
      { sku: "SLP-BLK-S", size: "S", color: "Obsidian Noir", stock: 4 },
      { sku: "SLP-BLK-M", size: "M", color: "Obsidian Noir", stock: 3 }
    ],
    availability: "in_stock",
    rating: { average: 4.9, count: 31 },
    featured: true,
    isNewArrival: false,
    isTrending: true,
    tags: ["eveningwear", "slip-dress", "satin", "bias-cut"],
    storefronts: ["a", "b"]
  },
  {
    id: "prod_eve_005",
    slug: "plisse-backless-halter-gown",
    name: "Plissé Backless Halter Gown",
    subtitle: "Micro-Accordion Pleated Chiffon",
    description: "Hundreds of microscopic sunray accordions create hypnotic motion with every turn. Finished with a halter tie and plunging open back.",
    details: [
      "Permanently heat-set micro-pleating",
      "Flowing multi-layered tiered hemline",
      "Adjustable silk halter collar tie",
      "Low back contour with invisible elastic stay"
    ],
    materials: ["100% High-Grade Japanese Chiffon"],
    careGuide: ["Do not iron or steam directly", "Specialist pleat clean"],
    categoryId: "cat_eveningwear",
    price: 37999,
    compareAtPrice: 44000,
    images: [
      "/images/sections/products/eveningwear/pliss-backless-halter-gown-1.webp",
      "/images/sections/products/eveningwear/pliss-backless-halter-gown-2.webp"
    ],
    variants: [
      { sku: "PLS-BRN-S", size: "S", color: "Terracotta Bronze", stock: 3 },
      { sku: "PLS-BRN-M", size: "M", color: "Terracotta Bronze", stock: 2 }
    ],
    availability: "low_stock",
    rating: { average: 4.8, count: 18 },
    featured: false,
    isNewArrival: true,
    isTrending: false,
    tags: ["new-arrival", "eveningwear", "pleated", "halter"],
    storefronts: ["a", "b"]
  },
  {
    id: "prod_eve_006",
    slug: "tiered-chiffon-cape-dress",
    name: "Tiered Chiffon Cape Dress",
    subtitle: "Ethereal Dual-Layer Capelet",
    description: "An ethereal silhouette crowned with a cascading capelet over a slim inner slip. Semi-sheer diaphanous chiffon radiates understated nobility.",
    details: [
      "Ultralight 8-momme mulberry silk chiffon",
      "Detachable flowing back capelet",
      "Double lined body for modesty",
      "Hand-rolled baby hems"
    ],
    materials: ["100% Silk Chiffon body & lining"],
    careGuide: ["Gentle dry clean only", "Store folded in acid-free tissue"],
    categoryId: "cat_eveningwear",
    price: 41999,
    compareAtPrice: 49000,
    images: [
      "/images/sections/products/eveningwear/tiered-chiffon-cape-dress-1.webp",
      "/images/sections/products/eveningwear/tiered-chiffon-cape-dress-2.webp",
      "/images/sections/products/eveningwear/tiered-chiffon-cape-dress-3.webp"
    ],
    variants: [
      { sku: "CAP-WHT-S", size: "S", color: "Porcelain Alabaster", stock: 2 },
      { sku: "CAP-WHT-M", size: "M", color: "Porcelain Alabaster", stock: 3 }
    ],
    availability: "in_stock",
    rating: { average: 5.0, count: 12 },
    featured: true,
    isNewArrival: true,
    isTrending: false,
    tags: ["new-arrival", "eveningwear", "cape", "chiffon"],
    storefronts: ["a", "b"]
  },

  // Knitwear
  {
    id: "prod_knt_002",
    slug: "alpaca-ribbed-polo-pullover",
    name: "Alpaca Ribbed Polo Pullover",
    subtitle: "Peruvian Baby Alpaca Johnny Collar",
    description: "Spun from superfine Peruvian baby alpaca fleece for remarkable warmth with half the weight of traditional wool. Finished with an open johnny collar.",
    details: [
      "100% royal baby alpaca fibers",
      "Seamless knitted open polo collar",
      "Ribbed cuffs and hem with shape-recovery elastic",
      "Hypoallergenic and lanolin-free"
    ],
    materials: ["100% Baby Alpaca"],
    careGuide: ["Hand wash in tepid water with wool detergent", "Dry flat"],
    categoryId: "cat_knitwear",
    price: 16999,
    compareAtPrice: 21000,
    images: [
      "/images/sections/products/knitwear/alpaca-ribbed-polo-pullover-1.webp",
      "/images/sections/products/knitwear/alpaca-ribbed-polo-pullover-2.webp"
    ],
    variants: [
      { sku: "ALP-CRM-S", size: "S", color: "Oat Milk", stock: 4 },
      { sku: "ALP-CRM-M", size: "M", color: "Oat Milk", stock: 5 },
      { sku: "ALP-CRM-L", size: "L", color: "Oat Milk", stock: 3 }
    ],
    availability: "in_stock",
    rating: { average: 4.9, count: 28 },
    featured: false,
    isNewArrival: true,
    isTrending: true,
    tags: ["new-arrival", "knitwear", "alpaca", "polo"],
    storefronts: ["a", "b"]
  },
  {
    id: "prod_knt_003",
    slug: "brushed-mohair-v-neck-jumper",
    name: "Brushed Mohair V-Neck Jumper",
    subtitle: "South African Kid Mohair Cloud Knit",
    description: "Cloud-like halo texture knit from featherweight kid mohair and silk. An easy dropped shoulder V-neck that layers effortlessly over collared shirts.",
    details: [
      "70% Kid Mohair, 30% Mulberry Silk core",
      "Hand-brushed surface for maximum loft",
      "Relaxed ribbed V-neckline",
      "Knitted in Tuscany on manual flatbed frames"
    ],
    materials: ["70% Kid Mohair, 30% Silk"],
    careGuide: ["Gently hand wash cold", "Comb gently with mohair brush"],
    categoryId: "cat_knitwear",
    price: 18499,
    compareAtPrice: 22500,
    images: [
      "/images/sections/products/knitwear/brushed-mohair-v-neck-jumper-1.webp",
      "/images/sections/products/knitwear/brushed-mohair-v-neck-jumper-2.webp"
    ],
    variants: [
      { sku: "MHR-MNT-S", size: "S", color: "Sage Frost", stock: 3 },
      { sku: "MHR-MNT-M", size: "M", color: "Sage Frost", stock: 4 },
      { sku: "MHR-MNT-L", size: "L", color: "Sage Frost", stock: 2 }
    ],
    availability: "in_stock",
    rating: { average: 4.8, count: 35 },
    featured: true,
    isNewArrival: true,
    isTrending: true,
    tags: ["new-arrival", "knitwear", "mohair", "sweater"],
    storefronts: ["a", "b"]
  },
  {
    id: "prod_knt_004",
    slug: "chunky-cable-knit-merino-cardigan",
    name: "Chunky Cable-Knit Merino Cardigan",
    subtitle: "Heavyweight 5-Gauge Aran Stitch",
    description: "A substantial heritage cardigan featuring intricate traditional rope cables, genuine horn buttons, and twin front hand-warmer pockets.",
    details: [
      "100% extrafine Australian merino wool (19.5 micron)",
      "Heavy 5-gauge cable knit structure",
      "Natural unbleached horn buttons",
      "Ribbed collar, placket, and hem"
    ],
    materials: ["100% Extrafine Merino Wool"],
    careGuide: ["Hand wash cold only", "Dry flat on mesh"],
    categoryId: "cat_knitwear",
    price: 21999,
    compareAtPrice: 26000,
    images: [
      "/images/sections/products/knitwear/chunky-cable-knit-merino-cardigan-1.webp",
      "/images/sections/products/knitwear/chunky-cable-knit-merino-cardigan-2.webp"
    ],
    variants: [
      { sku: "CBL-ECR-M", size: "M", color: "Raw Ecru", stock: 4 },
      { sku: "CBL-ECR-L", size: "L", color: "Raw Ecru", stock: 3 },
      { sku: "CBL-ECR-XL", size: "XL", color: "Raw Ecru", stock: 2 }
    ],
    availability: "in_stock",
    rating: { average: 4.9, count: 42 },
    featured: false,
    isNewArrival: false,
    isTrending: true,
    tags: ["knitwear", "cardigan", "merino", "cable-knit"],
    storefronts: ["a", "b"]
  },
  {
    id: "prod_knt_005",
    slug: "open-back-cashmere-wrap-knit",
    name: "Open-Back Cashmere Wrap Knit",
    subtitle: "Draped Ballet Back in Pure Cashmere",
    description: "Feminine allure meets supreme comfort. A boatneck sweater at the front that dips into a deep twisted crossover wrap at the rear.",
    details: [
      "Grade-A Mongolian 2-ply cashmere",
      "Reversible styling (wear wrap in front or back)",
      "Elongated ribbed cuffs for arm hugging warmth",
      "Hand-finished interior seams"
    ],
    materials: ["100% Grade-A Cashmere"],
    careGuide: ["Specialist cashmere wash", "Store folded with cedar blocks"],
    categoryId: "cat_knitwear",
    price: 19499,
    compareAtPrice: 23500,
    images: [
      "/images/sections/products/knitwear/open-back-cashmere-wrap-knit-1.webp",
      "/images/sections/products/knitwear/open-back-cashmere-wrap-knit-2.webp",
      "/images/sections/products/knitwear/open-back-cashmere-wrap-knit-3.webp"
    ],
    variants: [
      { sku: "WRK-TOU-S", size: "S", color: "Taupe Camel", stock: 2 },
      { sku: "WRK-TOU-M", size: "M", color: "Taupe Camel", stock: 3 }
    ],
    availability: "low_stock",
    rating: { average: 4.7, count: 19 },
    featured: true,
    isNewArrival: true,
    isTrending: false,
    tags: ["new-arrival", "knitwear", "cashmere", "wrap"],
    storefronts: ["a", "b"]
  },
  {
    id: "prod_knt_006",
    slug: "seamless-fine-gauge-cashmere-crew",
    name: "Seamless Fine-Gauge Cashmere Crew",
    subtitle: "18-Gauge Silk-Cashmere Essential",
    description: "An ultra-thin, featherlight crewneck spun on 18-gauge Japanese circular knitting machines for a frictionless, body-skimming second skin feel.",
    details: [
      "70% Cashmere, 30% Silk blend",
      "Seamless WholeGarment 3D knit construction",
      "Self-start fine ribbed collar and hem",
      "Ideal under tailored jackets or over t-shirts"
    ],
    materials: ["70% Cashmere, 30% Mulberry Silk"],
    careGuide: ["Hand wash in cool water", "Reshape while damp and dry flat"],
    categoryId: "cat_knitwear",
    price: 13999,
    compareAtPrice: 17000,
    images: [
      "/images/sections/products/knitwear/seamless-fine-gauge-cashmere-crew-1.webp",
      "/images/sections/products/knitwear/seamless-fine-gauge-cashmere-crew-2.webp"
    ],
    variants: [
      { sku: "CRW-VIC-S", size: "S", color: "Vicuna Amber", stock: 6 },
      { sku: "CRW-VIC-M", size: "M", color: "Vicuna Amber", stock: 7 },
      { sku: "CRW-VIC-L", size: "L", color: "Vicuna Amber", stock: 4 }
    ],
    availability: "in_stock",
    rating: { average: 4.8, count: 50 },
    featured: false,
    isNewArrival: false,
    isTrending: true,
    tags: ["knitwear", "cashmere", "crewneck", "essential"],
    storefronts: ["a", "b"]
  },

  // Leather Goods
  {
    id: "prod_lea_002",
    slug: "curve-calfskin-crossbody-saddle-bag",
    name: "Curve Calfskin Crossbody Saddle Bag",
    subtitle: "Sculptural Half-Moon Silhouette",
    description: "A curvilinear saddle silhouette sculpted from semi-vegetable tanned French calfskin with polished solid brass hardware and an adjustable strap.",
    details: [
      "Full-grain French calfskin leather",
      "Custom gold-tone magnetic bridge closure",
      "Microfiber bonded suede interior lining",
      "Adjustable strap for shoulder or crossbody carry"
    ],
    materials: ["100% Calfskin Leather", "Solid Brass Hardware"],
    careGuide: ["Condition with neutral leather balm every 6 months"],
    categoryId: "cat_leather_goods",
    price: 22499,
    compareAtPrice: 27000,
    images: [
      "/images/sections/products/leather-goods/curve-calfskin-crossbody-saddle-bag-1.webp",
      "/images/sections/products/leather-goods/curve-calfskin-crossbody-saddle-bag-2.webp"
    ],
    variants: [
      { sku: "SDL-TAN-ONE", size: "One Size", color: "Caramel Tan", stock: 4 },
      { sku: "SDL-BLK-ONE", size: "One Size", color: "Nocturne Black", stock: 3 }
    ],
    availability: "in_stock",
    rating: { average: 4.9, count: 33 },
    featured: true,
    isNewArrival: true,
    isTrending: true,
    tags: ["new-arrival", "leather-goods", "bag", "crossbody"],
    storefronts: ["a", "b"]
  },
  {
    id: "prod_lea_003",
    slug: "florentine-flap-briefcase",
    name: "Florentine Flap Briefcase",
    subtitle: "Vegetable-Tanned Cuoio Leather",
    description: "Handcrafted in Florence by third-generation leather artisans. Features dual brass combination locks, structured gusseted compartments, and padded laptop sleeve.",
    details: [
      "Vachetta vegetable-tanned Italian leather that develops rich patina",
      "Dual push-lock solid brass buckles with key clasp",
      "Internal divider accommodates 15-inch MacBook Pro",
      "Reinforced top handle with hand-stitched bar tacks"
    ],
    materials: ["100% Tuscan Vegetable-Tanned Cowhide"],
    careGuide: ["Treat with beeswax leather cream", "Avoid prolonged exposure to heavy rain"],
    categoryId: "cat_leather_goods",
    price: 36999,
    compareAtPrice: 44000,
    images: [
      "/images/sections/products/leather-goods/florentine-flap-briefcase-1.webp",
      "/images/sections/products/leather-goods/florentine-flap-briefcase-2.webp"
    ],
    variants: [
      { sku: "BRF-BRN-ONE", size: "One Size", color: "Antique Havana", stock: 2 }
    ],
    availability: "low_stock",
    rating: { average: 5.0, count: 18 },
    featured: false,
    isNewArrival: true,
    isTrending: false,
    tags: ["new-arrival", "leather-goods", "briefcase", "artisan"],
    storefronts: ["a", "b"]
  },
  {
    id: "prod_lea_004",
    slug: "grained-leather-folded-clutch",
    name: "Grained Leather Folded Clutch",
    subtitle: "Pebbled Nappa Evening Pouch",
    description: "Soft tactile luxury defined by pillowy gathered nappa leather. Features a magnetic top frame closure and detachable fine serpentine chain.",
    details: [
      "Ultra-supple milled calf nappa",
      "Concealed magnetic snap-frame closure",
      "Includes detachable 18k gold-plated snake chain",
      "Internal card slot lined in suede"
    ],
    materials: ["100% Grained Nappa Leather"],
    careGuide: ["Wipe clean with microfiber cloth"],
    categoryId: "cat_leather_goods",
    price: 18999,
    compareAtPrice: 22000,
    images: [
      "/images/sections/products/leather-goods/grained-leather-folded-clutch-1.webp",
      "/images/sections/products/leather-goods/grained-leather-folded-clutch-2.webp"
    ],
    variants: [
      { sku: "CLU-IVR-ONE", size: "One Size", color: "Cream Ecru", stock: 5 },
      { sku: "CLU-BLK-ONE", size: "One Size", color: "Raven Black", stock: 4 }
    ],
    availability: "in_stock",
    rating: { average: 4.8, count: 25 },
    featured: false,
    isNewArrival: false,
    isTrending: true,
    tags: ["leather-goods", "clutch", "pouch", "evening"],
    storefronts: ["a", "b"]
  },
  {
    id: "prod_lea_005",
    slug: "pebbled-leather-weekend-duffle",
    name: "Pebbled Leather Weekend Duffle",
    subtitle: "48-Hour Heritage Travel Bag",
    description: "Engineered for spontaneous weekend getaways. Generously proportioned in scratch-resistant pebbled cowhide with solid metal base studs and removable luggage tag.",
    details: [
      "Scratch-resistant pebbled drummed leather",
      "Heavy duty two-way Excella metal zippers",
      "Detachable padded leather shoulder strap",
      "Complies with all international airline cabin carry-on regulations"
    ],
    materials: ["100% Full-Grain Drummed Leather", "Cotton Canvas lining"],
    careGuide: ["Condition with neutral leather wax annually"],
    categoryId: "cat_leather_goods",
    price: 38999,
    compareAtPrice: 46000,
    images: [
      "/images/sections/products/leather-goods/pebbled-leather-weekend-duffle-1.webp",
      "/images/sections/products/leather-goods/pebbled-leather-weekend-duffle-2.webp"
    ],
    variants: [
      { sku: "DUF-BLK-ONE", size: "One Size", color: "Midnight Black", stock: 3 },
      { sku: "DUF-COGNAC-ONE", size: "One Size", color: "Cognac Amber", stock: 2 }
    ],
    availability: "in_stock",
    rating: { average: 4.9, count: 39 },
    featured: true,
    isNewArrival: true,
    isTrending: true,
    tags: ["new-arrival", "leather-goods", "duffle", "travel"],
    storefronts: ["a", "b"]
  },
  {
    id: "prod_lea_006",
    slug: "structured-baguette-shoulder-bag",
    name: "Structured Baguette Shoulder Bag",
    subtitle: "Mirror-Gloss Box Calfskin",
    description: "An elongated 90s silhouette reborn with architectural precision. Features an ergonomic under-arm curve and hand-lacquered raw edge finish.",
    details: [
      "High-gloss glazed box calf leather",
      "Integrated comfortable shoulder arch strap",
      "Solid brass tab push lock with Aurelia crest",
      "Internal zip pocket and mirror slip"
    ],
    materials: ["100% Glazed Box Calf"],
    careGuide: ["Buff gently with flannel polishing cloth"],
    categoryId: "cat_leather_goods",
    price: 24999,
    compareAtPrice: 29500,
    images: [
      "/images/sections/products/leather-goods/structured-baguette-shoulder-bag-1.webp",
      "/images/sections/products/leather-goods/structured-baguette-shoulder-bag-2.webp"
    ],
    variants: [
      { sku: "BAG-BUR-ONE", size: "One Size", color: "Deep Burgundy", stock: 3 },
      { sku: "BAG-BLK-ONE", size: "One Size", color: "Pitch Black", stock: 4 }
    ],
    availability: "in_stock",
    rating: { average: 4.8, count: 27 },
    featured: false,
    isNewArrival: false,
    isTrending: true,
    tags: ["leather-goods", "baguette", "shoulder-bag"],
    storefronts: ["a", "b"]
  },

  // Footwear
  {
    id: "prod_ftw_002",
    slug: "goodyear-welted-oxford-brogues",
    name: "Goodyear Welted Oxford Brogues",
    subtitle: "Burnished Espresso Calfskin",
    description: "Classic British sartorialism crafted with Italian finesse. Intricate wingtip medallion broguing on antiqued French calfskin with a Goodyear storm welt.",
    details: [
      "Hand-burnished full-grain French calfskin",
      "Goodyear welted 360-degree storm welt",
      "Oak bark tanned leather outsoles from J&FJ Baker",
      "Capped toe with bespoke floral medallion perforations"
    ],
    materials: ["100% Calfskin Leather", "Oak-Bark Tanned Leather Sole"],
    careGuide: ["Polish with carnauba shoe wax", "Always use cedar shoe trees"],
    categoryId: "cat_footwear",
    price: 27999,
    compareAtPrice: 33000,
    images: [
      "/images/sections/products/footwear/goodyear-welted-oxford-brogues-1.webp"
    ],
    variants: [
      { sku: "OXF-ESP-41", size: "EU 41", color: "Espresso Patina", stock: 3 },
      { sku: "OXF-ESP-42", size: "EU 42", color: "Espresso Patina", stock: 4 },
      { sku: "OXF-ESP-43", size: "EU 43", color: "Espresso Patina", stock: 2 }
    ],
    availability: "in_stock",
    rating: { average: 4.9, count: 31 },
    featured: true,
    isNewArrival: true,
    isTrending: true,
    tags: ["new-arrival", "footwear", "oxford", "brogues"],
    storefronts: ["a", "b"]
  },
  {
    id: "prod_ftw_003",
    slug: "italian-calfskin-derby-shoes",
    name: "Italian Calfskin Derby Shoes",
    subtitle: "Blake-Stitched Hand-Polished Derby",
    description: "Clean open-lacing Derby silhouette tailored for both casual tailoring and formal events. Features Vibram half-rubber injected soles for all-weather traction.",
    details: [
      "Smooth mirror-finish box calfskin",
      "Blake-stitch construction for maximum flexibility from day one",
      "Blind eyelets with waxed cotton laces",
      "Antibacterial calfskin arch support footbed"
    ],
    materials: ["100% Italian Box Calfskin", "Leather & Vibram Hybrid Sole"],
    careGuide: ["Apply cream polish monthly", "Insert shoe trees immediately after wear"],
    categoryId: "cat_footwear",
    price: 23999,
    compareAtPrice: 28500,
    images: [
      "/images/sections/products/footwear/italian-calfskin-derby-shoes-1.webp",
      "/images/sections/products/footwear/italian-calfskin-derby-shoes-2.webp"
    ],
    variants: [
      { sku: "DRB-BLK-41", size: "EU 41", color: "Polished Black", stock: 4 },
      { sku: "DRB-BLK-42", size: "EU 42", color: "Polished Black", stock: 5 },
      { sku: "DRB-BLK-43", size: "EU 43", color: "Polished Black", stock: 3 }
    ],
    availability: "in_stock",
    rating: { average: 4.8, count: 24 },
    featured: false,
    isNewArrival: true,
    isTrending: false,
    tags: ["new-arrival", "footwear", "derby", "shoes"],
    storefronts: ["a", "b"]
  },
  {
    id: "prod_ftw_004",
    slug: "minimalist-architectural-leather-loafers",
    name: "Minimalist Architectural Leather Loafers",
    subtitle: "Chiseled Apron Penny Loafer",
    description: "An architectural penny loafer stripped of superfluous ornamentation. Sculpted square toe and low stacked heel create a sharp contemporary profile.",
    details: [
      "Glazed Italian calf leather",
      "Hand-stitched chiseled moccasin toe seam",
      "Channel-stitched leather sole with beveled waist",
      "Cushioned memory foam insole lined in kidskin"
    ],
    materials: ["100% Glazed Calfskin", "Vegetable-tanned leather sole"],
    careGuide: ["Buff with horsehair brush", "Condition regularly"],
    categoryId: "cat_footwear",
    price: 21499,
    compareAtPrice: 25500,
    images: [
      "/images/sections/products/footwear/minimalist-architectural-leather-loafers-1.webp"
    ],
    variants: [
      { sku: "LOA-BLK-41", size: "EU 41", color: "Onyx Black", stock: 4 },
      { sku: "LOA-BLK-42", size: "EU 42", color: "Onyx Black", stock: 6 },
      { sku: "LOA-BLK-43", size: "EU 43", color: "Onyx Black", stock: 2 }
    ],
    availability: "in_stock",
    rating: { average: 4.7, count: 38 },
    featured: true,
    isNewArrival: false,
    isTrending: true,
    tags: ["footwear", "loafers", "minimalist", "classic"],
    storefronts: ["a", "b"]
  },
  {
    id: "prod_ftw_005",
    slug: "pointed-knee-high-suede-boots",
    name: "Pointed Knee-High Suede Boots",
    subtitle: "Silky Suede Sculpted Heel Boot",
    description: "A commanding knee-high boot sculpted from velvety water-resistant suede. Finished with a sharp pointed toe and architectural curved kitten heel.",
    details: [
      "Water-repellent finished Italian calf suede",
      "Sculpted 65mm architectural flared heel",
      "Full internal side zipper for effortless on-off",
      "Leather sole with embedded rubber non-slip tread"
    ],
    materials: ["100% Italian Calf Suede", "Kidskin lining"],
    careGuide: ["Brush with soft suede crepe brush", "Treat with protector spray"],
    categoryId: "cat_footwear",
    price: 34999,
    compareAtPrice: 42000,
    images: [
      "/images/sections/products/footwear/pointed-knee-high-suede-boots-1.webp"
    ],
    variants: [
      { sku: "SUD-ESP-38", size: "EU 38", color: "Deep Chocolate", stock: 2 },
      { sku: "SUD-ESP-39", size: "EU 39", color: "Deep Chocolate", stock: 3 },
      { sku: "SUD-ESP-40", size: "EU 40", color: "Deep Chocolate", stock: 1 }
    ],
    availability: "low_stock",
    rating: { average: 4.9, count: 17 },
    featured: false,
    isNewArrival: true,
    isTrending: true,
    tags: ["new-arrival", "footwear", "boots", "suede"],
    storefronts: ["a", "b"]
  },
  {
    id: "prod_ftw_006",
    slug: "sculptural-block-heel-mules",
    name: "Sculptural Block-Heel Mules",
    subtitle: "Tuscan Leather Architectural Slide",
    description: "An open-back silhouette grounded on an angled trapezoidal block heel. Padded wide vamp strap hugs foot securely for all-day runway wear.",
    details: [
      "Smooth vegetable-tanned nappa upper",
      "Geometric 50mm wooden block heel wrapped in leather",
      "Square-toe silhouette with cushioned footbed",
      "Slip-on ease with hidden elastic gusset"
    ],
    materials: ["100% Nappa Leather"],
    careGuide: ["Wipe clean with dry cloth"],
    categoryId: "cat_footwear",
    price: 17999,
    compareAtPrice: 21500,
    images: [
      "/images/sections/products/footwear/sculptural-block-heel-mules-1.webp"
    ],
    variants: [
      { sku: "MUL-IVO-38", size: "EU 38", color: "Warm Ivory", stock: 4 },
      { sku: "MUL-IVO-39", size: "EU 39", color: "Warm Ivory", stock: 5 }
    ],
    availability: "in_stock",
    rating: { average: 4.8, count: 22 },
    featured: false,
    isNewArrival: false,
    isTrending: true,
    tags: ["footwear", "mules", "slides", "sculptural"],
    storefronts: ["a", "b"]
  },

  // Fine Jewelry
  {
    id: "prod_jwl_002",
    slug: "baroque-freshwater-pearl-pendant",
    name: "Baroque Freshwater Pearl Pendant",
    subtitle: "Organic Pearl on 18k Vermeil Chain",
    description: "An organic one-of-a-kind baroque freshwater pearl hand-picked for iridescent fire, suspended from an adjustable 18k gold vermeil paperclip link chain.",
    details: [
      "AAA-grade natural baroque freshwater pearl (approx. 20mm)",
      "Base of 925 sterling silver coated in 3-micron 18k yellow gold",
      "Handcrafted toggle clasp with safety closure",
      "Adjustable chain length: 18 to 20 inches"
    ],
    materials: ["Natural Baroque Pearl", "18k Gold Vermeil on 925 Silver"],
    careGuide: ["Apply cosmetics and perfume before wearing pearls", "Clean with damp soft chamois"],
    categoryId: "cat_jewelry",
    price: 13499,
    compareAtPrice: 16500,
    images: [
      "/images/sections/products/fine-jewelry/baroque-freshwater-pearl-pendant-1.webp"
    ],
    variants: [
      { sku: "PRL-PEN-GLD", size: "Standard", color: "18k Gold / White Pearl", stock: 5 }
    ],
    availability: "in_stock",
    rating: { average: 4.9, count: 29 },
    featured: true,
    isNewArrival: true,
    isTrending: true,
    tags: ["new-arrival", "jewelry", "pearls", "necklace"],
    storefronts: ["a", "b"]
  },
  {
    id: "prod_jwl_003",
    slug: "diamond-pave-solitaire-bangle",
    name: "Diamond Pave Solitaire Bangle",
    subtitle: "Lab-Grown Diamond Accents on Solid Vermeil",
    description: "A minimalist hinged oval bangle punctuated with a row of hand-set pavé diamonds that capture and reflect ambient candlelight.",
    details: [
      "0.35ct total weight VS1 clarity lab-grown diamonds",
      "3-micron 18k yellow gold vermeil over recycled silver",
      "Concealed hinge and double-lock safety catch",
      "Ergonomic oval contour matches wrist anatomy"
    ],
    materials: ["18k Gold Vermeil", "VS1 Lab-Grown Diamonds"],
    careGuide: ["Avoid chlorine and saltwater", "Store in plush jewelry pouch"],
    categoryId: "cat_jewelry",
    price: 24999,
    compareAtPrice: 31000,
    images: [
      "/images/sections/products/fine-jewelry/diamond-pave-solitaire-bangle-1.webp"
    ],
    variants: [
      { sku: "DIA-BNG-SM", size: "Small/Medium", color: "18k Gold", stock: 3 },
      { sku: "DIA-BNG-MD", size: "Medium/Large", color: "18k Gold", stock: 3 }
    ],
    availability: "in_stock",
    rating: { average: 5.0, count: 18 },
    featured: true,
    isNewArrival: true,
    isTrending: false,
    tags: ["new-arrival", "jewelry", "diamonds", "bangle"],
    storefronts: ["a", "b"]
  },
  {
    id: "prod_jwl_004",
    slug: "herringbone-heavy-chain-necklace",
    name: "Herringbone Heavy Chain Necklace",
    subtitle: "Liquid Gold Flat Mesh Choker",
    description: "Silky flat-woven links form a fluid band of liquid light around the collarbone. Completely smooth against skin with a high mirror polish.",
    details: [
      "6mm width flexible herringbone weave",
      "Recycled 925 sterling silver with thick 18k yellow gold plating",
      "Engineered anti-kink reinforced internal links",
      "Custom low-profile lobster claw clasp"
    ],
    materials: ["18k Gold Vermeil over 925 Silver"],
    careGuide: ["Store flat inside jewelry case to avoid bending links"],
    categoryId: "cat_jewelry",
    price: 16999,
    compareAtPrice: 20500,
    images: [
      "/images/sections/products/fine-jewelry/herringbone-heavy-chain-necklace-1.webp"
    ],
    variants: [
      { sku: "HRB-CHN-16", size: "16-Inch", color: "18k Gold", stock: 4 },
      { sku: "HRB-CHN-18", size: "18-Inch", color: "18k Gold", stock: 4 }
    ],
    availability: "in_stock",
    rating: { average: 4.8, count: 41 },
    featured: false,
    isNewArrival: false,
    isTrending: true,
    tags: ["jewelry", "chain", "necklace", "gold"],
    storefronts: ["a", "b"]
  },
  {
    id: "prod_jwl_005",
    slug: "molten-gold-drop-earrings",
    name: "Molten Gold Drop Earrings",
    subtitle: "Organic Form Statement Earrings",
    description: "Inspired by molten droplets of liquid gold cooling in seawater. Lightweight hollow construction allows all-day comfort without pulling on earlobes.",
    details: [
      "Hand-carved organic texture with mirror-polished facets",
      "Ultralight electroformed hollow center",
      "Hypoallergenic 14k solid gold posts and butterfly backs",
      "Approx. 35mm drop length"
    ],
    materials: ["18k Gold Vermeil", "14k Solid Gold Posts"],
    careGuide: ["Clean with gold polishing cloth"],
    categoryId: "cat_jewelry",
    price: 11499,
    compareAtPrice: 14000,
    images: [
      "/images/sections/products/fine-jewelry/molten-gold-drop-earrings-1.webp"
    ],
    variants: [
      { sku: "MLT-EAR-GLD", size: "Standard", color: "18k Gold", stock: 6 }
    ],
    availability: "in_stock",
    rating: { average: 4.9, count: 37 },
    featured: true,
    isNewArrival: true,
    isTrending: true,
    tags: ["new-arrival", "jewelry", "earrings", "statement"],
    storefronts: ["a", "b"]
  },
  {
    id: "prod_jwl_006",
    slug: "sculptural-dome-signet-ring",
    name: "Sculptural Dome Signet Ring",
    subtitle: "Chunky 18k Gold Vermeil Dome",
    description: "A bold minimalist statement ring with a smooth convex dome face and comfortable tapered comfort-fit interior shank.",
    details: [
      "Substantial solid weight with mirror polished crown",
      "3-micron 18k gold vermeil on recycled sterling silver base",
      "Ergonomic tapered band for pinch-free finger movement",
      "Engravable flat crown surface"
    ],
    materials: ["18k Gold Vermeil on 925 Sterling Silver"],
    careGuide: ["Remove prior to heavy lifting or water exposure"],
    categoryId: "cat_jewelry",
    price: 9999,
    compareAtPrice: 12500,
    images: [
      "/images/sections/products/fine-jewelry/sculptural-dome-signet-ring-1.webp"
    ],
    variants: [
      { sku: "DOM-RNG-6", size: "US 6", color: "18k Gold", stock: 3 },
      { sku: "DOM-RNG-7", size: "US 7", color: "18k Gold", stock: 5 },
      { sku: "DOM-RNG-8", size: "US 8", color: "18k Gold", stock: 4 }
    ],
    availability: "in_stock",
    rating: { average: 4.7, count: 26 },
    featured: false,
    isNewArrival: false,
    isTrending: true,
    tags: ["jewelry", "ring", "dome", "gold"],
    storefronts: ["a", "b"]
  }
];

const allProducts = [...existingProducts, ...newProducts];

fs.writeFileSync(
  path.resolve(__dirname, '../src/data/products.json'),
  JSON.stringify(allProducts, null, 2),
  'utf8'
);

console.log(`Successfully written ${allProducts.length} products to products.json!`);

// Summary per category
const counts = {};
for (const p of allProducts) {
  counts[p.categoryId] = (counts[p.categoryId] || 0) + 1;
}
console.log('Category breakdown:', counts);
