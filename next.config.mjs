import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  poweredByHeader: false,
  async headers() {
    const securityHeaders = [
      {
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          "base-uri 'self'",
          "object-src 'none'",
          "frame-ancestors 'none'",
          "form-action 'self'",
          "img-src 'self' data: blob: https://a.storyblok.com",
          "media-src 'self' blob:",
          `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
          "style-src 'self' 'unsafe-inline'",
          "font-src 'self' data:",
          "connect-src 'self' https://*.ingest.de.sentry.io",
          "worker-src 'self' blob:"
        ].join("; ")
      },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), geolocation=(), microphone=(), payment=(), usb=()"
      },
      ...(process.env.NODE_ENV === "production"
        ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }]
        : [])
    ];

    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/brand/:path*.mp4",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }]
      }
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "a.storyblok.com",
        pathname: "/f/**"
      }
    ]
  }
};

export default withSentryConfig(nextConfig, {
  silent: true,
  telemetry: false,
  suppressOnRouterTransitionStartWarning: true,
  sourcemaps: {
    disable: true
  },
  bundleSizeOptimizations: {
    excludeTracing: true
  },
  routeManifestInjection: false
});
