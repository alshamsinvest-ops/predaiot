"use client";

import dynamic from "next/dynamic";
import LiveSkeleton from "./LiveSkeleton";

const LivePlatform = dynamic(() => import("./LivePlatform"), {
  ssr: false,
  loading: () => <LiveSkeleton />,
});

export default function LivePlatformClient({ locale }: { locale: string }) {
  return <LivePlatform locale={locale} />;
}
