import { i18n } from "@/i18n";

// Force English locale for deterministic test results.
// Without this, DEFAULT_LOCALE="ru" makes t() return Russian strings
// while tests assert English text.
// Must await i18n.init() first because it's called with `void` in i18n/index.ts
// (fire-and-forget), so changeLanguage might race with init completion.
await i18n.init();
await i18n.changeLanguage("en");
(i18n.options as Record<string, unknown>).fallbackLng = false;

const storageEntries = new Map<string, string>();

function installStorageMock(target: Record<string, unknown>) {
  Object.defineProperty(target, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => storageEntries.get(key) ?? null,
      setItem: (key: string, value: string) => {
        storageEntries.set(key, String(value));
      },
      removeItem: (key: string) => {
        storageEntries.delete(key);
      },
      clear: () => {
        storageEntries.clear();
      },
    },
  });
}

if (
  typeof globalThis.localStorage?.getItem !== "function"
  || typeof globalThis.localStorage?.setItem !== "function"
  || typeof globalThis.localStorage?.removeItem !== "function"
  || typeof globalThis.localStorage?.clear !== "function"
) {
  installStorageMock(globalThis);
}

if (typeof window !== "undefined" && window.localStorage !== globalThis.localStorage) {
  installStorageMock(window as unknown as Record<string, unknown>);
}
