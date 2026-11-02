"use client";

import Image from "next/image";
import Link from "next/link";
import { Instagram, Linkedin, Menu, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { visibleSocialLinks } from "@/data/socialLinks";
import { locales } from "@/i18n/config";

const HEADER_REVEAL_DELAY_MS = 100;
const SCROLL_REVEAL_THRESHOLD = 12;
const SOCIAL_REVEAL_DELAY_MS = 0;
const SOCIAL_STAGGER_MS = 220;
const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function localizedHref(locale, href) {
  return `/${locale}${href}`;
}

function TikTokIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M16.6 3.4c.3 2.15 1.55 3.52 3.75 4.08v3.34a7.15 7.15 0 0 1-3.7-1.13v5.98c0 3.3-2.25 5.93-5.8 5.93-3.28 0-5.65-2.3-5.65-5.3 0-3.38 2.74-5.74 6.23-5.24v3.45c-1.5-.48-2.72.35-2.72 1.74 0 1.03.82 1.84 2.04 1.84 1.36 0 2.2-.82 2.2-2.5V3.4h3.65Z" />
    </svg>
  );
}

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M14.2 8.15V6.7c0-.7.47-.86.8-.86h2.05V2.72L14.23 2.7c-3.13 0-3.84 2.34-3.84 3.84v1.61H8.35v3.18h2.04v9.97h3.81v-9.97h2.56l.34-3.18h-2.9Z" />
    </svg>
  );
}

const socialItems = [
  { key: "facebook", Icon: FacebookIcon },
  { key: "instagram", Icon: Instagram },
  { key: "tiktok", Icon: TikTokIcon },
  { key: "linkedin", Icon: Linkedin }
].filter(({ key }) => visibleSocialLinks[key]);

export default function Navbar({ locale, content, headerReady = true, introComplete = true, logoTargetRef }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hash, setHash] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrollRevealed, setIsScrollRevealed] = useState(false);
  const [hasSocialIntroStarted, setHasSocialIntroStarted] = useState(false);
  const [socialStartDistances, setSocialStartDistances] = useState({});
  const [mobileNavHeight, setMobileNavHeight] = useState(0);
  const loadTimeRef = useRef(Date.now());
  const socialRefs = useRef({});
  const navRef = useRef(null);
  const menuToggleRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const wasMenuOpenRef = useRef(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      wasMenuOpenRef.current = true;
      return;
    }

    if (!wasMenuOpenRef.current) {
      return;
    }

    wasMenuOpenRef.current = false;
    window.requestAnimationFrame(() => menuToggleRef.current?.focus());
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const menu = mobileMenuRef.current;
    const focusable = () => Array.from(menu?.querySelectorAll(focusableSelector) || []);
    const first = focusable()[0];

    first?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const items = focusable();

      if (!items.length) {
        event.preventDefault();
        return;
      }

      const firstItem = items[0];
      const lastItem = items[items.length - 1];

      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isVisible) {
      setIsOpen(false);
    }
  }, [isVisible]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function updateMobileNavHeight() {
      const height = navRef.current?.getBoundingClientRect().height;

      if (height) {
        setMobileNavHeight(Math.ceil(height));
      }
    }

    updateMobileNavHeight();
    const observer = typeof ResizeObserver === "undefined"
      ? null
      : new ResizeObserver(updateMobileNavHeight);

    if (navRef.current) {
      observer?.observe(navRef.current);
    }

    window.addEventListener("resize", updateMobileNavHeight);
    window.addEventListener("orientationchange", updateMobileNavHeight);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", updateMobileNavHeight);
      window.removeEventListener("orientationchange", updateMobileNavHeight);
    };
  }, [isOpen]);

  useEffect(() => {
    function updateSocialStartDistances() {
      const distances = {};

      socialItems.forEach(({ key }) => {
        const element = socialRefs.current[key];

        if (element) {
          const rect = element.getBoundingClientRect();
          distances[key] = Math.max(window.innerWidth - rect.right, 0);
        }
      });

      setSocialStartDistances(distances);
    }

    updateSocialStartDistances();
    window.addEventListener("resize", updateSocialStartDistances);
    return () => window.removeEventListener("resize", updateSocialStartDistances);
  }, []);

  useEffect(() => {
    function updateHash() {
      setHash(window.location.hash || "");
    }

    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function updateFromScroll() {
      const scrolledPastThreshold = window.scrollY > SCROLL_REVEAL_THRESHOLD;
      setIsScrolled(scrolledPastThreshold);
      if (scrolledPastThreshold && (headerReady || introComplete)) {
        setIsScrollRevealed(true);
        setIsVisible(true);
        setHasSocialIntroStarted(true);
      }
    }

    if (reducedMotion.matches) {
      setIsVisible(true);
      setHasSocialIntroStarted(true);
    } else if (window.scrollY > SCROLL_REVEAL_THRESHOLD && (headerReady || introComplete)) {
      setIsScrollRevealed(true);
      setIsVisible(true);
      setHasSocialIntroStarted(true);
    }

    updateFromScroll();
    window.addEventListener("scroll", updateFromScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateFromScroll);
    };
  }, [headerReady, introComplete]);

  useEffect(() => {
    if (isVisible || !headerReady) {
      return undefined;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotion.matches) {
      setIsVisible(true);
      return undefined;
    }

    // Once the hero intro is complete, reveal at the original 3s mark or immediately if it has passed.
    const elapsedMs = Date.now() - loadTimeRef.current;
    const revealDelayMs = Math.max(HEADER_REVEAL_DELAY_MS - elapsedMs, 0);
    const revealTimer = window.setTimeout(() => {
      setIsVisible(true);
      setHasSocialIntroStarted(true);
    }, revealDelayMs);

    return () => window.clearTimeout(revealTimer);
  }, [headerReady, isVisible]);

  useEffect(() => {
    const canStartSocialIntro = isVisible && (headerReady || introComplete || isScrollRevealed);

    if (!canStartSocialIntro || hasSocialIntroStarted) {
      return undefined;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotion.matches) {
      setHasSocialIntroStarted(true);
      return undefined;
    }

    if (SOCIAL_REVEAL_DELAY_MS === 0) {
      setHasSocialIntroStarted(true);
      return undefined;
    }

    const socialTimer = window.setTimeout(() => setHasSocialIntroStarted(true), SOCIAL_REVEAL_DELAY_MS);
    return () => window.clearTimeout(socialTimer);
  }, [hasSocialIntroStarted, headerReady, introComplete, isScrollRevealed, isVisible]);

  const languageLinks = useMemo(
    () =>
      locales.map((targetLocale) => ({
        locale: targetLocale,
        href: `/${targetLocale}${hash}`,
        active: targetLocale === locale
      })),
    [hash, locale]
  );

  const headerStateClass = isScrolled
    ? "border-brand-orange/45 bg-brand-black/72 shadow-[0_14px_40px_rgba(255,103,0,0.08)] backdrop-blur-md"
    : "border-white/10 bg-brand-black backdrop-blur-0";
  const headerVisible = isVisible || introComplete;
  const animateHeaderEntrance = isVisible && !introComplete;
  const socialVisible = hasSocialIntroStarted;

  function toggleMobileMenu() {
    if (!isOpen) {
      const height = navRef.current?.getBoundingClientRect().height;
      setMobileNavHeight(height ? Math.ceil(height) : 0);
    }

    setIsOpen((value) => !value);
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b motion-reduce:transition-none ${introComplete ? "transition-none" : "transition-[opacity,background-color,border-color,box-shadow,backdrop-filter] duration-200 ease-out"} ${headerStateClass} ${
        headerVisible ? `${animateHeaderEntrance ? "header-reveal" : ""} opacity-100` : "pointer-events-none opacity-0"
      }`}
      aria-hidden={headerVisible ? undefined : "true"}
      inert={headerVisible ? undefined : true}
    >
      <nav
        ref={navRef}
        className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-5 px-5 sm:px-8"
        aria-label={content.aria}
      >
        <Link href={`/${locale}#start`} className="focus-ring flex shrink-0 items-center">
          <Image
            ref={logoTargetRef}
            src="/brand/logo_ratio_białe.png"
            alt="RATIO Smart Innovations"
            width={520}
            height={165}
            priority
            sizes="(max-width: 640px) 176px, 208px"
            className={`h-11 w-auto object-contain transition-opacity duration-150 sm:h-12 ${headerReady ? "opacity-100" : "opacity-0"}`}
          />
        </Link>

        <div className={`hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex ${animateHeaderEntrance ? "header-item-reveal" : ""}`}>
          {content.items.map((item) => (
            <Link key={item.href} href={localizedHref(locale, item.href)} className="nav-link">
              {item.label}
            </Link>
          ))}
        </div>

        <div className={`hidden shrink-0 items-center gap-3 lg:flex ${animateHeaderEntrance ? "header-item-reveal" : ""}`}>
          <div className="flex border border-white/10 text-xs font-semibold uppercase" aria-label={content.languageLabel}>
            {languageLinks.map((item) => (
              <Link
                key={item.locale}
                href={item.href}
                prefetch={false}
                className={`focus-ring px-3 py-2 transition ${
                  item.active ? "bg-brand-orange text-brand-black" : "hover-fine-navbar-language text-white/70"
                }`}
                aria-current={item.active ? "page" : undefined}
              >
                {item.locale}
              </Link>
            ))}
          </div>

          {/* <Link href={localizedHref(locale, "#kontakt")} className="btn-primary">
            {content.cta}
          </Link> */}

          <div className="flex items-center gap-2" aria-label={locale === "pl" ? "Media społecznościowe" : "Social media"}>
            {socialItems.map(({ key, Icon }, index) => {
              const item = visibleSocialLinks[key];
              const socialDelayMs = (socialItems.length - index - 1) * SOCIAL_STAGGER_MS;
              return (
                <span
                  key={key}
                  ref={(element) => {
                    socialRefs.current[key] = element;
                  }}
                  className={`social-entrance ${socialVisible ? "social-entrance--visible" : ""}`}
                  style={{
                    "--social-delay": `${socialDelayMs}ms`,
                    "--social-start-distance": `${socialStartDistances[key] ?? 0}px`
                  }}
                  aria-hidden={socialVisible ? undefined : "true"}
                >
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.ariaLabel[locale] || item.ariaLabel.en}
                    tabIndex={socialVisible ? undefined : -1}
                    className="hover-fine-navbar-social focus-ring inline-flex h-10 w-10 items-center justify-center border border-white/15 text-white/70 transition duration-200 ease-out focus-visible:-translate-y-0.5 focus-visible:border-brand-orange/70 focus-visible:text-brand-orange focus-visible:shadow-[0_0_18px_rgba(255,103,0,0.22)] motion-reduce:transform-none"
                  >
                    <Icon size={18} />
                  </a>
                </span>
              );
            })}
          </div>
        </div>

        <button
          ref={menuToggleRef}
          type="button"
          className={`hover-fine-navbar-menu-toggle focus-ring inline-flex h-11 w-11 items-center justify-center border border-white/15 text-white transition duration-200 ease-out lg:hidden ${animateHeaderEntrance ? "header-item-reveal" : ""}`}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? content.close : content.open}
          onClick={toggleMobileMenu}
        >
          {isOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </nav>

      {isOpen ? (
        <div
          id="mobile-menu"
          ref={mobileMenuRef}
          className="overflow-y-auto overscroll-contain border-t border-white/10 bg-brand-black px-5 pt-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] lg:hidden"
          style={{ height: `calc(100dvh - ${mobileNavHeight}px)`, maxHeight: `calc(100dvh - ${mobileNavHeight}px)` }}
        >
          <div className="mx-auto grid max-w-7xl gap-2">
            {content.items.map((item) => (
              <Link key={item.href} href={localizedHref(locale, item.href)} className="hover-fine-navbar-menu-link focus-ring border border-white/10 px-4 py-3 text-sm font-medium text-white/80 transition" onClick={() => setIsOpen(false)}>
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex border border-white/10 text-xs font-semibold uppercase" aria-label={content.languageLabel}>
              {languageLinks.map((item) => (
                <Link key={item.locale} href={item.href} prefetch={false} className={`focus-ring flex-1 px-3 py-3 text-center transition ${item.active ? "bg-brand-orange text-brand-black" : "hover-fine-navbar-language text-white/70"}`} aria-current={item.active ? "page" : undefined} onClick={() => setIsOpen(false)}>
                  {item.locale}
                </Link>
              ))}
            </div>
            <div
              className={`mt-2 items-center gap-2 ${socialVisible ? "flex" : "hidden"}`}
              aria-hidden={socialVisible ? undefined : "true"}
            >
              {socialItems.map(({ key, Icon }) => {
                const item = visibleSocialLinks[key];
                return (
                  <a key={key} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.ariaLabel[locale] || item.ariaLabel.en} className="hover-fine-navbar-social focus-ring inline-flex h-11 w-11 items-center justify-center border border-white/15 text-white/70 transition duration-200 ease-out focus-visible:-translate-y-0.5 focus-visible:border-brand-orange/70 focus-visible:text-brand-orange motion-reduce:transform-none">
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
            <Link href={localizedHref(locale, "#kontakt")} className="btn-primary mt-2 justify-center" onClick={() => setIsOpen(false)}>
              {content.cta}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
