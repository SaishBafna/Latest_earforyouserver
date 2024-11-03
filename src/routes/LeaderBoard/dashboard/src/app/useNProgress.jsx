"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import nProgress from "nprogress";
import "nprogress/nprogress.css";
import { useEffect, Suspense } from "react";
import "./globals.css";

export function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const _push = router.push.bind(router);

    router.push = (href, options) => {
      nProgress.start();
      _push(href, options);
    };
  }, [router]);

  useEffect(() => {
    nProgress.done();
  }, [pathname, searchParams]);

  return null;
}

export default function PageWithNavigation() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NavigationEvents />
    </Suspense>
  );
}
