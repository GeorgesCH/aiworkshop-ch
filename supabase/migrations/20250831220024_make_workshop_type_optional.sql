-- Make workshop_type optional for draft bookings

-- Drop the NOT NULL constraint on workshop_type
ALTER TABLE workshop_bookings ALTER COLUMN workshop_type DROP NOT NULL;

-- Add a check constraint to ensure workshop_type is provided for non-draft bookings
ALTER TABLE workshop_bookings ADD CONSTRAINT workshop_bookings_workshop_type_check 
    CHECK (status = 'draft' OR workshop_type IS NOT NULL);
