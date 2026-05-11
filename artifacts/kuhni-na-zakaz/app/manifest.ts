import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "КухниBY",
    short_name: "КухниBY",
    description:
      "Кухни на заказ по Беларуси с замером, проектом и расчетом по условиям заявки.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#F05A28",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
