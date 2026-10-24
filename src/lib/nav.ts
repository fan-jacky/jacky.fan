export interface NavItem {
  href: string;
  label: string;
  external?: boolean;
}

export const fallbackNavItems: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
];

export function resolveMenuItemUrl(item: any): { href?: string; external?: boolean } {
  // External URL takes priority
  if (item?.externalUrl) {
    return { href: item.externalUrl, external: true };
  }

  // Internal page relationship
  const page = item?.page;
  if (!page || typeof page === 'string') {
    return {};
  }

  if (page.url) {
    return { href: page.url, external: false };
  }

  if (page.slug) {
    return { href: `/${page.slug}`, external: false };
  }

  return {};
}

export function isActive(item: NavItem, pathname: string): boolean {
  return !item.external && pathname === item.href;
}

export function getNavItems(siteSetting: any): NavItem[] {
  return siteSetting?.menuItem
    ?.map((item: any): NavItem | null => {
      const resolved = resolveMenuItemUrl(item);
      if (!resolved.href || !item?.name) return null;
      return { href: resolved.href, label: item.name, external: resolved.external };
    })
    .filter((item: NavItem | null): item is NavItem => Boolean(item)) ?? fallbackNavItems;
}
