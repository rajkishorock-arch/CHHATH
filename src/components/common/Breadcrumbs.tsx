import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate?: (url: string) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onNavigate }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(url);
    }
  };

  return (
    <nav aria-label="Breadcrumb" className="py-3 px-1">
      <ol className="flex items-center flex-wrap gap-1.5 text-xs sm:text-sm font-mukta text-stone-600 dark:text-stone-300 list-none p-0 m-0">
        <li className="flex items-center gap-1">
          <a
            href="/CHHATH/"
            onClick={(e) => handleClick(e, '/CHHATH/')}
            className="flex items-center gap-1 hover:text-amber-600 dark:hover:text-amber-300 transition-colors text-decoration-none font-semibold"
          >
            <Home className="w-3.5 h-3.5" />
            <span>गृह (Home)</span>
          </a>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1">
              <ChevronRight className="w-3.5 h-3.5 text-amber-500/70 shrink-0" />
              {isLast ? (
                <span className="font-bold text-stone-900 dark:text-amber-300" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.url}
                  onClick={(e) => handleClick(e, item.url)}
                  className="hover:text-amber-600 dark:hover:text-amber-300 transition-colors text-decoration-none font-semibold"
                >
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
