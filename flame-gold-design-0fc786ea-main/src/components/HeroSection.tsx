import { Button } from "@/components/ui/button";
import { Flame, ChevronDown } from "lucide-react";
import heroImage from "@/assets/hero-grill.jpg";

const HeroSection = () => {
  const scrollToMenu = () => {
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      {/* Animated Ember Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-ember animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
              opacity: 0.4 + Math.random() * 0.4,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Flame Icon */}
        <div className="flex justify-center mb-6 animate-fade-up">
          <div className="p-4 rounded-full border-2 border-gold/30 animate-glow-pulse">
            <Flame className="w-12 h-12 text-gold animate-ember" />
          </div>
        </div>

        {/* Main Title */}
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-4 animate-fade-up animation-delay-200">
          <span className="text-gradient-gold">NYAMA CHOMA</span>
        </h1>

        {/* Subtitle */}
        <p className="font-display text-xl md:text-2xl lg:text-3xl text-foreground/90 italic mb-2 animate-fade-up animation-delay-400">
          Farm to Grill
        </p>

        {/* Decorative Line */}
        <div className="flex items-center justify-center gap-4 my-8 animate-fade-up animation-delay-400">
          <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent to-gold" />
          <div className="w-2 h-2 rotate-45 bg-gold" />
          <div className="h-px w-16 md:w-24 bg-gradient-to-l from-transparent to-gold" />
        </div>

        {/* Tagline */}
        <p className="text-muted-foreground text-sm md:text-base uppercase tracking-[0.3em] mb-12 animate-fade-up animation-delay-600">
          A gourmet treat crafted for those who appreciate quality in every bite
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up animation-delay-600">
          <Button variant="gold" size="xl" asChild>
            <a href="#order">Order Now</a>
          </Button>
          <Button variant="goldOutline" size="xl" onClick={scrollToMenu}>
            View Menu
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToMenu}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gold/60 hover:text-gold transition-colors animate-bounce"
        aria-label="Scroll to menu"
      >
        <ChevronDown className="w-8 h-8" />
      </button>
    </section>
  );
};

export default HeroSection;
