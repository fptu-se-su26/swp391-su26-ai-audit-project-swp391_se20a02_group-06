-- Add is_draft column to exercises table
-- Run this once per environment (local, staging, production)
-- This enables PT-exclusive draft exercise functionality

ALTER TABLE `exercises`
ADD COLUMN IF NOT EXISTS `is_draft` TINYINT(1) NOT NULL DEFAULT 0
    COMMENT '1 = saved as draft by PT, 0 = published (default)';
