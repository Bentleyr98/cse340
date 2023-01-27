-- Q1 Insert new record
INSERT INTO client(client_firstname, client_lastname, client_email, client_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Q2 Update client type for Tony
UPDATE client
SET client_type = 'Admin'
WHERE client_id = 1;

-- Q3 Delete Tony from DB
DELETE FROM client WHERE client_id = 1;

-- Q4 Update wording in GM Hummer record
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_id = 10;

-- Q5 Inner join on inventory & classification tables
SELECT i.inv_make, i.inv_model, c.classification_name
FROM inventory i INNER JOIN classification c
ON i.classification_id = c.classification_id
WHERE c.classification_id = 2;

-- Q6 Update path column in inventory
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images', '/images/vehicles'), inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');