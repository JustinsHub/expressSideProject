\c express_auth 

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_name text NOT NULL,
    last_name text NOT NULL,
    username text UNIQUE NOT NULL,
    password text NOT NULL,
    email text NOT NULL
);
