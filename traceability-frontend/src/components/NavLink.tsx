"use client";

import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NavLinkProps extends LinkProps {
  children: ReactNode;          // ✅ เพิ่มบรรทัดนี้
  className?: string;
  activeClassName?: string;
}

/**
 * NavLink for Next.js App Router
 */
const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ href, className, activeClassName, children, ...props }, ref) => {
    const pathname = usePathname();

    const isActive =
      typeof href === "string"
        ? pathname === href || pathname.startsWith(href + "/")
        : false;

    return (
      <Link
        ref={ref}
        href={href}
        className={cn(className, isActive && activeClassName)}
        {...props}
      >
        {children}
      </Link>
    );
  }
);

NavLink.displayName = "NavLink";

export { NavLink };
