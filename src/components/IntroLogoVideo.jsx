"use client";

import { useEffect, useRef } from "react";

const VIDEO_SCALE = 1.42;
const MAX_CANVAS_PIXEL_RATIO = 1.5;

export default function IntroLogoVideo({ showFinalFrame = false, onEnded, onError }) {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    let animationFrameId = null;
    let videoFrameId = null;
    let disposed = false;

    function drawFrame() {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (width && height && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        const pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_CANVAS_PIXEL_RATIO);
        const pixelWidth = Math.round(width * pixelRatio);
        const pixelHeight = Math.round(height * pixelRatio);

        if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
          canvas.width = pixelWidth;
          canvas.height = pixelHeight;
        }

        const context = canvas.getContext("2d");
        if (!context) {
          return;
        }

        const drawWidth = width * VIDEO_SCALE;
        const drawHeight = drawWidth * (video.videoHeight / video.videoWidth);

        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        context.clearRect(0, 0, width, height);
        context.drawImage(video, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
      }
    }

    function cancelScheduledFrame() {
      if (videoFrameId !== null && typeof video.cancelVideoFrameCallback === "function") {
        video.cancelVideoFrameCallback(videoFrameId);
        videoFrameId = null;
      }

      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    }

    function scheduleNextFrame() {
      if (
        disposed ||
        document.hidden ||
        video.paused ||
        video.ended ||
        videoFrameId !== null ||
        animationFrameId !== null
      ) {
        return;
      }

      if (typeof video.requestVideoFrameCallback === "function") {
        videoFrameId = video.requestVideoFrameCallback(() => {
          videoFrameId = null;
          drawFrame();
          scheduleNextFrame();
        });
        return;
      }

      animationFrameId = window.requestAnimationFrame(() => {
        animationFrameId = null;
        drawFrame();
        scheduleNextFrame();
      });
    }

    function renderAndContinue() {
      cancelScheduledFrame();
      drawFrame();
      scheduleNextFrame();
    }

    function stopAndRender() {
      cancelScheduledFrame();
      drawFrame();
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        cancelScheduledFrame();
        video.pause();
        return;
      }

      if (!showFinalFrame && !video.ended) {
        video.play().catch(() => {});
      }
      renderAndContinue();
    }

    video.addEventListener("play", renderAndContinue);
    video.addEventListener("loadeddata", renderAndContinue);
    video.addEventListener("pause", stopAndRender);
    video.addEventListener("ended", stopAndRender);
    video.addEventListener("seeked", stopAndRender);
    window.addEventListener("resize", renderAndContinue);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    renderAndContinue();

    return () => {
      disposed = true;
      cancelScheduledFrame();
      video.removeEventListener("play", renderAndContinue);
      video.removeEventListener("loadeddata", renderAndContinue);
      video.removeEventListener("pause", stopAndRender);
      video.removeEventListener("ended", stopAndRender);
      video.removeEventListener("seeked", stopAndRender);
      window.removeEventListener("resize", renderAndContinue);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [showFinalFrame]);

  useEffect(() => {
    if (!showFinalFrame) {
      return undefined;
    }

    const video = videoRef.current;

    function finishVideo() {
      if (!Number.isFinite(video.duration)) {
        return;
      }

      video.currentTime = Math.max(video.duration - 0.04, 0);
      video.pause();
    }

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
      finishVideo();
      return undefined;
    }

    video.addEventListener("loadedmetadata", finishVideo, { once: true });
    return () => video.removeEventListener("loadedmetadata", finishVideo);
  }, [showFinalFrame]);

  return (
    <>
      <canvas ref={canvasRef} className="intro-logo-canvas" aria-hidden="true" />
      <video
        ref={videoRef}
        className="intro-logo-media-source"
        src="/brand/animacja_logo_ratio.mp4"
        autoPlay
        muted
        playsInline
        preload="metadata"
        controlsList="nodownload nofullscreen noremoteplayback"
        disablePictureInPicture
        disableRemotePlayback
        tabIndex={-1}
        onEnded={onEnded}
        onError={onError}
      />
    </>
  );
}
