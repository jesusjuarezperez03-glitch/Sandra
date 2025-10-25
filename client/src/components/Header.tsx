import { ThemeToggle } from "./ThemeToggle";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Scissors } from "lucide-react";

export function Header() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Inicio" },
    { path: "/booking", label: "Reservar" },
    { path: "/chat", label: "Chat" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/">
          <button className="flex items-center gap-2 hover-elevate px-3 py-2 rounded-md">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary">
              <Scissors className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">Barbería Pro</span>
          </button>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <Button
                variant={location === item.path ? "default" : "ghost"}
                data-testid={`button-header-${item.label.toLowerCase()}`}
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
