"use client";

import { useCallback, useEffect, useState } from "react";

export const INTRO_TIMING = {
  headline: 1100,
  logoMove: 2700,
  logoHandoff: 180,
  interfaceRevealLead: 1500,
  fallback: {
    logo: 8000,
    headline: 1600,
    moving: 2200,
    interface: 900
  }
};

function isFinalPhase(phase) {
  return phase === "interface" || phase === "complete";
}

export default function useIntroAnimation({ logoSourceRef, logoTargetRef }) {
  const [phase, setPhase] = useState("checking");
  const [logoGeometry, setLogoGeometry] = useState(null);
  const [interfaceRevealStarted, setInterfaceRevealStarted] = useState(false);
  const [introSkipped, setIntroSkipped] = useState(false);
  const [logoHandoffComplete, setLogoHandoffComplete] = useState(false);

  const measureLogo = useCallback(() => {
    const source = logoSourceRef.current;
    const target = logoTargetRef.current;

    if (!source || !target) {
      return;
    }

    const sourceRect = source.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    if (!sourceRect.width || !sourceRect.height || !targetRect.width || !targetRect.height) {
      return;
    }

    setLogoGeometry({
      left: sourceRect.left,
      top: sourceRect.top,
      width: sourceRect.width,
      height: sourceRect.height,
      translateX: targetRect.left - sourceRect.left,
      translateY: targetRect.top - sourceRect.top,
      scaleX: targetRect.width / sourceRect.width,
      scaleY: targetRect.height / sourceRect.height
    });
  }, [logoSourceRef, logoTargetRef]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotion.matches) {
      setPhase("complete");
      return undefined;
    }

    const frame = window.requestAnimationFrame(() => {
      measureLogo();
      setPhase("logo");
    });

    return () => window.cancelAnimationFrame(frame);
  }, [measureLogo]);

  useEffect(() => {
    if (phase === "checking" || phase === "complete") {
      return undefined;
    }

    const timeout = phase === "moving" ? INTRO_TIMING.logoMove + 500 : INTRO_TIMING.fallback[phase];
    const timer = window.setTimeout(() => {
      setPhase((current) => {
        if (current !== phase) return current;
        if (current === "logo") return "headline";
        if (current === "headline") return "moving";
        if (current === "moving") return "interface";
        return "complete";
      });
    }, timeout);

    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "logo") {
      return undefined;
    }

    function handleResize() {
      measureLogo();
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [measureLogo, phase]);

  useEffect(() => {
    if (phase !== "moving") {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setInterfaceRevealStarted(true);
    }, Math.max(0, INTRO_TIMING.logoMove - INTRO_TIMING.interfaceRevealLead));

    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "logo" && phase !== "headline" && phase !== "moving") {
      return undefined;
    }

    function skipIntro(event) {
      if (event.type === "keydown") {
        const target = event.target;
        const isEditing =
          target instanceof HTMLElement &&
          (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
        const scrollKeys = ["ArrowDown", "PageDown", "End", " "];

        if (isEditing || !scrollKeys.includes(event.key)) {
          return;
        }
      }

      setIntroSkipped(true);
      setInterfaceRevealStarted(true);
      setPhase((current) =>
        current === "logo" || current === "headline" ? "moving" : current
      );
    }

    window.addEventListener("wheel", skipIntro, { passive: true });
    window.addEventListener("touchmove", skipIntro, { passive: true });
    window.addEventListener("scroll", skipIntro, { passive: true });
    window.addEventListener("keydown", skipIntro);

    return () => {
      window.removeEventListener("wheel", skipIntro);
      window.removeEventListener("touchmove", skipIntro);
      window.removeEventListener("scroll", skipIntro);
      window.removeEventListener("keydown", skipIntro);
    };
  }, [phase]);

  const showHeadline = phase === "headline" || phase === "moving" || isFinalPhase(phase);
  const showInterface = interfaceRevealStarted || isFinalPhase(phase);

  return {
    phase,
    logoGeometry,
    showHeadline,
    showInterface,
    introSkipped,
    logoHandoffComplete,
    introComplete: phase === "complete",
    onVideoEnd: () => setPhase((current) => (current === "logo" ? "headline" : current)),
    onVideoError: () => setPhase((current) => (current === "logo" ? "headline" : current)),
    onHeadlineAnimationEnd: () => setPhase((current) => (current === "headline" ? "moving" : current)),
    onLogoTransitionEnd: (event) => {
      if (event.target !== event.currentTarget) {
        return;
      }

      if (event.propertyName === "transform") {
        setPhase((current) => (current === "moving" ? "interface" : current));
      }

      if (event.propertyName === "opacity") {
        setLogoHandoffComplete(true);
      }
    }
  };
}
