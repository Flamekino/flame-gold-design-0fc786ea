import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';

const CartButton = () => {
  const { itemCount, setIsOpen } = useCart();

  return (
    <Button
      onClick={() => setIsOpen(true)}
      variant="outline"
      size="icon"
      className="relative border-primary text-primary hover:bg-primary hover:text-primary-foreground"
    >
      <ShoppingBag className="w-5 h-5" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
          {itemCount}
        </span>
      )}
    </Button>
  );
};

export default CartButton;
