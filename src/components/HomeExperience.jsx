"use client";

import { useEffect, useRef } from "react";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import useIntroAnimation from "@/hooks/useIntroAnimation";

export default function HomeExperience({ children, locale, messages, nav = messages.nav, showHomepagePortfolio = true }) {
  const logoSourceRef = useRef(null);
  const logoTargetRef = useRef(null);
  const intro = useIntroAnimation({ logoSourceRef, logoTargetRef });

  useEffect(() => {
    const introBackgroundClasses = [
      "ratio-intro-checking",
      "ratio-intro-logo",
      "ratio-intro-headline",
      "ratio-intro-moving",
      "ratio-intro-interface"
    ];
    const currentClass = `ratio-intro-${intro.phase}`;

    document.documentElement.classList.remove(...introBackgroundClasses);
    if (introBackgroundClasses.includes(currentClass)) {
      document.documentElement.classList.add(currentClass);
    }

    return () => document.documentElement.classList.remove(currentClass);
  }, [intro.phase]);

  return (
    <>
      <Navbar
        locale={locale}
        content={nav}
        headerReady={intro.showInterface}
        introComplete={intro.introComplete}
        logoTargetRef={logoTargetRef}
      />
      <main id="main-content">
        <Hero
          content={messages.hero}
          partner={messages.partner}
          intro={intro}
          logoSourceRef={logoSourceRef}
          showHomepagePortfolio={showHomepagePortfolio}
        />
        {children}
      </main>
    </>
  );
}
