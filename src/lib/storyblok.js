import "server-only";

import { apiPlugin, storyblokInit } from "@storyblok/react/rsc";

const deliveryToken = process.env.STORYBLOK_DELIVERY_API_TOKEN;

export const isStoryblokConfigured = Boolean(deliveryToken);

const createStoryblokApi = isStoryblokConfigured
  ? storyblokInit({
      accessToken: deliveryToken,
      use: [apiPlugin],
      bridge: false,
      apiOptions: {
        region: process.env.STORYBLOK_REGION || "eu"
      }
    })
  : null;

export function getStoryblokApi() {
  return createStoryblokApi?.() ?? null;
}
