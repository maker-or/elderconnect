import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from "react";
import { AppState, AppStateStatus } from "react-native";
import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";
import * as SecureStore from "expo-secure-store";
import { LanguageCode, SUPPORTED_LANGUAGES, translations } from "./translations";

const LANGUAGE_STORAGE_KEY = "elderconnect.language";
const DEFAULT_LANGUAGE: LanguageCode = "en";

const i18n = new I18n(translations);
i18n.enableFallback = true;
i18n.defaultLocale = DEFAULT_LANGUAGE;

const supportedCodes = new Set(SUPPORTED_LANGUAGES.map((item) => item.code));

const normalizeLocale = (languageTag?: string | null): LanguageCode => {
  const normalized = languageTag?.toLowerCase();
  if (!normalized) return DEFAULT_LANGUAGE;
  const base = normalized.split("-")[0] as LanguageCode;
  return supportedCodes.has(base) ? base : DEFAULT_LANGUAGE;
};

const getDeviceLanguage = (): LanguageCode => {
  const locale = getLocales()[0];
  return normalizeLocale(locale?.languageTag ?? locale?.languageCode);
};

type LocalizationContextValue = {
  locale: LanguageCode;
  setLocale: (locale: LanguageCode) => Promise<void>;
  t: (key: string, options?: Record<string, unknown>) => string;
  ready: boolean;
};

const LocalizationContext = createContext<LocalizationContextValue | null>(null);

export function LocalizationProvider({ children }: PropsWithChildren) {
  const [locale, setLocaleState] = useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [ready, setReady] = useState(false);
  const [hasUserOverride, setHasUserOverride] = useState(false);

  useEffect(() => {
    i18n.locale = locale;
  }, [locale]);

  useEffect(() => {
    const bootstrap = async () => {
      const savedLocale = await SecureStore.getItemAsync(LANGUAGE_STORAGE_KEY);
      if (savedLocale && supportedCodes.has(savedLocale as LanguageCode)) {
        setLocaleState(savedLocale as LanguageCode);
        setHasUserOverride(true);
      } else {
        setLocaleState(getDeviceLanguage());
      }
      setReady(true);
    };

    bootstrap();
  }, []);

  useEffect(() => {
    const onAppStateChange = (state: AppStateStatus) => {
      if (state !== "active" || hasUserOverride) return;
      setLocaleState(getDeviceLanguage());
    };

    const sub = AppState.addEventListener("change", onAppStateChange);
    return () => sub.remove();
  }, [hasUserOverride]);

  const setLocale = async (nextLocale: LanguageCode) => {
    setLocaleState(nextLocale);
    setHasUserOverride(true);
    await SecureStore.setItemAsync(LANGUAGE_STORAGE_KEY, nextLocale);
  };

  const value = useMemo<LocalizationContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key, options) => i18n.t(key, options) as string,
      ready,
    }),
    [locale, ready]
  );

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization() {
  const ctx = useContext(LocalizationContext);
  if (!ctx) {
    throw new Error("useLocalization must be used within LocalizationProvider");
  }
  return ctx;
}

export { SUPPORTED_LANGUAGES };
