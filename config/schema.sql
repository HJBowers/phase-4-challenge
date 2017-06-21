CREATE TABLE albums (
  id SERIAL,
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255) NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE users (
  id SERIAL,
  name VARCHAR(255) NOT NULL,
  localpassword VARCHAR(255) NOT NULL,
  localemail VARCHAR(255) NOT NULL,
  createdat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(id)
);

CREATE TABLE reviews (
  review_id int NOT NULL PRIMARY KEY,
  album_id int NOT NULL,
  user_id int NOT NULL,
  review text NOT NULL,
  FOREIGN KEY (album_id) REFERENCES albums (id),
  FOREIGN KEY (user_id) REFERENCES users (id)
);
