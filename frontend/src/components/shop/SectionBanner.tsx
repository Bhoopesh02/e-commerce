import React, { useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useSearchParams } from "next/navigation";
import { Category } from "@/types";
import { GENDER_COLLECTIONS } from "@/data/genderCollections";
import { useRevealOnView } from "@/hooks/useRevealOnView";
import {
  useBannerAnimation,
  isBannerAnimationInScope,
} from "./bannerAnimation";
import "./banner-animation.css";

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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categorySlugParam = searchParams.get("categorySlug");

  const bannerRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const footerRef = useRef<HTMLParagraphElement>(null);

  const isVisible = useRevealOnView(bannerRef, { threshold: 0.25, triggerOnMount: true });

  const inScope = isBannerAnimationInScope(pathname, categorySlugParam);

  // ── Compute slot text for top-level hook call ─────────────────────────────
  const isGenderMode = Boolean(gender);
  const cfg = gender ? GENDER_COLLECTIONS[gender] : null;
  const isAll = !activeCategorySlug || activeCategorySlug === "all";

  const genderEyebrow = cfg ? cfg.eyebrow : "";
  const genderHeadline = cfg
    ? isAll
      ? cfg.title
      : (cfg.categories[activeCategorySlug ?? ""]?.title ?? cfg.title)
    : "";
  const genderSubtitle = cfg
    ? isAll
      ? cfg.subtitle
      : (cfg.categories[activeCategorySlug ?? ""]?.subtitle ?? cfg.subtitle)
    : "";

  const isOuterwear = category.slug === "outerwear";
  const shopSmallText = isOuterwear
    ? "HEAVY-DUTY WARMTH"
    : `${category.name} COLLECTION`;
  const shopLargeText = isOuterwear ? "That Shearling Feeling" : category.name;

  const currentTagText = isGenderMode ? genderEyebrow : shopSmallText;
  const currentTitleText = isGenderMode ? genderHeadline : shopLargeText;
  const currentFooterText = isGenderMode ? genderSubtitle : null;

  const identityKey = isGenderMode
    ? `${pathname}-${gender}-${activeCategorySlug || "all"}`
    : `${pathname}?categorySlug=${categorySlugParam || category.slug}`;

  useBannerAnimation({
    containerRef: bannerRef,
    imageWrapperRef,
    tagRef,
    titleRef,
    footerRef: isGenderMode ? footerRef : undefined,
    isInScope: inScope,
    identityKey,
    tagText: currentTagText,
    titleText: currentTitleText,
    footerText: currentFooterText,
  });

  // ── Gender-aware mode ──────────────────────────────────────────────────────
  if (gender && cfg) {
    const eyebrow = cfg.eyebrow;
    const headline = isAll
      ? cfg.title
      : (cfg.categories[activeCategorySlug ?? ""]?.title ?? cfg.title);
    const subtitle = isAll
      ? cfg.subtitle
      : (cfg.categories[activeCategorySlug ?? ""]?.subtitle ?? cfg.subtitle);

    return (
      <div
        ref={bannerRef}
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
        className={`section-banner-split ${
          inScope
            ? "aurelia-banner-in-scope"
            : `reveal-banner ${isVisible ? "is-visible" : ""}`
        }`}
      >
        <noscript>
          <style>{`
            .reveal-banner__img,
            .reveal-banner__text > * {
              opacity: 1 !important;
              transform: none !important;
              animation: none !important;
            }
          `}</style>
        </noscript>
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
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.25, 0.8, 0.25, 1] }}
              style={{ textAlign: "center", maxWidth: "400px" }}
              className="reveal-banner__text"
            >
              <p
                ref={tagRef}
                style={
                  {
                    "--i": 0,
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: "#333",
                    marginBottom: "16px",
                  } as React.CSSProperties
                }
                className="banner-tag-slot"
              >
                {isAll ? cfg.eyebrow : eyebrow}
              </p>
              <h2
                ref={titleRef}
                style={
                  {
                    "--i": 1,
                    fontSize: "clamp(2.5rem, 4vw, 4rem)",
                    fontFamily: "var(--font-serif)",
                    fontWeight: 400,
                    color: "#000",
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                    marginBottom: "20px",
                  } as React.CSSProperties
                }
              >
                {isAll ? cfg.title : headline}
              </h2>
              <p
                ref={footerRef}
                style={
                  {
                    "--i": 2,
                    fontSize: "clamp(0.85rem, 1.1vw, 1rem)",
                    color: "#555",
                    lineHeight: 1.6,
                    maxWidth: "340px",
                    margin: "0 auto",
                  } as React.CSSProperties
                }
              >
                {subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right side: fixed gender image */}
        <div
          ref={imageWrapperRef}
          style={{ flex: "1 1 50%", position: "relative", minHeight: "400px", overflow: "hidden" }}
          className="banner-image-container reveal-banner__media aurelia-banner-image-wrapper"
        >
          <Image
            src={cfg.defaultBanner}
            alt={cfg.title}
            fill
            quality={88}
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
            className="reveal-banner__img"
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
    ? `/images/banners/gen/${category.slug}.webp`
    : category.bannerImage || category.image;

  return (
    <div
      ref={bannerRef}
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
      className={`section-banner-split ${
        inScope
          ? "aurelia-banner-in-scope"
          : `reveal-banner ${isVisible ? "is-visible" : ""}`
      }`}
    >
      <noscript>
        <style>{`
          .reveal-banner__img,
          .reveal-banner__text > * {
            opacity: 1 !important;
            transform: none !important;
            animation: none !important;
          }
        `}</style>
      </noscript>
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
        <div className="reveal-banner__text" style={{ textAlign: "center", maxWidth: "400px" }}>
          <p
            ref={tagRef}
            style={
              {
                "--i": 0,
                fontSize: "0.8rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "#333",
                marginBottom: "16px",
              } as React.CSSProperties
            }
            className="banner-tag-slot"
          >
            {shopSmallText}
          </p>
          <h2
            ref={titleRef}
            style={
              {
                "--i": 1,
                fontSize: "clamp(2.5rem, 4vw, 4rem)",
                fontFamily: "var(--font-serif)",
                fontWeight: 400,
                color: "#000",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              } as React.CSSProperties
            }
          >
            {shopLargeText}
          </h2>
        </div>
      </div>

      {/* Right side: Image */}
      <div
        ref={imageWrapperRef}
        style={{
          flex: "1 1 50%",
          position: "relative",
          minHeight: "400px",
          overflow: "hidden",
        }}
        className="banner-image-container reveal-banner__media aurelia-banner-image-wrapper"
      >
        <Image
          src={bannerSrc}
          alt={`${category.name} Campaign`}
          fill
          quality={88}
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{ objectFit: "cover", objectPosition: "center" }}
          className="reveal-banner__img"
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

