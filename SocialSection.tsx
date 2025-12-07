import { Instagram, Facebook } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
  </svg>
);

const socialLinks = [
  {
    name: "Instagram",
    url: "https://www.instagram.com/nyamachomabolton",
    icon: Instagram,
    handle: "@nyamachomabolton",
    color: "hover:text-pink-500",
  },
  {
    name: "TikTok",
    url: "https://www.tiktok.com/@nyamachomabolton",
    icon: TikTokIcon,
    handle: "@nyamachomabolton",
    color: "hover:text-foreground",
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/people/Nyama-Choma-Bolton/61565650924228",
    icon: Facebook,
    handle: "Nyama Choma Bolton",
    color: "hover:text-blue-500",
  },
];

const SocialSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <div 
          ref={ref}
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="text-gold uppercase tracking-[0.3em] text-sm font-sans">Follow Us</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 mb-6">
            Join the <span className="text-gradient-gold">Family</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Follow our journey, see behind the scenes, and stay updated on special offers
          </p>
        </div>

        {/* Social Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {socialLinks.map((social, index) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group p-8 rounded-lg border border-border bg-background hover:border-gold transition-all duration-500 hover:shadow-lg hover:shadow-gold/10 hover:-translate-y-1 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className={`text-muted-foreground transition-colors ${social.color} mb-4`}>
                <social.icon />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-gold transition-colors">
                {social.name}
              </h3>
              <p className="text-muted-foreground text-sm mt-1">{social.handle}</p>
            </a>
          ))}
        </div>

        {/* Decorative Element */}
        <div className="mt-16 flex justify-center">
          <div className="flex items-center gap-4">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-gold" />
            <span className="text-gold text-2xl">#NyamaChomaBoton</span>
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-gold" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialSection;
