-- Ajoute les colonnes Stripe et corrige la limite gratuite à 3 posts
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- Met à jour la limite par défaut du plan gratuit de 5 à 3
UPDATE profiles
SET generations_limit = 3
WHERE role = 'free' AND generations_limit = 5;

-- Assure que les nouveaux profils free démarrent avec 3
ALTER TABLE profiles
ALTER COLUMN generations_limit SET DEFAULT 3;
