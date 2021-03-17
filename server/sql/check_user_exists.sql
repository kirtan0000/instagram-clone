SELECT username,
     email
FROM users
WHERE username = :NAME:
     OR email = :EMAIL: