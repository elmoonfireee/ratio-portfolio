"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { getProjectPath } from "@/data/projects";

const SWIPE_THRESHOLD = 50;
const DRAG_RESISTANCE = 0.45;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default function ProjectCarousel({ content, locale, projects }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [trackOffset, setTrackOffset] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const slideRefs = useRef([]);
  const touchStartX = useRef(null);
  const didSwipe = useRef(false);
  const total = projects.length;
  const hasMultiple = total > 1;
  const isAtStart = activeIndex === 0;
  const isAtEnd = activeIndex === total - 1;

  useLayoutEffect(() => {
    setActiveIndex((current) => clamp(current, 0, Math.max(total - 1, 0)));
  }, [total]);

  const changeSlide = useCallback(
    (direction) => {
      setActiveIndex((current) => clamp(current + direction, 0, Math.max(total - 1, 0)));
    },
    [total]
  );

  const updateTrackOffset = useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const slide = slideRefs.current[activeIndex];

    if (!viewport || !track || !slide) return;

    const maxOffset = Math.max(track.scrollWidth - viewport.clientWidth, 0);
    setTrackOffset(Math.min(slide.offsetLeft, maxOffset));
  }, [activeIndex]);

  useLayoutEffect(() => {
    updateTrackOffset();

    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track || typeof ResizeObserver === "undefined") return undefined;

    const observer = new ResizeObserver(updateTrackOffset);
    observer.observe(viewport);
    observer.observe(track);

    return () => observer.disconnect();
  }, [projects, updateTrackOffset]);

  const handleKeyDown = (event) => {
    if (event.target !== event.currentTarget || !hasMultiple) return;

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      changeSlide(-1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      changeSlide(1);
    }
  };

  const handleTouchStart = (event) => {
    if (!hasMultiple) return;
    touchStartX.current = event.touches[0]?.clientX ?? null;
    didSwipe.current = false;
    setIsDragging(true);
  };

  const handleTouchMove = (event) => {
    if (touchStartX.current === null || !hasMultiple) return;
    const currentX = event.touches[0]?.clientX ?? touchStartX.current;
    setDragOffset((currentX - touchStartX.current) * DRAG_RESISTANCE);
  };

  const finishTouch = (endX) => {
    if (touchStartX.current === null) return;

    const distance = endX - touchStartX.current;
    touchStartX.current = null;
    setDragOffset(0);
    setIsDragging(false);

    if (Math.abs(distance) < SWIPE_THRESHOLD || !hasMultiple) return;

    didSwipe.current = true;
    changeSlide(distance > 0 ? -1 : 1);
    window.setTimeout(() => {
      didSwipe.current = false;
    }, 400);
  };

  const handleTouchEnd = (event) => {
    finishTouch(event.changedTouches[0]?.clientX ?? touchStartX.current ?? 0);
  };

  const handleTouchCancel = () => {
    touchStartX.current = null;
    setDragOffset(0);
    setIsDragging(false);
  };

  const handleProjectClick = (event) => {
    if (!didSwipe.current) return;
    event.preventDefault();
    didSwipe.current = false;
  };

  if (!total) return null;

  const counter = `${String(activeIndex + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
  const slideWidthClass = total === 1
    ? "basis-full"
    : "basis-[88%] sm:basis-[82%] lg:basis-[74%] xl:basis-[70%]";

  return (
    <div className="mt-12">
      <div className="mb-5 flex items-center justify-between gap-5 sm:mb-7">
        <div className="flex min-w-0 flex-1 items-center gap-4 sm:gap-6">
          <span className="shrink-0 font-mono text-sm text-brand-orange" aria-live="polite">
            {counter}
          </span>
          <div className="h-px min-w-0 flex-1 overflow-hidden bg-white/10" aria-hidden="true">
            <span
              className="block h-full origin-left bg-brand-orange transition-transform duration-500 motion-reduce:transition-none"
              style={{ transform: `scaleX(${(activeIndex + 1) / total})` }}
            />
          </div>
        </div>

        {hasMultiple ? (
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              className="hover-fine-carousel-button focus-ring grid h-11 w-14 place-items-center border border-white/15 text-white transition-colors disabled:cursor-not-allowed disabled:opacity-25 motion-reduce:transition-none"
              onClick={() => changeSlide(-1)}
              aria-label={content.carousel.previousLabel}
              disabled={isAtStart}
            >
              <ChevronLeft size={21} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="hover-fine-carousel-button focus-ring grid h-11 w-14 place-items-center border border-white/15 text-white transition-colors disabled:cursor-not-allowed disabled:opacity-25 motion-reduce:transition-none"
              onClick={() => changeSlide(1)}
              aria-label={content.carousel.nextLabel}
              disabled={isAtEnd}
            >
              <ChevronRight size={21} aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </div>

      <div
        ref={viewportRef}
        className="focus-ring touch-pan-y overflow-hidden"
        role="region"
        aria-label={content.carousel.ariaLabel}
        tabIndex={hasMultiple ? 0 : undefined}
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
      >
        <div
          ref={trackRef}
          className={`flex gap-4 will-change-transform sm:gap-6 ${
            isDragging ? "transition-none" : "transition-transform duration-500 ease-out motion-reduce:transition-none"
          }`}
          style={{ transform: `translate3d(${dragOffset - trackOffset}px, 0, 0)` }}
        >
          {projects.map((project, index) => {
            const isActive = index === activeIndex;
            const imageAlt = project.featuredImageAlt?.[locale] || project.title[locale];
            const projectHref = getProjectPath(locale, project.slug);
            const slideLabel = `${content.carousel.slideLabel} ${index + 1} / ${total}: ${project.title[locale]}`;

            return (
              <article
                key={project.slug}
                ref={(element) => {
                  slideRefs.current[index] = element;
                }}
                className={`${slideWidthClass} min-w-0 shrink-0 border border-white/10 bg-brand-black transition-[opacity,transform,border-color] duration-500 motion-reduce:transition-none ${
                  isActive
                    ? "scale-100 border-brand-orange/35 opacity-100"
                    : "scale-[0.975] border-white/10 opacity-40"
                }`}
                role="group"
                aria-label={slideLabel}
              >
                <Link
                  href={projectHref}
                  className="hover-fine-carousel-image focus-ring relative block aspect-[16/10] overflow-hidden bg-brand-ink sm:aspect-[16/9]"
                  onClick={handleProjectClick}
                  tabIndex={isActive ? undefined : -1}
                >
                  <Image
                    src={project.featuredImage}
                    alt={imageAlt}
                    fill
                    sizes="(max-width: 640px) 88vw, (max-width: 1024px) 82vw, (max-width: 1280px) 74vw, 896px"
                    className="hover-fine-carousel-image-media select-none object-cover transition duration-700 motion-reduce:transition-none"
                    draggable={false}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-black/85 via-transparent to-brand-black/15" />
                  <div className="absolute left-4 top-4 border border-brand-orange/40 bg-brand-black/80 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-brand-orange sm:left-6 sm:top-6 sm:text-xs">
                    {project.status[locale]}
                  </div>
                  <span className="pointer-events-none absolute bottom-4 right-5 font-mono text-5xl text-white/15 sm:bottom-6 sm:right-7 sm:text-7xl" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </Link>

                <div className="grid min-h-[17rem] gap-7 p-5 sm:min-h-[15rem] sm:p-7 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                  <div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs uppercase tracking-[0.15em]">
                      <span className="text-brand-orange">{project.category}</span>
                      <span className="text-white/35">{content.cardLabels.location}: {project.location[locale]}</span>
                    </div>
                    <h3 className="mt-4 max-w-3xl text-2xl font-semibold leading-tight text-white sm:text-3xl">
                      {project.title[locale]}
                    </h3>
                    <p className="mt-4 max-w-3xl text-sm leading-7 text-white/60 sm:text-base">
                      {project.shortDescription[locale]}
                    </p>
                  </div>

                  <Link
                    href={projectHref}
                    className="btn-secondary w-full whitespace-nowrap md:w-auto"
                    onClick={handleProjectClick}
                    tabIndex={isActive ? undefined : -1}
                  >
                    {content.cardLabels.details}
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
