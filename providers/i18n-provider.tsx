'use client';

import { appWithTranslation } from 'next-i18next';
import { useTranslation } from 'next-i18next';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useI18n() {
  return useTranslation();
}