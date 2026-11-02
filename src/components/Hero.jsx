"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import IntroLogoVideo from "./IntroLogoVideo";
import LoxonePartner from "./LoxonePartner";
import { INTRO_TIMING } from "@/hooks/useIntroAnimation";

const INTRO_HEADLINE_GAP = 24;

function getTranslate(transform) {
  if (!transform || transform === "none") {
    return { x: 0, y: 0 };
  }

  const values = transform.match(/matrix(?:3d)?\(([^)]+)\)/)?.[1]?.split(",").map(Number);

  if (!values) {
    return { x: 0, y: 0 };
  }

  return values.length === 16
    ? { x: values[12], y: values[13] }
    : { x: values[4], y: values[5] };
}

export default function Hero({ content, partner, intro, logoSourceRef, showHomepagePortfolio = true }) {
  const {
    phase,
    logoGeometry,
    showHeadline,
    showInterface,
    introSkipped,
    logoHandoffComplete,
    onVideoEnd,
    onVideoError,
    onHeadlineAnimationEnd,
    onLogoTransitionEnd
  } = intro;
  const headlineRef = useRef(null);
  const floatingLogoRef = useRef(null);
  const headlineAnchorRef = useRef(null);
  const [headlineStartAnchor, setHeadlineStartAnchor] = useState(null);
  const [headlineFlip, setHeadlineFlip] = useState(null);
  const isHeadlineFlipActive = !introSkipped && (phase === "headline" || phase === "moving");
  const isLogoHandoff = phase === "interface" && !logoHandoffComplete;
  const showFloatingLogo =
    !introSkipped &&
    phase !== "checking" &&
    phase !== "complete" &&
    (phase !== "interface" || isLogoHandoff);
  const isMoving = phase === "moving" || isLogoHandoff;
  const heroBackgroundClass =
    phase === "logo"
      ? "hero-intro-logo-background"
      : phase === "headline"
        ? "hero-intro-headline-background"
        : phase === "moving"
          ? "hero-intro-moving-background"
          : phase === "interface"
            ? "hero-intro-return-background"
          : phase === "checking"
            ? "hero-intro-checking-background"
            : "bg-brand-black";
  const floatingLogoStyle = logoGeometry
    ? {
        left: logoGeometry.left,
        top: logoGeometry.top,
        width: logoGeometry.width,
        height: logoGeometry.height,
        opacity: isLogoHandoff ? 0 : 1,
        transform: isMoving
          ? `translate3d(${logoGeometry.translateX}px, ${logoGeometry.translateY}px, 0) scale(${logoGeometry.scaleX}, ${logoGeometry.scaleY})`
          : "translate3d(0, 0, 0) scale(1)",
        transitionDuration: `${isLogoHandoff ? INTRO_TIMING.logoHandoff : INTRO_TIMING.logoMove}ms`
      }
    : undefined;

  useLayoutEffect(() => {
    if (!isHeadlineFlipActive) {
      setHeadlineStartAnchor(null);
      return undefined;
    }

    if (phase !== "headline" || window.matchMedia("(min-width: 1024px)").matches) {
      return undefined;
    }

    function updateStartAnchor() {
      const logoRect = floatingLogoRef.current?.getBoundingClientRect();

      if (!logoRect?.width || !logoRect.height) {
        return;
      }

      const nextAnchor = {
        left: Math.round(logoRect.left),
        top: Math.round(logoRect.bottom + INTRO_HEADLINE_GAP)
      };

      setHeadlineStartAnchor((current) =>
        current?.left === nextAnchor.left && current?.top === nextAnchor.top ? current : nextAnchor
      );
    }

    updateStartAnchor();

    const observer = typeof ResizeObserver === "undefined"
      ? null
      : new ResizeObserver(updateStartAnchor);

    if (floatingLogoRef.current) {
      observer?.observe(floatingLogoRef.current);
    }
    window.addEventListener("resize", updateStartAnchor);
    window.addEventListener("orientationchange", updateStartAnchor);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", updateStartAnchor);
      window.removeEventListener("orientationchange", updateStartAnchor);
    };
  }, [isHeadlineFlipActive, phase]);

  useLayoutEffect(() => {
    const headline = headlineRef.current;
    const anchor = headlineAnchorRef.current;

    if (!isHeadlineFlipActive || !headlineStartAnchor || !headline || !anchor) {
      if (!isHeadlineFlipActive) {
        setHeadlineFlip(null);
      }
      return;
    }

    const headlineRect = headline.getBoundingClientRect();
    const currentTranslate = getTranslate(window.getComputedStyle(headline).transform);
    const anchorRect = anchor.getBoundingClientRect();
    const nextFlip = {
      x: Math.round(anchorRect.left - (headlineRect.left - currentTranslate.x)),
      y: Math.round(anchorRect.top - (headlineRect.top - currentTranslate.y))
    };

    setHeadlineFlip((current) =>
      current?.x === nextFlip.x && current?.y === nextFlip.y ? current : nextFlip
    );
  }, [headlineStartAnchor, isHeadlineFlipActive, phase]);

  return (
    <section
      id="start"
      className={`hero-viewport relative isolate overflow-hidden ${heroBackgroundClass}`}
    >
      <div
        className={`absolute inset-0 bg-technical-grid bg-[size:44px_44px] ${showInterface ? "hero-stage-content-in" : "hero-stage-hidden"}`}
        style={{ "--hero-content-opacity": "0.34" }}
      />
      <div className={`absolute inset-x-0 top-0 h-px bg-brand-orange ${showInterface ? "hero-stage-content-in" : "hero-stage-hidden"}`} />
      <div className={`absolute right-[-14rem] top-20 hidden h-[34rem] w-[34rem] border border-white/10 lg:block ${showInterface ? "hero-stage-content-in" : "hero-stage-hidden"}`} />
      <div className={`absolute right-20 top-28 hidden h-px w-72 rotate-[18deg] bg-white/15 lg:block ${showInterface ? "hero-stage-content-in" : "hero-stage-hidden"}`} />
      <div className={`absolute right-36 top-64 hidden h-px w-80 -rotate-[12deg] bg-white/10 lg:block ${showInterface ? "hero-stage-content-in" : "hero-stage-hidden"}`} />
      <Image
        src="/brand/ratio-symbol-background.png"
        alt=""
        width={977}
        height={544}
        sizes="(min-width: 1280px) 736px, 0px"
        className={`pointer-events-none absolute right-[-18rem] top-24 hidden w-[46rem] max-w-none xl:block ${showInterface ? "hero-stage-content-in" : "hero-stage-hidden"}`}
        style={{ "--hero-content-opacity": "0.025" }}
      />

      {showFloatingLogo && logoGeometry ? (
        <div
          ref={floatingLogoRef}
          className="intro-floating-logo"
          style={floatingLogoStyle}
          onTransitionEnd={onLogoTransitionEnd}
          aria-hidden="true"
        >
          <IntroLogoVideo
            showFinalFrame={isMoving}
            onEnded={onVideoEnd}
            onError={onVideoError}
          />
        </div>
      ) : null}

      {isHeadlineFlipActive && headlineStartAnchor ? (
        <div
          ref={headlineAnchorRef}
          className="intro-headline-start-anchor"
          style={{ left: headlineStartAnchor.left, top: headlineStartAnchor.top }}
          aria-hidden="true"
        />
      ) : null}

      <div className="hero-viewport hero-viewport-content section-shell relative grid items-center gap-14 py-16 lg:grid-cols-[1.02fr_0.98fr] lg:py-20">
        <div className="relative max-w-3xl">
          <div
            ref={logoSourceRef}
            className={`intro-logo-slot mb-8 aspect-[22/7] w-full max-w-[30rem] sm:max-w-[34rem] ${showHeadline ? "intro-logo-slot--released" : ""}`}
            aria-hidden="true"
          />

          <h1
            ref={headlineRef}
            className={`intro-headline max-w-4xl text-balance text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl intro-headline--${phase}`}
            style={{
              "--intro-headline-duration": `${INTRO_TIMING.headline}ms`,
              "--intro-move-duration": `${INTRO_TIMING.logoMove}ms`,
              ...(isHeadlineFlipActive && headlineFlip
                ? {
                    "--intro-headline-flip-x": `${headlineFlip.x}px`,
                    "--intro-headline-flip-y": `${headlineFlip.y}px`
                  }
                : {})
            }}
            onAnimationEnd={onHeadlineAnimationEnd}
          >
            {content.headline}
          </h1>

          <div
            className={`mt-8 ${showInterface ? "hero-stage-left-in" : "hero-stage-hidden"}`}
            aria-hidden={showInterface ? undefined : "true"}
            inert={showInterface ? undefined : true}
          >
            <p className="inline-flex max-w-full items-center border border-brand-orange/40 bg-brand-orange/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-orange">
              {content.badge}
            </p>
            <div className="mt-6 max-w-xl">
              <LoxonePartner content={partner} />
            </div>
          </div>
        </div>

        <div className="max-w-3xl">
          <div
            className={showInterface ? "hero-stage-content-in" : "hero-stage-hidden"}
            aria-hidden={showInterface ? undefined : "true"}
            inert={showInterface ? undefined : true}
          >
            <p className="max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
              {content.text}
            </p>
            <p className="mt-3 text-sm font-medium text-brand-orange">
              {content.serviceArea}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#kontakt" className="btn-primary">
                {content.primaryCta}
                <ArrowRight size={18} aria-hidden="true" />
              </a>
              {showHomepagePortfolio ? (
                <a href={content.projectsHref || "#realizacje"} className="btn-secondary">
                  {content.secondaryCta}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
