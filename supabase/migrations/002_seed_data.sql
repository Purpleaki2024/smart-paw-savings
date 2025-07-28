-- Seed data for Smart Paw Savings

-- Insert expense categories
INSERT INTO expense_categories (name, icon, color, is_pet_related) VALUES
-- Pet-related categories
('Pet Food', '🍖', '#FF6B6B', true),
('Veterinary Care', '🏥', '#4ECDC4', true),
('Pet Grooming', '✂️', '#45B7D1', true),
('Pet Supplies', '🧸', '#96CEB4', true),
('Pet Insurance', '🛡️', '#FFEAA7', true),
('Pet Training', '🎓', '#DDA0DD', true),
('Pet Boarding', '🏠', '#98D8C8', true),
('Pet Medication', '💊', '#F7DC6F', true),

-- General categories
('Groceries', '🛒', '#82E0AA', false),
('Transportation', '🚗', '#AED6F1', false),
('Utilities', '⚡', '#F8C471', false),
('Entertainment', '🎬', '#BB8FCE', false),
('Healthcare', '🏥', '#85C1E9', false),
('Shopping', '🛍️', '#F1948A', false),
('Dining', '🍽️', '#7FB3D3', false),
('Education', '📚', '#73C6B6', false);

-- Insert sample care tips
INSERT INTO care_tips (title, content, category, pet_types, difficulty_level, estimated_savings, image_url, tags) VALUES
('DIY Dog Grooming at Home', 
 'Learn to groom your dog at home with these step-by-step instructions. You''ll need basic grooming tools: a brush, nail clippers, dog shampoo, and towels. Start by brushing thoroughly to remove loose fur and mats. Trim nails carefully, cutting only the white tips. Bathe with lukewarm water and dog-specific shampoo. Dry thoroughly and brush again.',
 'grooming', 
 ARRAY['dog'], 
 'medium', 
 45.00,
 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee',
 ARRAY['grooming', 'diy', 'cost-saving', 'hygiene']
),

('Homemade Cat Treats Recipe',
 'Save money on expensive cat treats by making healthy ones at home. Mix 1 cup whole wheat flour, 1/4 cup cornmeal, 1 egg, 1/3 cup chicken broth, and 1 tbsp vegetable oil. Roll into small balls and bake at 350°F for 12-15 minutes. Store in an airtight container for up to a week.',
 'nutrition',
 ARRAY['cat'],
 'easy',
 15.00,
 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e',
 ARRAY['treats', 'homemade', 'nutrition', 'baking']
),

('Preventive Dental Care for Pets',
 'Regular dental care can prevent expensive dental procedures. Brush your pet''s teeth 2-3 times weekly with pet-safe toothpaste. Provide dental chews and toys. Watch for signs of dental issues: bad breath, yellow tartar, difficulty eating. Early intervention saves money on costly dental surgeries.',
 'health',
 ARRAY['dog', 'cat'],
 'easy',
 200.00,
 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1',
 ARRAY['dental', 'preventive', 'health', 'teeth']
),

('DIY Pet Toys from Household Items',
 'Create engaging toys without spending money. For cats: cardboard boxes, paper bags, toilet paper rolls with treats inside. For dogs: old t-shirts braided into rope toys, tennis balls, frozen treats in ice cube trays. Always supervise play and check toys for wear.',
 'entertainment',
 ARRAY['dog', 'cat', 'bird'],
 'easy',
 25.00,
 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64',
 ARRAY['toys', 'diy', 'entertainment', 'enrichment']
),

('Basic Pet First Aid',
 'Learn basic first aid to handle minor emergencies and know when to call a vet. Keep a pet first aid kit with bandages, antiseptic, thermometer, and emergency vet contact. Know how to handle cuts, choking, and heatstroke. Quick action can prevent expensive emergency visits.',
 'health',
 ARRAY['dog', 'cat'],
 'medium',
 150.00,
 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97',
 ARRAY['first-aid', 'emergency', 'health', 'safety']
);

-- Insert sample insurance providers
INSERT INTO insurance_providers (name, website_url, contact_info, coverage_types, rating, reviews_count) VALUES
('PetPlan UK', 'https://www.petplan.co.uk', 
 '{"phone": "0345 071 8000", "email": "info@petplan.co.uk"}',
 ARRAY['accident', 'illness', 'dental', 'wellness'],
 4.2, 15420
),

('Direct Line Pet Insurance', 'https://www.directline.com/pet-insurance',
 '{"phone": "0345 246 8704", "email": "pet.insurance@directlinegroup.co.uk"}',
 ARRAY['accident', 'illness', 'third-party'],
 4.1, 8930
),

('More Than Pet Insurance', 'https://www.morethan.com/pet-insurance',
 '{"phone": "0330 024 6848", "email": "customer.services@morethan.com"}',
 ARRAY['accident', 'illness', 'dental'],
 3.9, 6750
),

('Bought By Many', 'https://boughtbymany.com/pet-insurance',
 '{"phone": "020 3984 9400", "email": "hello@boughtbymany.com"}',
 ARRAY['accident', 'illness', 'wellness', 'alternative-therapy'],
 4.4, 12300
);

-- Insert sample discounts
INSERT INTO discounts (merchant_name, discount_code, discount_percentage, description, category_id, valid_from, valid_to, usage_limit) VALUES
('Pets at Home', 'SAVE15', 15.00, '15% off all pet food purchases over £30', 
 (SELECT id FROM expense_categories WHERE name = 'Pet Food'), 
 CURRENT_DATE, 
 CURRENT_DATE + INTERVAL '30 days', 
 1000
),

('Vets4Pets', 'HEALTH20', 20.00, '20% off annual health check-ups for new customers',
 (SELECT id FROM expense_categories WHERE name = 'Veterinary Care'),
 CURRENT_DATE,
 CURRENT_DATE + INTERVAL '60 days',
 500
),

('Groomers Choice', 'GROOM10', 10.00, '10% off professional grooming services',
 (SELECT id FROM expense_categories WHERE name = 'Pet Grooming'),
 CURRENT_DATE,
 CURRENT_DATE + INTERVAL '45 days',
 300
),

('Pet Supplies Plus', 'BULK25', 25.00, '25% off when buying 3 or more of the same item',
 (SELECT id FROM expense_categories WHERE name = 'Pet Supplies'),
 CURRENT_DATE,
 CURRENT_DATE + INTERVAL '14 days',
 200
);
