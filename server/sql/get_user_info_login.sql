SELECT 
     password,
     jwt,
     refresh
from users
WHERE email = :EMAIL: