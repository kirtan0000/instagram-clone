SELECT chats.*,
     users.pfp
FROM users
     LEFT JOIN chats ON chats.author = users.username
WHERE (
          chats.to_name = ':TO:'
          AND chats.author = ':FROM:'
     )
     OR (
          chats.to_name = ':FROM:'
          AND chats.author = ':TO:'
     )