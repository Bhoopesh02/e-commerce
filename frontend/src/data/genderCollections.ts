export interface GenderCategoryCopy {
  title: string;
  subtitle: string;
}

export interface GenderCollectionConfig {
  eyebrow: string;
  title: string;
  subtitle: string;
  defaultBanner: string;
  categories: Record<string, GenderCategoryCopy>;
}

export const GENDER_COLLECTIONS: Record<"men" | "women", GenderCollectionConfig> = {
  men: {
    eyebrow: "AURELIA HOMME",
    title: "The Men\u2019s Wardrobe",
    subtitle:
      "Architectural silhouettes, Savile Row precision, and noble natural fibers crafted for longevity.",
    defaultBanner: "/images/banners/gen/men/all.jpg",
    categories: {
      outerwear: {
        title: "MEN\u2019S OUTERWEAR",
        subtitle:
          "Double-faced virgin wool overcoats, distressed shearling aviators, and Milanese nappa leather jackets.",
      },
      tailoring: {
        title: "MEN\u2019S TAILORING",
        subtitle:
          "Deconstructed Super 150s wool suiting, chalk-stripe double-breasted blazers, and high-rise Gurkha trousers.",
      },
      eveningwear: {
        title: "MEN\u2019S EVENINGWEAR",
        subtitle:
          "Midnight barathea tuxedo suiting, velvet-collared Chesterfields, and Marcella bib formal attire.",
      },
      knitwear: {
        title: "MEN\u2019S KNITWEAR",
        subtitle:
          "Artisanal 8-ply Mongolian cashmere cardigans, baby alpaca knit polos, and seamless thermal crewnecks.",
      },
      "leather-goods": {
        title: "MEN\u2019S LEATHER GOODS",
        subtitle:
          "Hand-stitched French box calfskin weekender holdalls, Florentine flap briefcases, and Saffiano folios.",
      },
      footwear: {
        title: "MEN\u2019S FOOTWEAR",
        subtitle:
          "Goodyear-welted Tuscan Chelsea boots, hand-burnished monk straps, and chiseled dress oxfords.",
      },
      "fine-jewelry": {
        title: "MEN\u2019S FINE JEWELRY",
        subtitle:
          "Architectural black onyx signet rings, heavy 18k vermeil curb chains, and Corinthian column cufflinks.",
      },
      fragrances: {
        title: "MEN\u2019S FRAGRANCES",
        subtitle:
          "Concentrated extrait parfums of smoky Atlas cedarwood, Cambodian oud, and cured pipe tobacco.",
      },
    },
  },
  women: {
    eyebrow: "AURELIA FEMME",
    title: "The Women\u2019s Collection",
    subtitle:
      "Sculptural drapery, liquid mulberry silks, and tactile tailoring designed with quiet authority.",
    defaultBanner: "/images/banners/gen/women/all.jpg",
    categories: {
      outerwear: {
        title: "WOMEN\u2019S OUTERWEAR",
        subtitle:
          "Fluid cashmere wrap overcoats, sculptural capelet coats, and insulating cocoon duster silhouettes.",
      },
      tailoring: {
        title: "WOMEN\u2019S TAILORING",
        subtitle:
          "Hourglass virgin wool blazers, architectural peplum vests, and floor-puddle pleated palazzo trousers.",
      },
      eveningwear: {
        title: "WOMEN\u2019S EVENINGWEAR",
        subtitle:
          "Liquid mulberry silk charmeuse slip gowns, corseted gala ballgowns, and diaphanous organza capes.",
      },
      knitwear: {
        title: "WOMEN\u2019S KNITWEAR",
        subtitle:
          "Grade-A Inner Mongolian ribbed turtlenecks, open-back twisted cashmeres, and brushed kid mohair.",
      },
      "leather-goods": {
        title: "WOMEN\u2019S LEATHER GOODS",
        subtitle:
          "Sculptural origami gusset totes, French box calf top-handle bags, and hand-woven intrecciato hobos.",
      },
      footwear: {
        title: "WOMEN\u2019S FOOTWEAR",
        subtitle:
          "Architectural flared kitten-heel pumps, chiseled ballerina flats, and crystal-coil evening stilettos.",
      },
      "fine-jewelry": {
        title: "WOMEN\u2019S FINE JEWELRY",
        subtitle:
          "Organic baroque freshwater pearl pendants, molten vermeil open torcs, and micro-pav\u00e9 diamond huggies.",
      },
      fragrances: {
        title: "WOMEN\u2019S FRAGRANCES",
        subtitle:
          "Artisanal distilled Grasse extracts of powdery Florentine orris, night-blooming jasmine, and Damask rose.",
      },
    },
  },
};
