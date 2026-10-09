"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Category } from "@/types";
import { GENDER_COLLECTIONS } from "@/data/genderCollections";

interface SectionBannerProps {
  category: Category;
  productCount: number;
  /** When set, renders the gender-mode banner (fixed image, swappable text). */
  gender?: "men" | "women";
  /** Slug of the active category tab when gender mode is active. "all" or undefined = show gender hero text. */
  activeCategorySlug?: string | null;
}

export const SectionBanner: React.FC<SectionBannerProps> = ({
  category,
  productCount,
  gender,
  activeCategorySlug,
}) => {
  // ── Gender-aware mode ──────────────────────────────────────────────────────
  if (gender) {
    const cfg = GENDER_COLLECTIONS[gender];
    const isAll = !activeCategorySlug || activeCategorySlug === "all";

    const eyebrow = cfg.eyebrow;
    const headline = isAll
      ? cfg.title
      : (cfg.categories[activeCategorySlug ?? ""]?.title ?? cfg.title);
    const subtitle = isAll
      ? cfg.subtitle
      : (cfg.categories[activeCategorySlug ?? ""]?.subtitle ?? cfg.subtitle);

    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          backgroundColor: "#ffffff",
          minHeight: "60vh",
          overflow: "hidden",
          boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
        }}
        className="section-banner-split"
      >
        {/* Left side: Typography */}
        <div
          style={{
            flex: "1 1 50%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 20px",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={eyebrow + headline}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.25, 0.8, 0.25, 1] }}
              style={{ textAlign: "center", maxWidth: "400px" }}
            >
              <p
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "#333",
                  marginBottom: "16px",
                }}
              >
                {isAll ? cfg.eyebrow : eyebrow}
              </p>
              <h2
                style={{
                  fontSize: "clamp(2.5rem, 4vw, 4rem)",
                  fontFamily: "var(--font-serif)",
                  fontWeight: 400,
                  color: "#000",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  marginBottom: "20px",
                }}
              >
                {isAll ? cfg.title : headline}
              </h2>
              <p
                style={{
                  fontSize: "clamp(0.85rem, 1.1vw, 1rem)",
                  color: "#555",
                  lineHeight: 1.6,
                  maxWidth: "340px",
                  margin: "0 auto",
                }}
              >
                {subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right side: fixed gender image */}
        <div
          style={{ flex: "1 1 50%", position: "relative", minHeight: "400px" }}
          className="banner-image-container"
        >
          <Image
            src={cfg.defaultBanner}
            alt={cfg.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>

        <style jsx>{`
          @media (max-width: 768px) {
            .section-banner-split {
              flex-direction: column !important;
            }
            .banner-image-container {
              height: 400px;
              width: 100%;
            }
          }
        `}</style>
      </div>
    );
  }

  // ── Original /shop mode (unchanged) ───────────────────────────────────────
  const generatedCategories = [
    "outerwear",
    "tailoring",
    "eveningwear",
    "knitwear",
    "leather-goods",
    "footwear",
    "fine-jewelry",
    "fragrances",
  ];

  const bannerSrc = generatedCategories.includes(category.slug)
    ? `/images/banners/gen/${category.slug}.jpg`
    : category.bannerImage || category.image;

  const isOuterwear = category.slug === "outerwear";
  const smallText = isOuterwear
    ? "HEAVY-DUTY WARMTH"
    : `${category.name} COLLECTION`;
  const largeText = isOuterwear ? "That Shearling Feeling" : category.name;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        borderRadius: "0px",
        marginBottom: "0px",
        display: "flex",
        flexDirection: "row",
        backgroundColor: "#ffffff",
        minHeight: "60vh",
        overflow: "hidden",
        boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
      }}
      className="section-banner-split"
    >
      {/* Left side: Typography */}
      <div
        style={{
          flex: "1 1 50%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          position: "relative",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "400px" }}>
          <p
            style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "#333",
              marginBottom: "16px",
            }}
          >
            {smallText}
          </p>
          <h2
            style={{
              fontSize: "clamp(2.5rem, 4vw, 4rem)",
              fontFamily: "var(--font-serif)",
              fontWeight: 400,
              color: "#000",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            {largeText}
          </h2>
        </div>
      </div>

      {/* Right side: Image */}
      <div
        style={{
          flex: "1 1 50%",
          position: "relative",
          minHeight: "400px",
        }}
        className="banner-image-container"
      >
        <Image
          src={bannerSrc}
          alt={`${category.name} Campaign`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>

      <style jsx>{`
        .split-arrow-btn:hover {
          background-color: #f5f5f5 !important;
          border-color: #d0d0d0 !important;
        }
        @media (max-width: 768px) {
          .section-banner-split {
            flex-direction: column !important;
          }
          .banner-image-container {
            height: 400px;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};
