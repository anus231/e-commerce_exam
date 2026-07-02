-- Clear existing records (optional)
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM products;
DELETE FROM users;

-- Seed Admin User (password: admin123, hashed with bcryptjs)
INSERT INTO users (name, email, password_hash, role) VALUES (
  'Agaseke Admin',
  'admin@ansusirleaf.rw',
  '$2b$10$y/yuVRacJ0qenKJb3BooieTfelCb686bCLjzTcNGkEAFvp094Halm',
  'admin'
);

-- Seed Products
INSERT INTO products (name, description, price, category, image_url, stock, artisan_name, artisan_location) VALUES
(
  'Classic Agaseke Peace Basket',
  'The iconic Rwandan Agaseke basket, hand-woven from sisal fibers and sweetgrass. Symbolizes peace, unity, and traditional craftsmanship. Perfect as a gift, centerpiece, or jewelry holder.',
  25.00,
  'Baskets',
  '/images/products/agaseke_peace.jpg',
  15,
  'Mukamanzi Marie',
  'Huye, Southern Province'
),
(
  'Royal Imigongo Geometric Painting',
  'Authentic Imigongo art made using traditional methods. Cow dung is molded onto a wooden board to create geometric ridges, then painted with organic black, white, and red pigments.',
  45.00,
  'Art & Painting',
  '/images/products/imigongo_royal.jpg',
  8,
  'Ndahimana Jean',
  'Kirehe, Eastern Province'
),
(
  'Hand-woven Kitenge Tote Bag',
  'A sturdy and fashionable tote bag made from high-quality Rwandan Kitenge wax print fabric with a durable canvas lining and leather straps. Ideal for daily shopping or beach days.',
  18.50,
  'Apparel & Accessories',
  '/images/products/kitenge_tote.jpg',
  25,
  'Niyonisenga Beatrice',
  'Musanze, Northern Province'
),
(
  'Hand-carved Wooden Gorilla Sculpture',
  'Exquisitely hand-carved from local jacaranda wood, this sculpture honors the famous mountain gorillas of Volcanoes National Park. Each piece features unique grain patterns and details.',
  35.00,
  'Home Decor',
  '/images/products/wooden_gorilla.jpg',
  6,
  'Gasana Emmanuel',
  'Rubavu, Western Province'
),
(
  'Clay Pottery Water Urn',
  'Hand-molded earthenware pot crafted using ancient techniques passed down through generations. Finished with a natural burnished look. Highly decorative and functional.',
  30.00,
  'Home Decor',
  '/images/products/pottery_urn.jpg',
  5,
  'Nyiraharerimana Clotilde',
  'Gicumbi, Northern Province'
),
(
  'Handcrafted Beaded Statement Necklace',
  'Stunning necklace featuring vibrant local beads woven into intricate patterns by women collectives. Features a secure brass clasp.',
  15.00,
  'Apparel & Accessories',
  '/images/products/beaded_necklace.jpg',
  30,
  'Uwera Alice',
  'Kigali, Nyarugenge'
),
(
  'Imigongo Sunburst Wooden Board',
  'Modern variant of Imigongo art displaying a stunning sunburst pattern. Adds a bold artistic accent to any contemporary home or office.',
  40.00,
  'Art & Painting',
  '/images/products/imigongo_sunburst.jpg',
  10,
  'Ndahimana Jean',
  'Kirehe, Eastern Province'
),
(
  'Miniature Agaseke Gift Baskets (Set of 3)',
  'A delightful set of three miniature Agaseke baskets in matching warm tones. Perfect for storage of small accessories or as festive decorations.',
  20.00,
  'Baskets',
  '/images/products/mini_agaseke_set.jpg',
  20,
  'Mukamanzi Marie',
  'Huye, Southern Province'
);
