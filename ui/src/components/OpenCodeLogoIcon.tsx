import { cn } from "../lib/utils";
import { useTranslation, t } from "@/i18n";

interface OpenCodeLogoIconProps {
  className?: string;
}

export function OpenCodeLogoIcon({ className }: OpenCodeLogoIconProps) {
  return (
    <>
      <img
        src="/brands/opencode-logo-light-square.svg"
        alt={t("pcomponents_OpenCodeLogoIcon.opencode", {defaultValue: "OpenCode"})}
        className={cn("dark:hidden", className)}
      />
      <img
        src="/brands/opencode-logo-dark-square.svg"
        alt={t("pcomponents_OpenCodeLogoIcon.opencode", {defaultValue: "OpenCode"})}
        className={cn("hidden dark:block", className)}
      />
    </>
  );
}
