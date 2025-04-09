'use client';

import dynamic from "next/dynamic";

const NotFoundClient = dynamic(() => import("@/components/not-found/not-found-client"), {
  ssr: false, // supaya di-render hanya di client
});

export default function NotFoundPage() {
  return <NotFoundClient />;
}
