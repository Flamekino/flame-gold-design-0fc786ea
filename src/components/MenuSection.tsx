import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import chickenImage from "@/assets/chicken-grill.jpg";
import lambImage from "@/assets/lamb-chops.jpg";
import burgerImage from "@/assets/burger.jpg";

interface MenuItem {
  name: string;
  description: string;
  price: string;
  image?: string;
  popular?: boolean;
}

interface MenuCategory {
  title: string;
  description: string;
  items: MenuItem[];
}

const menuData: MenuCategory[] = [
  {
    title: "All Things Chicken",
    description: "Premium HALAL chicken, flame-grilled to perfection",
    items: [
      { name: "Whole Grilled Chicken", description: "Marinated in our signature spice blend", price: "£14.99", popular: true },
      { name: "Half Chicken", description: "Perfect portion of smoky goodness", price: "£8.99" },
      { name: "Chicken Wings (6pc)", description: "Crispy and succulent", price: "£6.99" },
      { name: "Chicken Wings (12pc)", description: "For the wing lovers", price: "£11.99", popular: true },
      { name: "Chicken Thighs (4pc)", description: "Juicy and flavourful", price: "£9.99" },
      { name: "Chicken Drumsticks (6pc)", description: "Classic BBQ favourite", price: "£8.99" },
    ],
  },
  {
    title: "Premium Meats",
    description: "Hand-selected cuts, expertly grilled",
    items: [
      { name: "Lamb Chops (4pc)", description: "Tender and succulent", price: "£16.99", popular: true },
      { name: "Lamb Chops (6pc)", description: "For the lamb enthusiast", price: "£22.99" },
      { name: "Mixed Grill Platter", description: "Selection of our finest meats", price: "£24.99", popular: true },
      { name: "Beef Kebabs (4pc)", description: "Seasoned to perfection", price: "£12.99" },
      { name: "Lamb Kebabs (4pc)", description: "Traditional recipe", price: "£14.99" },
    ],
  },
  {
    title: "Burgers & More",
    description: "Gourmet creations from the grill",
    items: [
      { name: "Nyama Burger", description: "Our signature double patty with special sauce", price: "£10.99", popular: true },
      { name: "Classic Cheeseburger", description: "Beef patty with melted cheese", price: "£8.99" },
      { name: "Chicken Burger", description: "Grilled chicken breast with slaw", price: "£8.99" },
      { name: "Lamb Burger", description: "Spiced lamb patty with mint", price: "£9.99" },
    ],
  },
  {
    title: "Sides & Sauces",
    description: "Complete your feast",
    items: [
      { name: "Spiced Rice", description: "Fragrant and fluffy", price: "£3.99" },
      { name: "Grilled Corn", description: "With chilli butter", price: "£2.99" },
      { name: "Coleslaw", description: "Creamy and fresh", price: "£2.49" },
      { name: "Peri Peri Sauce", description: "Our house special", price: "£1.99" },
      { name: "Garlic Mayo", description: "Creamy and rich", price: "£0.99" },
    ],
  },
];

const categoryImages: Record<string, string> = {
  "All Things Chicken": chickenImage,
  "Premium Meats": lambImage,
  "Burgers & More": burgerImage,
};

const MenuSection = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="menu" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div 
          ref={ref}
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="text-gold uppercase tracking-[0.3em] text-sm font-sans">Our Menu</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 mb-6">
            <span className="text-gradient-gold">Gourmet</span> Selection
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold" />
            <div className="w-2 h-2 rotate-45 bg-gold" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold" />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
          {menuData.map((category, index) => (
            <button
              key={category.title}
              onClick={() => setActiveCategory(index)}
              className={`px-4 md:px-6 py-3 rounded-full text-sm font-sans uppercase tracking-wider transition-all duration-300 ${
                activeCategory === index
                  ? "bg-gold text-primary-foreground shadow-lg shadow-gold/30"
                  : "bg-card border border-border text-muted-foreground hover:border-gold hover:text-gold"
              }`}
            >
              {category.title}
            </button>
          ))}
        </div>

        {/* Menu Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Category Image */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-gold/20 to-ember/20 rounded-lg blur-lg opacity-60" />
                <img
                  src={categoryImages[menuData[activeCategory].title] || chickenImage}
                  alt={menuData[activeCategory].title}
                  className="relative rounded-lg w-full aspect-[3/4] object-cover border border-gold/20"
                />
              </div>
              <p className="text-center mt-6 text-muted-foreground italic font-display">
                {menuData[activeCategory].description}
              </p>
            </div>
          </div>

          {/* Menu Items Grid */}
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
            {menuData[activeCategory].items.map((item, index) => (
              <div
                key={item.name}
                className="group relative p-6 rounded-lg border border-border bg-card hover:border-gold/50 transition-all duration-300 hover:shadow-lg hover:shadow-gold/10"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {item.popular && (
                  <span className="absolute -top-2 -right-2 px-3 py-1 bg-ember text-foreground text-xs uppercase tracking-wider rounded-full">
                    Popular
                  </span>
                )}
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-gold transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">{item.description}</p>
                  </div>
                  <span className="font-display text-xl font-bold text-gold">{item.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
