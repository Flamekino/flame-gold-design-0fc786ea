import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Phone, MapPin, Clock, Send } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { toast } from "sonner";

const ContactSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    message: "",
  });
  const { ref, isVisible } = useScrollAnimation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you for your message! We'll be in touch soon.");
    setFormData({ name: "", contact: "", message: "" });
  };

  return (
    <section id="contact" className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <div 
          ref={ref}
          className={`text-center mb-12 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="text-gold uppercase tracking-[0.3em] text-sm font-sans">Get in Touch</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 mb-6">
            <span className="text-gradient-gold">Contact</span> Us
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Contact Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 rounded-lg border border-border bg-background text-center">
              <Phone className="w-8 h-8 text-gold mx-auto mb-4" />
              <h3 className="font-display text-lg font-semibold mb-2">Phone</h3>
              <a href="tel:01204123456" className="text-muted-foreground hover:text-gold transition-colors">
                01204 123 456
              </a>
            </div>
            <div className="p-6 rounded-lg border border-border bg-background text-center">
              <MapPin className="w-8 h-8 text-gold mx-auto mb-4" />
              <h3 className="font-display text-lg font-semibold mb-2">Location</h3>
              <p className="text-muted-foreground">1 Vicarage St, Bolton, BL3 5LE</p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-background text-center">
              <Clock className="w-8 h-8 text-gold mx-auto mb-4" />
              <h3 className="font-display text-lg font-semibold mb-2">Hours</h3>
              <p className="text-muted-foreground">Mon-Sun: 12pm - 10pm</p>
            </div>
          </div>

          {/* Collapsible Contact Form */}
          <div className="border border-border rounded-xl overflow-hidden bg-background">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full p-6 flex items-center justify-between hover:bg-muted/30 transition-colors"
            >
              <span className="font-display text-xl font-semibold text-foreground">Send us a Message</span>
              <ChevronDown 
                className={`w-6 h-6 text-gold transition-transform duration-300 ${
                  isExpanded ? "rotate-180" : ""
                }`} 
              />
            </button>

            <div 
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-sans uppercase tracking-wider text-muted-foreground mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors text-foreground"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-sans uppercase tracking-wider text-muted-foreground mb-2">
                      Email / Phone
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors text-foreground"
                      placeholder="john@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-sans uppercase tracking-wider text-muted-foreground mb-2">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors text-foreground resize-none"
                    placeholder="How can we help you?"
                  />
                </div>
                <Button type="submit" variant="gold" size="lg" className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>

          {/* Map */}
          <div className="mt-12 rounded-xl overflow-hidden border border-border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2367.6744234234!2d-2.4282!3d53.5778!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487ba7c5e3f3b6d5%3A0x1234567890abcdef!2s1%20Vicarage%20St%2C%20Bolton%20BL3%205LE!5e0!3m2!1sen!2suk!4v1234567890"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale hover:grayscale-0 transition-all duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
