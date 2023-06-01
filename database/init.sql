CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO users (name, email)
VALUES ('John Doe', 'john.doe@example.com'),
       ('Jane Smith', 'jane.smith@example.com'),
       ('Mike Johnson', 'mike.johnson@example.com'),
       ('Alexander Anderson', 'alex.anderson@example.com'),
       ('Elizabeth Thompson', 'elizabeth.thompson@example.com');