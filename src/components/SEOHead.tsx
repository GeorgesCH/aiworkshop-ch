import { useEffect } from "react";
import type { Page } from "./router/types";
import { applySEO } from "../utils/seo";

interface SEOHeadProps {
  page: Page;
  language: string;
}

export function SEOHead({ page, language }: SEOHeadProps) {
  useEffect(() => {
    // Apply SEO tags whenever page or language changes
    applySEO(page, language);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, language]);

  // Also apply immediately on mount to ensure tags are set quickly
  useEffect(() => {
    applySEO(page, language);
  }, []);

  return null;
}
