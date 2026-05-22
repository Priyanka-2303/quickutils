'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, Menu, X, Zap } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';
import { tools, toolCategories, type ToolCategory } from '@/lib/tools-registry';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/lib/utils';

export function Header() {
  const [open, setOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  const grouped = (Object.keys(toolCategories) as ToolCategory[]).map((cat) => ({
    category: cat,
    label: toolCategories[cat],
    items: tools.filter((t) => t.category === cat),
  }));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground">
            <Zap className="h-4 w-4" />
          </span>
          <span>{siteConfig.name}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <div
            className="relative"
            onMouseEnter={() => setToolsOpen(true)}
            onMouseLeave={() => setToolsOpen(false)}
          >
            <Button variant="ghost" size="sm" className="gap-1">
              Tools <ChevronDown className="h-3.5 w-3.5" />
            </Button>
            <div
              className={cn(
                'absolute right-0 top-full z-[100] mt-1 w-[640px] rounded-xl border bg-popover p-4 shadow-xl transition-all',
                toolsOpen
                  ? 'pointer-events-auto translate-y-0 opacity-100'
                  : 'pointer-events-none -translate-y-1 opacity-0',
              )}
            >
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {grouped.map((g) => (
                  <div key={g.category}>
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {g.label}
                    </p>
                    <ul className="space-y-0.5">
                      {g.items.map((tool) => (
                        <li key={tool.slug}>
                          <Link
                            href={`/${tool.slug}`}
                            className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                          >
                            <span className="flex items-center gap-2">
                              <tool.icon className="h-3.5 w-3.5 text-muted-foreground" />
                              {tool.shortName}
                            </span>
                            {tool.status === 'planned' && (
                              <Badge variant="outline" className="text-[10px]">
                                Soon
                              </Badge>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Link
            href="/json-formatter"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            JSON Formatter
          </Link>
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t md:hidden">
          <div className="container py-3">
            {grouped.map((g) => (
              <div key={g.category} className="mb-3">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {g.label}
                </p>
                <ul className="space-y-0.5">
                  {g.items.map((tool) => (
                    <li key={tool.slug}>
                      <Link
                        href={`/${tool.slug}`}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                      >
                        <span className="flex items-center gap-2">
                          <tool.icon className="h-3.5 w-3.5 text-muted-foreground" />
                          {tool.shortName}
                        </span>
                        {tool.status === 'planned' && (
                          <Badge variant="outline" className="text-[10px]">
                            Soon
                          </Badge>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
