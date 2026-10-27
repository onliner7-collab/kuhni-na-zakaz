import NextLink, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { resolvePublicPath } from "@/lib/retired-public-routes";

type SiteLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    children?: ReactNode;
  };

export default function Link({ prefetch = false, href, ...props }: SiteLinkProps) {
  const resolvedHref = typeof href === "string"
    ? resolvePublicPath(href)
    : href.pathname ? { ...href, pathname: resolvePublicPath(href.pathname) } : href;
  return <NextLink prefetch={prefetch} {...props} href={resolvedHref} />;
}
