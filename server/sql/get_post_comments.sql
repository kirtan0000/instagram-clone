SELECT comments.*,
     users.pfp
FROM comments
     LEFT JOIN users ON comments.author = users.username
WHERE comments.post_id = ':ID:'
ORDER BY comments.timestamp DESC