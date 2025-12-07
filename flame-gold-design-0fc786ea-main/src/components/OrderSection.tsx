import { Button } from "@/components/ui/button";
import { ShoppingBag, Truck } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const OrderSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="order" className="py-24 bg-background relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-ember/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div 
          ref={ref}
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="text-gold uppercase tracking-[0.3em] text-sm font-sans">Ready to Order?</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 mb-6">
            <span className="text-gradient-gold">Collection</span> & Delivery
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enjoy our gourmet BBQ in the comfort of your home. Order now for collection or delivery.
          </p>
        </div>

        {/* Order Options */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Collection */}
          <div 
            className={`group p-8 md:p-12 rounded-xl border-2 border-border bg-card hover:border-gold transition-all duration-500 text-center ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="inline-flex p-4 rounded-full bg-gold/10 mb-6 group-hover:bg-gold/20 transition-colors">
              <ShoppingBag className="w-10 h-10 text-gold" />
            </div>
            <h3 className="font-display text-2xl font-bold text-foreground mb-2">Collection</h3>
            <p className="text-muted-foreground mb-6">
              Skip the queue, order ahead and collect your order hot and fresh from our kitchen.
            </p>
            <Button variant="gold" size="lg" className="w-full animate-pulse-glow" asChild>
              <a href="#" onClick={(e) => e.preventDefault()}>Order for Collection</a>
            </Button>
          </div>

          {/* Delivery */}
          <div 
            className={`group p-8 md:p-12 rounded-xl border-2 border-border bg-card hover:border-gold transition-all duration-500 text-center ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <div className="inline-flex p-4 rounded-full bg-ember/10 mb-6 group-hover:bg-ember/20 transition-colors">
              <Truck className="w-10 h-10 text-ember" />
            </div>
            <h3 className="font-display text-2xl font-bold text-foreground mb-2">Delivery</h3>
            <p className="text-muted-foreground mb-6">
              We deliver the flame-grilled experience straight to your doorstep. Fast and hot.
            </p>
            <Button variant="ember" size="lg" className="w-full" asChild>
              <a href="#" onClick={(e) => e.preventDefault()}>Order for Delivery</a>
            </Button>
          </div>
        </div>

        {/* Phone Order */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Prefer to order by phone?{" "}
            <a href="tel:01onal" className="text-gold hover:underline font-semibold">
              Call us now
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default OrderSection;
