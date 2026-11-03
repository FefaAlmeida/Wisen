ALTER TABLE user_preferences
  ADD COLUMN review_reminders boolean NOT NULL DEFAULT true,
  ADD COLUMN weekly_summary boolean NOT NULL DEFAULT false;