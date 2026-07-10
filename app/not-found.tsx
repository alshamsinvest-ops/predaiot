import Link from "next/link";
import "./globals.css";

// Root-level not-found (e.g. unknown locale). Must render its own document
// because the root layout is a pass-through.
export default function NotFound() {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-[#04101f] text-[#e8eef6]">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-[#00b2ff]">404</h1>
          <p className="mt-3 text-[#93a4ba]">Page not found.</p>
          <Link href="/en" className="mt-6 inline-block rounded-full bg-[#00e676] px-6 py-3 font-semibold text-[#04101f]">
            Go home
          </Link>
        </div>
      </body>
    </html>
  );
}
