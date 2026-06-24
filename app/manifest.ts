import type { MetadataRoute } from "next";
import { COMPANY } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${COMPANY.name} — ${COMPANY.legalTagline}`,
    short_name: COMPANY.name,
    description: COMPANY.legalTagline,
    start_url: "/",
    display: "standalone",
    background_color: "#04101f",
    theme_color: "#071a2f",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
