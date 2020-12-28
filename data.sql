\c express_auth 

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id serial PRIMARY KEY,
    first_name text NOT NULL,
    last_name text NOT NULL,
    username text UNIQUE NOT NULL,
    password text NOT NULL
);

INSERT INTO users (first_name, last_name, username, password)
VALUES ('Dexter', 'Wexter', 'Solobolo', 'Helloworld')