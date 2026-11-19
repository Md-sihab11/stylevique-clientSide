"use client";

import { useSyncExternalStore } from "react";

/** No external system to subscribe to; the year only changes on reload. */
const subscribe = () => () => {};

/**
 * The client snapshot is the real year, while the server snapshot keeps the
 * prerender stable. Next.js 16 cannot prerender `new Date()` inside a server or
 * client component, so reading it through `useSyncExternalStore` avoids both
 * the prerender error and an effect-based state update.
 */
const getClientYear = () => String(new Date().getFullYear());
const getServerYear = () => "2026";

export function CopyrightYear() {
  const year = useSyncExternalStore(subscribe, getClientYear, getServerYear);

  return <>{year}</>;
}
