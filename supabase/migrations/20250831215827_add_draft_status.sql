-- Add draft status to workshop bookings

-- Update the check constraint to allow 'draft' status
ALTER TABLE workshop_bookings DROP CONSTRAINT IF EXISTS workshop_bookings_status_check;
ALTER TABLE workshop_bookings ADD CONSTRAINT workshop_bookings_status_check 
    CHECK (status IN ('draft', 'pending', 'confirmed', 'cancelled'));
