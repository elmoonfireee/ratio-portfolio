"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export default function ProjectGallery({ images, locale, content }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const touchStartX = useRef(null);
  const didSwipe = useRef(false);
  const openerRef = useRef(null);
  const closeButtonRef = useRef(null);
  const lightboxRef = useRef(null);
  const total = images.length;

  const changeSlide = useCallback((direction) => {
    setActiveIndex((current) => (current + direction + total) % total);
  }, [total]);

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
    didSwipe.current = false;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return;

    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const distance = endX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(distance) < 50 || total < 2) return;

    didSwipe.current = true;
    changeSlide(distance > 0 ? -1 : 1);
  };

  const openLightbox = () => {
    if (didSwipe.current) {
      didSwipe.current = false;
      return;
    }
    setIsLightboxOpen(true);
  };

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
    window.requestAnimationFrame(() => openerRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!isLightboxOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") changeSlide(-1);
      if (event.key === "ArrowRight") changeSlide(1);

      if (event.key !== "Tab" || !lightboxRef.current) return;

      const focusable = Array.from(
        lightboxRef.current.querySelectorAll(
          'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [changeSlide, closeLightbox, isLightboxOpen]);

  if (!total) return null;

  const activeImage = images[activeIndex];
  const activeAlt = activeImage.alt?.[locale] || `${content.galleryImage} ${activeIndex + 1}`;
  const counter = `${activeIndex + 1} / ${total}`;

  return (
    <section className="section-shell pb-16" aria-labelledby="project-gallery">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-orange">
            {content.galleryEyebrow}
          </p>
          <h2 id="project-gallery" className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
            {content.gallery}
          </h2>
        </div>
        <span className="font-mono text-sm text-white/45" aria-live="polite">
          {counter}
        </span>
      </div>

      <div className="mt-6 overflow-hidden border border-white/10 bg-brand-ink shadow-2xl shadow-black/30">
        <div
          className="hover-fine-gallery-image relative aspect-[16/10] touch-pan-y overflow-hidden sm:aspect-[16/9]"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            ref={openerRef}
            type="button"
            onClick={openLightbox}
            className="focus-ring absolute inset-0 z-10 cursor-zoom-in"
            aria-label={`${content.galleryOpen}: ${activeAlt}`}
          >
            <span className="sr-only">{content.galleryOpen}</span>
          </button>
          <Image
            key={`${activeImage.src}-${activeIndex}`}
            src={activeImage.src}
            alt={activeAlt}
            fill
            sizes="(max-width: 1280px) 100vw, 1200px"
            className="hover-fine-gallery-image-media select-none object-cover transition duration-700"
            draggable={false}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15" />
          <div className="pointer-events-none absolute bottom-5 right-5 z-20 flex items-center gap-2 border border-white/15 bg-black/60 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/80 backdrop-blur">
            <Maximize2 size={15} aria-hidden="true" />
            {content.galleryOpen}
          </div>

          {total > 1 ? (
            <>
              <button
                type="button"
                onClick={() => changeSlide(-1)}
                className="hover-fine-gallery-slide-control focus-ring absolute left-3 top-1/2 z-30 grid size-11 -translate-y-1/2 place-items-center border border-white/15 bg-black/65 text-white backdrop-blur transition sm:left-5"
                aria-label={content.previousImage}
              >
                <ChevronLeft size={24} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => changeSlide(1)}
                className="hover-fine-gallery-slide-control focus-ring absolute right-3 top-1/2 z-30 grid size-11 -translate-y-1/2 place-items-center border border-white/15 bg-black/65 text-white backdrop-blur transition sm:right-5"
                aria-label={content.nextImage}
              >
                <ChevronRight size={24} aria-hidden="true" />
              </button>
            </>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-white/10 px-4 py-3 sm:px-5">
          <p className="truncate text-sm text-white/55">{activeAlt}</p>
          <span className="shrink-0 text-xs uppercase tracking-[0.14em] text-brand-orange">
            {content.galleryImage} {activeIndex + 1}
          </span>
        </div>
      </div>

      {total > 1 ? (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2" aria-label={content.galleryThumbnails}>
          {images.map((image, index) => {
            const alt = image.alt?.[locale] || `${content.galleryImage} ${index + 1}`;
            const isActive = index === activeIndex;

            return (
              <button
                key={`${image.src}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`focus-ring relative aspect-[16/10] w-28 shrink-0 overflow-hidden border transition sm:w-36 ${
                  isActive
                    ? "border-brand-orange opacity-100"
                    : "hover-fine-gallery-thumbnail border-white/10 opacity-45"
                }`}
                aria-label={`${content.galleryImage} ${index + 1}: ${alt}`}
                aria-current={isActive ? "true" : undefined}
              >
                <Image
                  src={image.src}
                  alt=""
                  fill
                  sizes="144px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      ) : null}

      {isLightboxOpen ? (
        <div
          role="dialog"
          ref={lightboxRef}
          aria-modal="true"
          aria-label={content.gallery}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-3 backdrop-blur-md sm:p-8"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeLightbox();
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeLightbox}
            className="hover-fine-gallery-lightbox-close focus-ring absolute right-4 top-4 z-20 grid size-12 place-items-center border border-white/20 bg-black/60 text-white transition sm:right-8 sm:top-8"
            aria-label={content.closeGallery}
          >
            <X size={25} aria-hidden="true" />
          </button>

          <div className="relative h-full w-full max-w-[1600px]">
            <Image
              key={`lightbox-${activeImage.src}-${activeIndex}`}
              src={activeImage.src}
              alt={activeAlt}
              fill
              sizes="100vw"
              className="select-none object-contain"
              draggable={false}
              priority
            />
          </div>

          {total > 1 ? (
            <>
              <button
                type="button"
                onClick={() => changeSlide(-1)}
                className="hover-fine-gallery-lightbox-control focus-ring absolute left-3 top-1/2 z-20 grid size-12 -translate-y-1/2 place-items-center border border-white/20 bg-black/60 text-white transition sm:left-8"
                aria-label={content.previousImage}
              >
                <ChevronLeft size={28} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => changeSlide(1)}
                className="hover-fine-gallery-lightbox-control focus-ring absolute right-3 top-1/2 z-20 grid size-12 -translate-y-1/2 place-items-center border border-white/20 bg-black/60 text-white transition sm:right-8"
                aria-label={content.nextImage}
              >
                <ChevronRight size={28} aria-hidden="true" />
              </button>
            </>
          ) : null}

          <div className="pointer-events-none absolute bottom-5 left-1/2 z-20 -translate-x-1/2 border border-white/15 bg-black/70 px-4 py-2 font-mono text-sm text-white/70 backdrop-blur sm:bottom-8">
            {counter}
          </div>
        </div>
      ) : null}
    </section>
  );
}
