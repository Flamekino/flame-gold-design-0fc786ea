import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Flame, Menu, X } from "lucide-react";

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Menu", href: "#menu" },
  { name: "Order", href: "#order" },
  { name: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <Flame className="w-8 h-8 text-gold group-hover:animate-ember" />
            <span className="font-display text-xl font-bold text-gradient-gold hidden sm:block">
              NYAMA CHOMA
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-foreground/80 hover:text-gold transition-colors text-sm uppercase tracking-wider font-sans"
              >
                {link.name}
              </a>
            ))}
            <Button variant="gold" size="sm" asChild>
              <a href="#order">Order Now</a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground hover:text-gold transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? "max-h-64 pb-6" : "max-h-0"
          }`}
        >
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-foreground/80 hover:text-gold transition-colors text-sm uppercase tracking-wider font-sans py-2"
              >
                {link.name}
              </a>
            ))}
            <Button variant="gold" size="sm" asChild className="w-full mt-2">
              <a href="#order" onClick={() => setIsMobileMenuOpen(false)}>Order Now</a>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
