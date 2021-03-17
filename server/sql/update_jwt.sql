UPDATE users
SET jwt = ':NEW_JWT:'
WHERE email = ':USER_EMAIL:'