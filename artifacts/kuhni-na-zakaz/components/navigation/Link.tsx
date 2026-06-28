import NextLink, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type SiteLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    children?: ReactNode;
  };

export default function Link({ prefetch = false, ...props }: SiteLinkProps) {
  return <NextLink prefetch={prefetch} {...props} />;
}
