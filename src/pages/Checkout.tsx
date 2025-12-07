import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Truck, Store, CreditCard, Banknote, ArrowLeft, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const checkoutSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone number required'),
  orderType: z.enum(['collection', 'delivery']),
  address: z.string().optional(),
  postcode: z.string().optional(),
  paymentMethod: z.enum(['cash', 'card_on_delivery']),
  specialInstructions: z.string().optional(),
}).refine(data => {
  if (data.orderType === 'delivery') {
    return data.address && data.address.length >= 5 && data.postcode && data.postcode.length >= 5;
  }
  return true;
}, {
  message: 'Address and postcode required for delivery',
  path: ['address'],
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const DELIVERY_FEE = 2.50;

const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState<string>('');

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      orderType: 'collection',
      address: '',
      postcode: '',
      paymentMethod: 'cash',
      specialInstructions: '',
    },
  });

  const orderType = form.watch('orderType');
  const deliveryFee = orderType === 'delivery' ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      toast({
        title: 'Cart is empty',
        description: 'Please add items to your order first',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItems = items.map(item => ({
        menuItemId: item.menuItemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        customizations: item.customizations.map(c => ({
          name: c.name,
          value: c.value,
          extraPrice: c.extraPrice,
        })),
        totalPrice: item.totalPrice,
      })) as unknown;

      const { data: order, error } = await supabase
        .from('orders')
        .insert([{
          customer_name: data.name,
          customer_email: data.email,
          customer_phone: data.phone,
          order_type: data.orderType,
          delivery_address: data.address || null,
          delivery_postcode: data.postcode || null,
          items: orderItems as any,
          subtotal,
          delivery_fee: deliveryFee,
          total,
          payment_method: data.paymentMethod,
          special_instructions: data.specialInstructions || null,
          estimated_time: data.orderType === 'collection' ? '25-35 mins' : '45-60 mins',
        }])
        .select()
        .single();

      if (error) throw error;

      setOrderId(order.id.slice(0, 8).toUpperCase());
      setOrderComplete(true);
      clearCart();
    } catch (error) {
      console.error('Order error:', error);
      toast({
        title: 'Order failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center py-20">
            <h1 className="font-display text-3xl text-foreground mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">Add some delicious items to get started</p>
            <Button onClick={() => navigate('/order')} className="bg-primary text-primary-foreground">
              Browse Menu
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/order')}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Menu
          </Button>

          <h1 className="font-display text-3xl md:text-4xl text-foreground mb-8">
            Checkout
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Contact Details */}
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="font-display text-xl text-foreground">Contact Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Full Name</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-input border-border" placeholder="John Doe" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground">Email</FormLabel>
                              <FormControl>
                                <Input {...field} type="email" className="bg-input border-border" placeholder="john@example.com" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground">Phone</FormLabel>
                              <FormControl>
                                <Input {...field} className="bg-input border-border" placeholder="07123 456789" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Order Type */}
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="font-display text-xl text-foreground">Order Type</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="orderType"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                className="grid sm:grid-cols-2 gap-4"
                              >
                                <div className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all ${field.value === 'collection' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}>
                                  <RadioGroupItem value="collection" id="collection" />
                                  <Label htmlFor="collection" className="flex items-center gap-2 cursor-pointer flex-1">
                                    <Store className="w-5 h-5 text-primary" />
                                    <div>
                                      <p className="font-medium text-foreground">Collection</p>
                                      <p className="text-sm text-muted-foreground">Ready in 25-35 mins</p>
                                    </div>
                                  </Label>
                                </div>
                                <div className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all ${field.value === 'delivery' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}>
                                  <RadioGroupItem value="delivery" id="delivery" />
                                  <Label htmlFor="delivery" className="flex items-center gap-2 cursor-pointer flex-1">
                                    <Truck className="w-5 h-5 text-primary" />
                                    <div>
                                      <p className="font-medium text-foreground">Delivery</p>
                                      <p className="text-sm text-muted-foreground">45-60 mins (+£{DELIVERY_FEE.toFixed(2)})</p>
                                    </div>
                                  </Label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {orderType === 'delivery' && (
                        <div className="mt-4 space-y-4 animate-fade-in">
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-foreground">Delivery Address</FormLabel>
                                <FormControl>
                                  <Textarea {...field} className="bg-input border-border resize-none" placeholder="Enter your full address" rows={3} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="postcode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-foreground">Postcode</FormLabel>
                                <FormControl>
                                  <Input {...field} className="bg-input border-border" placeholder="BL1 1AA" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Payment Method */}
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="font-display text-xl text-foreground">Payment Method</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                className="grid sm:grid-cols-2 gap-4"
                              >
                                <div className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all ${field.value === 'cash' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}>
                                  <RadioGroupItem value="cash" id="cash" />
                                  <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer">
                                    <Banknote className="w-5 h-5 text-primary" />
                                    <span className="text-foreground">Cash on {orderType === 'delivery' ? 'Delivery' : 'Collection'}</span>
                                  </Label>
                                </div>
                                <div className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all ${field.value === 'card_on_delivery' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}>
                                  <RadioGroupItem value="card_on_delivery" id="card_on_delivery" />
                                  <Label htmlFor="card_on_delivery" className="flex items-center gap-2 cursor-pointer">
                                    <CreditCard className="w-5 h-5 text-primary" />
                                    <span className="text-foreground">Card on {orderType === 'delivery' ? 'Delivery' : 'Collection'}</span>
                                  </Label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Special Instructions */}
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="font-display text-xl text-foreground">Special Instructions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="specialInstructions"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                {...field}
                                className="bg-input border-border resize-none"
                                placeholder="Any special requests or notes for your order..."
                                rows={3}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-6 text-lg"
                  >
                    {isSubmitting ? 'Placing Order...' : `Place Order - £${total.toFixed(2)}`}
                  </Button>
                </form>
              </Form>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="bg-card border-border sticky top-24">
                <CardHeader>
                  <CardTitle className="font-display text-xl text-foreground">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div className="flex-1">
                        <p className="text-foreground">{item.quantity}x {item.name}</p>
                        {item.customizations.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {item.customizations.map(c => 
                              Array.isArray(c.value) ? c.value.join(', ') : c.value
                            ).join(' • ')}
                          </p>
                        )}
                      </div>
                      <span className="text-foreground font-medium">£{item.totalPrice.toFixed(2)}</span>
                    </div>
                  ))}
                  
                  <Separator className="bg-border" />
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">£{subtotal.toFixed(2)}</span>
                  </div>
                  
                  {orderType === 'delivery' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery</span>
                      <span className="text-foreground">£{DELIVERY_FEE.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <Separator className="bg-border" />
                  
                  <div className="flex justify-between font-semibold text-lg">
                    <span className="text-foreground">Total</span>
                    <span className="text-primary">£{total.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Order Confirmation Dialog */}
      <Dialog open={orderComplete} onOpenChange={() => {}}>
        <DialogContent className="bg-card border-border text-center sm:max-w-md">
          <div className="py-6">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-display text-2xl text-foreground mb-2">Order Confirmed!</h2>
            <p className="text-muted-foreground mb-4">
              Thank you for your order. We'll start preparing it right away.
            </p>
            <div className="bg-secondary/50 rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground">Order Reference</p>
              <p className="text-2xl font-mono font-bold text-primary">{orderId}</p>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              A confirmation has been sent to your email.
            </p>
            <Button
              onClick={() => navigate('/')}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Back to Home
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Checkout;
