-- 004_health_check_photos.sql
-- Add photos support to health_check_items

ALTER TABLE handld.health_check_items
ADD COLUMN photos JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN handld.health_check_items.photos IS 'Array of photo objects: [{url, filename}]';
