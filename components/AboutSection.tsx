import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import chickenImage from "@/assets/chicken-grill.jpg";

const AboutSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="about" className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <div 
          ref={ref}
          className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Image */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-gold/20 to-ember/20 rounded-lg blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
            <img
              src={chickenImage}
              alt="Premium grilled chicken"
              className="relative rounded-lg shadow-2xl w-full aspect-square object-cover border border-gold/20"
            />
            {/* Decorative Corner */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-r-2 border-b-2 border-gold/40 rounded-br-lg" />
            <div className="absolute -top-4 -left-4 w-24 h-24 border-l-2 border-t-2 border-gold/40 rounded-tl-lg" />
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-gold to-transparent" />
              <span className="text-gold uppercase tracking-[0.3em] text-sm font-sans">Our Story</span>
            </div>

            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              Authentic African <br />
              <span className="text-gradient-gold">BBQ Experience</span>
            </h2>

            <p className="text-muted-foreground text-lg leading-relaxed">
              At Nyama Choma Bolton, we bring the rich traditions of African grilling 
              to the heart of Bolton. Every piece of meat is carefully selected from 
              fresh HALAL farmed sources, ensuring the highest quality in every bite.
            </p>

            <p className="text-muted-foreground text-lg leading-relaxed">
              Our grill masters use time-honoured techniques passed down through 
              generations, combining authentic spices and slow-fire cooking to create 
              flavours that transport you to the vibrant streets of East Africa.
            </p>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              {[
                { label: "Fresh", sublabel: "HALAL Meats" },
                { label: "Farm", sublabel: "Sourced" },
                { label: "Fire", sublabel: "Grilled" },
              ].map((item) => (
                <div key={item.label} className="text-center p-4 border border-border rounded-lg bg-background/50">
                  <p className="font-display text-2xl text-gold font-bold">{item.label}</p>
                  <p className="text-muted-foreground text-xs uppercase tracking-wider">{item.sublabel}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
