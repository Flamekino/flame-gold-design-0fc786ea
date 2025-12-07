import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Flame, Menu, X } from "lucide-react";
import CartButton from "@/components/order/CartButton";

const navLinks = [
  { name: "About", href: "/#about" },
  { name: "Menu", href: "/#menu" },
  { name: "Order", href: "/order" },
  { name: "Contact", href: "/#contact" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    
    // Handle hash navigation
    if (href.startsWith('/#')) {
      const hash = href.substring(1);
      if (location.pathname === '/') {
        // Already on home page, just scroll
        const element = document.querySelector(hash);
        element?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const renderNavLink = (link: { name: string; href: string }) => {
    const isExternal = link.href.startsWith('/#');
    
    if (isExternal) {
      return (
        <Link
          key={link.name}
          to={link.href}
          onClick={() => handleNavClick(link.href)}
          className="text-foreground/80 hover:text-gold transition-colors text-sm uppercase tracking-wider font-sans"
        >
          {link.name}
        </Link>
      );
    }

    return (
      <Link
        key={link.name}
        to={link.href}
        onClick={() => handleNavClick(link.href)}
        className="text-foreground/80 hover:text-gold transition-colors text-sm uppercase tracking-wider font-sans"
      >
        {link.name}
      </Link>
    );
  };

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
          <Link to="/" className="flex items-center gap-2 group">
            <Flame className="w-8 h-8 text-gold group-hover:animate-ember" />
            <span className="font-display text-xl font-bold text-gradient-gold hidden sm:block">
              NYAMA CHOMA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(renderNavLink)}
            <CartButton />
            <Button variant="gold" size="sm" asChild>
              <Link to="/order">Order Now</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <CartButton />
            <button
              className="p-2 text-foreground hover:text-gold transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? "max-h-64 pb-6" : "max-h-0"
          }`}
        >
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-foreground/80 hover:text-gold transition-colors text-sm uppercase tracking-wider font-sans py-2"
              >
                {link.name}
              </Link>
            ))}
            <Button variant="gold" size="sm" asChild className="w-full mt-2">
              <Link to="/order" onClick={() => setIsMobileMenuOpen(false)}>Order Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
