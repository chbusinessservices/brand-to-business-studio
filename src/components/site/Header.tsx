import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NAV_LINKS } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-background transition-[border-color]",
        scrolled ? "border-border" : "border-transparent",
      )}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-6 px-5 md:px-10">
        <a href="/" aria-label="CH Business Services — home" className="shrink-0">
          <Logo variant="onLight" height={40} className="md:!h-[46px] md:!w-[140px]" />
        </a>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={`/${l.href}`}
                  className="link-underline py-1 text-[0.92rem] text-foreground/80 transition-colors hover:text-foreground"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild className="hidden sm:inline-flex h-10 px-5">
            <a href="/#contact">Request a Clarity Call</a>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="!size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-sm border-l p-0 [&>button]:hidden">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="flex h-[4.5rem] items-center justify-between border-b px-5">
                <Logo variant="onLight" height={34} />
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" className="h-11 w-11" aria-label="Close menu">
                    <X className="!size-5" />
                  </Button>
                </SheetClose>
              </div>
              <nav aria-label="Mobile" className="px-5 py-4">
                <ul>
                  {NAV_LINKS.map((l, i) => (
                    <li key={l.href} className="border-b">
                      <SheetClose asChild>
                        <a
                          href={`/${l.href}`}
                          className="flex items-baseline gap-4 py-4 text-xl font-medium"
                        >
                          <span className="eyebrow text-muted-foreground">0{i + 1}</span>
                          {l.label}
                        </a>
                      </SheetClose>
                    </li>
                  ))}
                </ul>
                <SheetClose asChild>
                  <Button asChild size="xl" className="mt-8 w-full">
                    <a href="/#contact">Request a Free 15-Minute Clarity Call</a>
                  </Button>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
