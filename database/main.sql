-- Note: You may notice functions named with the prefix `Cf`, this simply means, `Custom Function`. We use
-- this syntax to ensure we do not clash with any built-in functions.

-- Check to see the default SCHEMA search paths
-- By default, this is set to: "\$user", public, extensions
SHOW search_path;

-- **1. Roles Table**

-- This table defines the roles within our application and their hierarchical relationship.

-- Create the roles table
CREATE TABLE roles
(
    id          SERIAL PRIMARY KEY,
    name        TEXT UNIQUE NOT NULL,
    parent_role INTEGER     REFERENCES roles (id) ON DELETE SET NULL -- self-referencing for role hierarchy
);

-- Insert default roles with hierarchy (admin > staff > staff-level-[1..5] > user > restricted-user > banned-user)
-- With this hierarchy, for example, with only an admin role, the admin user can access everything any other role
-- down the chain can access; say, an admin can do anything a staff can,
-- but a staff can't do anything an admin-only role can.
BEGIN;
-- top-level role
INSERT INTO roles (name, parent_role)
VALUES ('admin', NULL);
-- staff inherits from admin
INSERT INTO roles (name, parent_role)
VALUES ('staff', (SELECT id FROM roles WHERE name = 'admin'));
INSERT INTO roles (name, parent_role)
VALUES ('staff-level-1', (SELECT id FROM roles WHERE name = 'staff'));
INSERT INTO roles (name, parent_role)
VALUES ('staff-level-2', (SELECT id FROM roles WHERE name = 'staff-level-1'));
INSERT INTO roles (name, parent_role)
VALUES ('staff-level-3', (SELECT id FROM roles WHERE name = 'staff-level-2'));
INSERT INTO roles (name, parent_role)
VALUES ('staff-level-4', (SELECT id FROM roles WHERE name = 'staff-level-3'));
INSERT INTO roles (name, parent_role)
VALUES ('staff-level-5', (SELECT id FROM roles WHERE name = 'staff-level-4'));
-- user inherits from the lowest staff level: staff-level-5
INSERT INTO roles (name, parent_role)
VALUES ('user', (SELECT id FROM roles WHERE name = 'staff-level-5'));
INSERT INTO roles (name, parent_role)
VALUES ('anon-user', (SELECT id FROM roles WHERE name = 'user'));
INSERT INTO roles (name, parent_role)
VALUES ('restricted-user', (SELECT id FROM roles WHERE name = 'anon-user'));
INSERT INTO roles (name, parent_role)
VALUES ('banned-user', (SELECT id FROM roles WHERE name = 'restricted-user'));
COMMIT;

-- **2. User Roles Table**

-- This table manages the assignment of roles to users.

-- Create the user_roles table
CREATE TABLE user_roles
(
    id      UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users (id) ON DELETE CASCADE NOT NULL, -- using Supabase default auth schema
    role_id INTEGER REFERENCES roles (id) ON DELETE CASCADE   NOT NULL,
    UNIQUE (user_id, role_id)
);

-- Function to check if a user has a specific role, considering the role hierarchy
CREATE OR REPLACE FUNCTION Cf_check_user_role(p_user_id UUID, role_name TEXT)
    RETURNS BOOLEAN AS
$$
DECLARE
    role_exists BOOLEAN;
BEGIN
    SELECT EXISTS (WITH RECURSIVE role_hierarchy AS (SELECT id, parent_role
                                                     FROM roles
                                                     WHERE name = role_name
                                                     UNION ALL
                                                     SELECT r.id, r.parent_role
                                                     FROM roles r
                                                              INNER JOIN role_hierarchy rh ON r.id = rh.parent_role)
                   SELECT 1
                   FROM user_roles ur
                            INNER JOIN role_hierarchy rh ON ur.role_id = rh.id
                   WHERE ur.user_id = p_user_id)
    INTO role_exists;

    RETURN role_exists;
END;
$$ LANGUAGE plpgsql;

-- Grant admin role to specific users (Leone and Nick)
INSERT INTO user_roles (user_id, role_id)
VALUES ((SELECT id FROM auth.users WHERE email = 'Leone@gmail.com'), (SELECT id FROM roles WHERE name = 'admin')),
       ((SELECT id FROM auth.users WHERE email = 'Nick@gmail.com'), (SELECT id FROM roles WHERE name = 'admin'));

-- **3. Account Types Table**

-- This table defines the different types of user accounts (Individual, Group).

-- Create the investment accounts table
CREATE TABLE accounts
(
    id           SERIAL PRIMARY KEY,
    type         TEXT NOT NULL , -- 'individual' or 'group'
    name         TEXT UNIQUE NOT NULL, -- unique name, may be 'individual_normal', 'individual_locked', 'group'
    display_name TEXT        NOT NULL, -- e.g., 'Normal', 'Locked', 'Group'
    min_amount  NUMERIC(10, 2) NOT NULL,
    max_amount  NUMERIC(10, 2) NOT NULL,
    interest  NUMERIC(10, 2) NOT NULL,
    description  TEXT
);

-- A user can create multiple investment accounts
CREATE TABLE user_accounts
(
    id             UUID                     DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id        UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
    account_id     UUID NOT NULL REFERENCES accounts (id) ON DELETE CASCADE,
    balance        NUMERIC(10, 2),
    created_at     TIMESTAMPTZ              DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    verified       BOOLEAN                  DEFAULT FALSE, -- has the payment for this investment plan been received
    deleted       BOOLEAN                  DEFAULT FALSE, -- has this investment plan been done with
    terms_accepted BOOLEAN                  DEFAULT FALSE
);










