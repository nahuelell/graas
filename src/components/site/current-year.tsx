"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

export function CurrentYear() {
  const year = useSyncExternalStore(noop, () => new Date().getFullYear(), () => null);
  return <>{year ?? ""}</>;
}
