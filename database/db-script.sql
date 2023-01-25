CREATE TYPE public.client_type AS ENUM
    ('Client', 'Employee', 'Admin');

ALTER TYPE public.client_type
    OWNER TO cse340;


    