import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MenuItemCard from '@/components/order/MenuItemCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  is_available: boolean;
}

interface CustomizationOption {
  id: string;
  menu_item_id: string;
  name: string;
  type: 'radio' | 'checkbox' | 'select';
  options: string[];
  is_required: boolean;
  extra_price: number;
}

const Order = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const { data: menuItems, isLoading: itemsLoading } = useQuery({
    queryKey: ['menu-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_available', true)
        .order('category');
      
      if (error) throw error;
      return data as MenuItem[];
    },
  });

  const { data: customizations, isLoading: customizationsLoading } = useQuery({
    queryKey: ['customizations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customization_options')
        .select('*');
      
      if (error) throw error;
      return data as CustomizationOption[];
    },
  });

  const categories = menuItems
    ? ['all', ...new Set(menuItems.map(item => item.category))]
    : ['all'];

  const filteredItems = menuItems?.filter(
    item => activeCategory === 'all' || item.category === activeCategory
  );

  const getItemCustomizations = (itemId: string) => {
    return customizations?.filter(c => c.menu_item_id === itemId) || [];
  };

  const isLoading = itemsLoading || customizationsLoading;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Header */}
        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-ember opacity-20" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">
                Order <span className="text-gradient-gold">Online</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Craft your perfect meal with our gourmet selection. Choose your items, customize to your taste, and enjoy premium African BBQ.
              </p>
            </div>
          </div>
        </section>

        {/* Menu */}
        <section className="container mx-auto px-4">
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="flex flex-wrap justify-center gap-2 bg-transparent h-auto mb-8">
              {categories.map(category => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="capitalize px-6 py-2 rounded-full border border-border bg-card data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary transition-all"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeCategory} className="mt-0">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="card-premium p-4">
                      <div className="flex gap-4">
                        <Skeleton className="w-24 h-24 rounded-lg" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-5 w-3/4" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-8 w-24" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredItems?.map(item => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      customizations={getItemCustomizations(item.id)}
                    />
                  ))}
                </div>
              )}

              {!isLoading && filteredItems?.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No items available in this category</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Order;
