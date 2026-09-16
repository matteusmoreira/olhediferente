import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";

/** Chave única usada para as configurações gerais do projeto. */
export const SITE_SETTINGS_KEY = "general";

export type SiteSettings = {
  projectName: string;
  teacherName: string;
  adminEmail: string;
  baseUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  footerText: string;
};

export const siteDefaults: SiteSettings = {
  projectName: "OLHE DIFERENTE",
  teacherName: "Marcos Dias",
  adminEmail: "",
  baseUrl: "https://www.enelcursosdeterapias.com.br",
  ogTitle: "OLHE DIFERENTE — Aula gratuita de Iridologia com o Prof. Marcos Dias",
  ogDescription:
    "Aula online e gratuita sobre Iridologia: aprenda a desenvolver um olhar clínico integrativo com o Professor Marcos Dias, com quase 30 anos de ensino e prática.",
  ogImage: "https://www.enelcursosdeterapias.com.br/og-image.jpg",
  footerText: "",
};

export function mapSiteSettings(value: unknown): SiteSettings {
  const data =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};
  const str = (key: keyof SiteSettings, fallback: string) =>
    typeof data[key] === "string" && (data[key] as string).trim()
      ? (data[key] as string).trim()
      : fallback;

  return {
    projectName: str("projectName", siteDefaults.projectName),
    teacherName: str("teacherName", siteDefaults.teacherName),
    adminEmail: str("adminEmail", siteDefaults.adminEmail),
    baseUrl: str("baseUrl", siteDefaults.baseUrl),
    ogTitle: str("ogTitle", siteDefaults.ogTitle),
    ogDescription: str("ogDescription", siteDefaults.ogDescription),
    ogImage: str("ogImage", siteDefaults.ogImage),
    footerText: str("footerText", siteDefaults.footerText),
  };
}

/** Configurações gerais (leitura pública das linhas marcadas como públicas). */
export function useSiteSettings() {
  const query = useQuery({
    queryKey: ["site-settings", SITE_SETTINGS_KEY],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key,value")
        .eq("key", SITE_SETTINGS_KEY)
        .maybeSingle();
      if (error) throw error;
      return data?.value ?? null;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  return { settings: mapSiteSettings(query.data), isLoading: query.isLoading };
}
