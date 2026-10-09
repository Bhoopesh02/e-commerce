export interface GenderCategoryCopy {
  title: string;
  subtitle: string;
}

export interface PromoBannerData {
  imageSrc: string;
  eyebrow: string;
  headline: string;
  quote: string;
  cta?: string;
}

export interface GenderCollectionConfig {
  eyebrow: string;
  title: string;
  subtitle: string;
  defaultBanner: string;
  promoBanners: PromoBannerData[];
  categories: Record<string, GenderCategoryCopy>;
}

export const GENDER_COLLECTIONS: Record<"men" | "women", GenderCollectionConfig> = {
  men: {
    eyebrow: "AURELIA HOMME",
    title: "The Men’s Wardrobe",
    subtitle:
      "Architectural silhouettes, Savile Row precision, and noble natural fibers crafted for longevity.",
    defaultBanner: "/images/banners/gen/men/all.jpg",
    promoBanners: [
      {
        imageSrc: "/images/banners/promo/men_banner_1.webp",
        eyebrow: "AURELIA HOMME",
        headline: "The Art of Ease",
        quote: "Quiet tailoring for the unhurried hour.",
      },
      {
        imageSrc: "/images/banners/promo/men_banner_2.webp",
        eyebrow: "AURELIA HOMME",
        headline: "Made to Be Lived In",
        quote: "Considered fabrics and a precise cut, season after season.",
      },
    ],
    categories: {
      outerwear: {
        title: "Men’s Outerwear",
        subtitle:
          "Hand-finished Milanese nappa leather jackets, Spanish merino shearling aviators, and double-breasted virgin wool peacoats.",
      },
      tailoring: {
        title: "Men’s Tailoring",
        subtitle:
          "Deconstructed chalk-stripe wool suiting, high-rise pleated Gurkha trousers, and cotton-silk velvet smoking jackets.",
      },
      eveningwear: {
        title: "Men’s Eveningwear",
        subtitle: "A curated selection of formal attire.",
      },
      knitwear: {
        title: "Men’s Knitwear",
        subtitle:
          "Seamless fine-gauge cashmere crewnecks, chunky cable-knit merino cardigans, and Peruvian baby alpaca polos.",
      },
      "leather-goods": {
        title: "Men’s Leather Goods",
        subtitle:
          "Handcrafted Florentine flap briefcases, pebbled leather weekend duffles, and grained calfskin folios.",
      },
      footwear: {
        title: "Men’s Footwear",
        subtitle:
          "Goodyear-welted oxford brogues, hand-burnished monk strap loafers, and Italian calfskin low-top court sneakers.",
      },
      "fine-jewelry": {
        title: "Men’s Fine Jewelry",
        subtitle:
          "Architectural dome signet rings, heavy herringbone chains, and gold vermeil Corinthian column cufflinks.",
      },
      fragrances: {
        title: "Men’s Fragrances",
        subtitle:
          "Artisanal concentrated extracts of wild Haitian vetiver, rare Cambodian oud, and rich cured pipe tobacco.",
      },
    },
  },
  women: {
    eyebrow: "AURELIA FEMME",
    title: "The Women’s Collection",
    subtitle:
      "Sculptural drapery, liquid mulberry silks, and tactile tailoring designed with quiet authority.",
    defaultBanner: "/images/banners/gen/women/all.jpg",
    promoBanners: [
      {
        imageSrc: "/images/banners/promo/women_banner_1.webp",
        eyebrow: "AURELIA FEMME",
        headline: "Composed in Silk",
        quote: "Fluid lines and sculpted tailoring, worn with quiet authority.",
      },
      {
        imageSrc: "/images/banners/promo/women_banner_2.webp",
        eyebrow: "AURELIA FEMME",
        headline: "The Evening, Defined",
        quote: "Elegance that moves with you, from day into night.",
      },
    ],
    categories: {
      outerwear: {
        title: "Women’s Outerwear",
        subtitle:
          "Fluid cashmere wrap overcoats, double-faced wool trench coats, and quilted silk down parkas.",
      },
      tailoring: {
        title: "Women’s Tailoring",
        subtitle:
          "Hourglass tuxedo jackets, architectural peplum waistcoats, and pleated wide-leg palazzo trousers.",
      },
      eveningwear: {
        title: "Women’s Eveningwear",
        subtitle:
          "Liquid silk charmeuse slip gowns, corseted taffeta gala ballgowns, and delicately sequined Chantilly lace sirens.",
      },
      knitwear: {
        title: "Women’s Knitwear",
        subtitle:
          "Ribbed Mongolian cashmere turtlenecks, brushed kid mohair jumpers, and oversized Donegal wool fisherman sweaters.",
      },
      "leather-goods": {
        title: "Women’s Leather Goods",
        subtitle:
          "Architectural box calf top-handle bags, braided lambskin hobos, and sculptural folded leather clutches.",
      },
      footwear: {
        title: "Women’s Footwear",
        subtitle:
          "Pointed knee-high suede boots, architectural square-toe slingback pumps, and strappy satin evening stilettos.",
      },
      "fine-jewelry": {
        title: "Women’s Fine Jewelry",
        subtitle:
          "Organic baroque freshwater pearl pendants, molten gold drop earrings, and micro-pavé diamond huggies.",
      },
      fragrances: {
        title: "Women’s Fragrances",
        subtitle:
          "Artisanal distilled extracts of Calabrian bergamot, Moroccan orange blossom, and crimson Damask rose.",
      },
    },
  },
};
