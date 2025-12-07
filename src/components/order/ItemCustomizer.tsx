import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCart, CartItemCustomization } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
}

interface CustomizationOption {
  id: string;
  name: string;
  type: 'radio' | 'checkbox' | 'select';
  options: string[];
  is_required: boolean;
  extra_price: number;
}

interface ItemCustomizerProps {
  item: MenuItem;
  customizations: CustomizationOption[];
  onClose: () => void;
}

const parseOptionPrice = (option: string): { label: string; price: number } => {
  const match = option.match(/(.+?)\s*\(\+£([\d.]+)\)/);
  if (match) {
    return { label: match[1].trim(), price: parseFloat(match[2]) };
  }
  return { label: option, price: 0 };
};

const ItemCustomizer = ({ item, customizations, onClose }: ItemCustomizerProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selections, setSelections] = useState<Record<string, string | string[]>>({});
  const [specialInstructions, setSpecialInstructions] = useState('');
  const { addItem, setIsOpen } = useCart();
  const { toast } = useToast();

  const calculateExtraPrice = () => {
    let extra = 0;
    customizations.forEach(c => {
      const selection = selections[c.id];
      if (!selection) return;
      
      if (Array.isArray(selection)) {
        selection.forEach(opt => {
          const { price } = parseOptionPrice(opt);
          extra += price;
        });
      } else {
        const { price } = parseOptionPrice(selection);
        extra += price;
      }
    });
    return extra;
  };

  const unitPrice = item.price + calculateExtraPrice();
  const totalPrice = unitPrice * quantity;

  const handleRadioChange = (customizationId: string, value: string) => {
    setSelections(prev => ({ ...prev, [customizationId]: value }));
  };

  const handleCheckboxChange = (customizationId: string, option: string, checked: boolean) => {
    setSelections(prev => {
      const current = (prev[customizationId] as string[]) || [];
      if (checked) {
        return { ...prev, [customizationId]: [...current, option] };
      }
      return { ...prev, [customizationId]: current.filter(o => o !== option) };
    });
  };

  const handleSelectChange = (customizationId: string, value: string) => {
    setSelections(prev => ({ ...prev, [customizationId]: value }));
  };

  const isValid = customizations
    .filter(c => c.is_required)
    .every(c => {
      const selection = selections[c.id];
      if (Array.isArray(selection)) return selection.length > 0;
      return !!selection;
    });

  const handleAddToCart = () => {
    const cartCustomizations: CartItemCustomization[] = [];
    
    customizations.forEach(c => {
      const selection = selections[c.id];
      if (!selection || (Array.isArray(selection) && selection.length === 0)) return;
      
      let extraPrice = 0;
      if (Array.isArray(selection)) {
        selection.forEach(opt => {
          extraPrice += parseOptionPrice(opt).price;
        });
      } else {
        extraPrice = parseOptionPrice(selection).price;
      }
      
      cartCustomizations.push({
        name: c.name,
        value: selection,
        extraPrice,
      });
    });

    if (specialInstructions.trim()) {
      cartCustomizations.push({
        name: 'Special Instructions',
        value: specialInstructions.trim(),
        extraPrice: 0,
      });
    }

    addItem({
      id: '',
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity,
      customizations: cartCustomizations,
      totalPrice,
      image_url: item.image_url || undefined,
    });

    toast({
      title: 'Added to cart',
      description: `${quantity}x ${item.name} added to your order`,
    });

    setIsOpen(true);
    onClose();
  };

  return (
    <div className="space-y-6">
      {item.image_url && (
        <div className="w-full h-48 rounded-lg overflow-hidden">
          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
        </div>
      )}
      
      {item.description && (
        <p className="text-muted-foreground">{item.description}</p>
      )}

      <div className="space-y-4">
        {customizations.map(c => (
          <div key={c.id} className="space-y-2">
            <Label className="text-foreground font-medium">
              {c.name}
              {c.is_required && <span className="text-accent ml-1">*</span>}
            </Label>
            
            {c.type === 'radio' && (
              <RadioGroup
                value={selections[c.id] as string}
                onValueChange={(value) => handleRadioChange(c.id, value)}
                className="space-y-2"
              >
                {c.options.map((option, idx) => {
                  const { label, price } = parseOptionPrice(option);
                  return (
                    <div key={idx} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`${c.id}-${idx}`} />
                      <Label htmlFor={`${c.id}-${idx}`} className="text-sm text-foreground cursor-pointer flex-1">
                        {label}
                        {price > 0 && <span className="text-primary ml-2">+£{price.toFixed(2)}</span>}
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            )}

            {c.type === 'checkbox' && (
              <div className="space-y-2">
                {c.options.map((option, idx) => {
                  const { label, price } = parseOptionPrice(option);
                  const isChecked = ((selections[c.id] as string[]) || []).includes(option);
                  return (
                    <div key={idx} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${c.id}-${idx}`}
                        checked={isChecked}
                        onCheckedChange={(checked) => handleCheckboxChange(c.id, option, !!checked)}
                      />
                      <Label htmlFor={`${c.id}-${idx}`} className="text-sm text-foreground cursor-pointer flex-1">
                        {label}
                        {price > 0 && <span className="text-primary ml-2">+£{price.toFixed(2)}</span>}
                      </Label>
                    </div>
                  );
                })}
              </div>
            )}

            {c.type === 'select' && (
              <Select
                value={selections[c.id] as string}
                onValueChange={(value) => handleSelectChange(c.id, value)}
              >
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {c.options.map((option, idx) => {
                    const { label, price } = parseOptionPrice(option);
                    return (
                      <SelectItem key={idx} value={option}>
                        {label}
                        {price > 0 && ` (+£${price.toFixed(2)})`}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
          </div>
        ))}

        <div className="space-y-2">
          <Label className="text-foreground font-medium">Special Instructions</Label>
          <Textarea
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="Any special requests or allergies..."
            className="bg-input border-border resize-none"
            rows={3}
          />
        </div>
      </div>

      <div className="border-t border-border pt-4 space-y-4">
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            className="border-border"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="text-xl font-semibold text-foreground w-8 text-center">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(q => q + 1)}
            className="border-border"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={!isValid}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-6"
        >
          Add to Order - £{totalPrice.toFixed(2)}
        </Button>
      </div>
    </div>
  );
};

export default ItemCustomizer;
