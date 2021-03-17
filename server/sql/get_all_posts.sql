SELECT posts.*,
     users.pfp
FROM posts
     LEFT JOIN users ON posts.author = users.username
ORDER BY posts.timestamp DESC