import type { ReactNode } from "react";
import "./globals.css";

// Root layout is a pass-through; the <html> document is rendered by the
// locale layout (app/[locale]/layout.tsx) so lang/dir can be set per locale.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
