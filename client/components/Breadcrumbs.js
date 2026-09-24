'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs() {
  const pathname = usePathname();
  
  if (!pathname || pathname === '/') return null;

  const paths = pathname.split('/').filter(Boolean);

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6 font-medium">
      <Link href="/" className="hover:text-brand-primary transition-colors">
        Home
      </Link>
      {paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join('/')}`;
        const isLast = index === paths.length - 1;
        
        // Format the string nicely (e.g. "my-list" -> "My List", "12345" -> "12345")
        const formattedPath = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');

        return (
          <React.Fragment key={path}>
            <ChevronRight size={14} className="text-gray-600" />
            {isLast ? (
              <span className="text-gray-200">{formattedPath}</span>
            ) : (
              <Link href={href} className="hover:text-brand-primary transition-colors">
                {formattedPath}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
