SELECT title,
     image_id,
     id,
     timestamp
FROM posts
WHERE author = :USERNAME: