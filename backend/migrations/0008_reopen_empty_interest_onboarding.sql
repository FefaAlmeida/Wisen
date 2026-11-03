UPDATE user_preferences
   SET interest_onboarding_completed = false
 WHERE cardinality(interests) = 0;
