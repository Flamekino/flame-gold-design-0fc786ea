import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ItemCustomizer from './ItemCustomizer';

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

interface MenuItemCardProps {
  item: MenuItem;
  customizations: CustomizationOption[];
}

const MenuItemCard = ({ item, customizations }: MenuItemCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="group card-premium p-4 hover:border-primary/50 transition-all duration-300">
      <div className="flex gap-4">
        {item.image_url && (
          <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-display text-lg text-foreground truncate">{item.name}</h3>
            <span className="text-primary font-semibold whitespace-nowrap">£{item.price.toFixed(2)}</span>
          </div>
          {item.description && (
            <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{item.description}</p>
          )}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="mt-3 bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={!item.is_available}
              >
                <Plus className="w-4 h-4 mr-1" />
                {item.is_available ? 'Add to Order' : 'Unavailable'}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-display text-xl text-foreground">{item.name}</DialogTitle>
              </DialogHeader>
              <ItemCustomizer
                item={item}
                customizations={customizations}
                onClose={() => setIsOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
