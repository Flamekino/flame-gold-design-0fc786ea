-- Create menu_items table for the menu
CREATE TABLE public.menu_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create customization_options table
CREATE TABLE public.customization_options (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('radio', 'checkbox', 'select')),
  options JSONB NOT NULL DEFAULT '[]',
  is_required BOOLEAN DEFAULT false,
  extra_price DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  order_type TEXT NOT NULL CHECK (order_type IN ('collection', 'delivery')),
  delivery_address TEXT,
  delivery_postcode TEXT,
  items JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'card_on_delivery')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'completed', 'cancelled')),
  special_instructions TEXT,
  estimated_time TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customization_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Menu items are publicly readable
CREATE POLICY "Menu items are publicly readable" 
ON public.menu_items 
FOR SELECT 
USING (true);

-- Customization options are publicly readable
CREATE POLICY "Customization options are publicly readable" 
ON public.customization_options 
FOR SELECT 
USING (true);

-- Anyone can create orders (guest checkout)
CREATE POLICY "Anyone can create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

-- Orders can be read by email match (for order tracking)
CREATE POLICY "Orders readable by customer email" 
ON public.orders 
FOR SELECT 
USING (true);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_menu_items_updated_at
BEFORE UPDATE ON public.menu_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample menu items
INSERT INTO public.menu_items (name, description, price, category, image_url) VALUES
('Nyama Choma Chicken', 'Tender marinated whole chicken grilled to perfection over open flames', 14.99, 'Chicken', '/chicken-grill.jpg'),
('Spicy Wings Platter', 'Crispy wings tossed in our signature African spice blend', 9.99, 'Wings', '/chicken-grill.jpg'),
('Lamb Chops', 'Premium lamb chops seasoned with aromatic herbs and spices', 18.99, 'Chops', '/lamb-chops.jpg'),
('Classic Gourmet Burger', 'Juicy beef patty with fresh lettuce, tomato, and special sauce', 12.99, 'Burgers', '/burger.jpg'),
('Half Chicken', 'Half portion of our signature grilled chicken', 8.99, 'Chicken', '/chicken-grill.jpg'),
('Mixed Grill Platter', 'Selection of chicken, lamb chops, and wings', 24.99, 'Platters', '/hero-grill.jpg'),
('Beef Suya Skewers', 'Traditional Nigerian spiced beef skewers', 13.99, 'Skewers', '/hero-grill.jpg'),
('Jerk Chicken Wings', 'Caribbean-inspired jerk seasoned wings', 10.99, 'Wings', '/chicken-grill.jpg');

-- Insert customization options
INSERT INTO public.customization_options (menu_item_id, name, type, options, is_required, extra_price) 
SELECT id, 'Spice Level', 'radio', '["Mild", "Medium", "Hot", "Extra Hot"]'::jsonb, true, 0 FROM public.menu_items WHERE category IN ('Chicken', 'Wings', 'Skewers');

INSERT INTO public.customization_options (menu_item_id, name, type, options, is_required, extra_price) 
SELECT id, 'Side Dish', 'select', '["Jollof Rice (+£3.50)", "Chips (+£2.50)", "Coleslaw (+£1.50)", "Plantain (+£2.00)", "None"]'::jsonb, false, 0 FROM public.menu_items;

INSERT INTO public.customization_options (menu_item_id, name, type, options, is_required, extra_price) 
SELECT id, 'Extra Sauce', 'checkbox', '["Peri Peri (+£0.50)", "Garlic Mayo (+£0.50)", "BBQ (+£0.50)", "Chilli Sauce (+£0.50)"]'::jsonb, false, 0 FROM public.menu_items;