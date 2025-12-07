import { Flame, Instagram, Facebook, MapPin } from "lucide-react";

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <Flame className="w-6 h-6 text-gold" />
              <span className="font-display text-xl font-bold text-gradient-gold">NYAMA CHOMA</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Authentic African BBQ<br />
              Fresh HALAL Meats<br />
              Farm to Grill
            </p>
          </div>

          {/* Location */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-gold" />
              <span className="font-semibold text-foreground">Find Us</span>
            </div>
            <p className="text-muted-foreground text-sm">
              1 Vicarage St<br />
              Bolton, BL3 5LE
            </p>
          </div>

          {/* Social Links */}
          <div className="text-center md:text-right">
            <p className="font-semibold text-foreground mb-4">Follow Us</p>
            <div className="flex justify-center md:justify-end gap-4">
              <a
                href="https://www.instagram.com/nyamachomabolton"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full border border-border hover:border-gold hover:text-gold transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.tiktok.com/@nyamachomabolton"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full border border-border hover:border-gold hover:text-gold transition-colors"
                aria-label="TikTok"
              >
                <TikTokIcon />
              </a>
              <a
                href="https://www.facebook.com/people/Nyama-Choma-Bolton/61565650924228"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full border border-border hover:border-gold hover:text-gold transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border text-center">
          <p className="text-muted-foreground text-sm">
            © {currentYear} Nyama Choma Bolton. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
