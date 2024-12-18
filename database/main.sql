-- Use the default public schema
SHOW search_path;

-- **1. Roles Table**

-- This table defines the roles within our application and their hierarchical relationship.

-- Create the roles table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    parent_role INTEGER REFERENCES roles(id) ON DELETE SET NULL -- self-referencing for role hierarchy
);

-- Insert default roles with hierarchy (admin > staff > staff > staff-level-[1..5] > user > restricted-user > banned-user
START TRANSACTION ;
-- top-level role
INSERT INTO roles (name, parent_role) VALUES  ('admin', NULL);
-- staff inherits from admin
INSERT INTO roles (name, parent_role) VALUES ('staff', (SELECT id FROM roles WHERE name = 'admin'));
INSERT INTO roles (name, parent_role) VALUES ('staff-level-1', (SELECT id FROM roles WHERE name = 'staff'));
INSERT INTO roles (name, parent_role) VALUES ('staff-level-2', (SELECT id FROM roles WHERE name = 'staff-level-1'));
INSERT INTO roles (name, parent_role) VALUES ('staff-level-3', (SELECT id FROM roles WHERE name = 'staff-level-2'));
INSERT INTO roles (name, parent_role) VALUES ('staff-level-4', (SELECT id FROM roles WHERE name = 'staff-level-3'));
INSERT INTO roles (name, parent_role) VALUES ('staff-level-5', (SELECT id FROM roles WHERE name = 'staff-level-4'));
-- user inherits from staff
INSERT INTO roles (name, parent_role) VALUES ('user', (SELECT id FROM roles WHERE name = 'staff-level-5'));
INSERT INTO roles (name, parent_role) VALUES ('restricted-user', (SELECT id FROM roles WHERE name = 'user'));
INSERT INTO roles (name, parent_role) VALUES ('banned-user', (SELECT id FROM roles WHERE name = 'restricted-user'));
END TRANSACTION ;

-- **2. User Roles Table**

-- This table manages the assignment of roles to users.

-- Create the user_roles table
CREATE TABLE user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL, -- using Supabase default auth schema
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE NOT NULL,
    UNIQUE(user_id, role_id)
);

-- Function to check if a user has a specific role, considering the role hierarchy
CREATE OR REPLACE FUNCTION check_user_role(user_id UUID, role_name TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    role_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        WITH RECURSIVE role_hierarchy AS (
            SELECT id, parent_role
            FROM roles
            WHERE name = role_name
            UNION ALL
            SELECT r.id, r.parent_role
            FROM roles r
            INNER JOIN role_hierarchy rh ON r.id = rh.parent_role
        )
        SELECT 1
        FROM user_roles ur
        INNER JOIN role_hierarchy rh ON ur.role_id = rh.id
        WHERE ur.user_id = user_id
    ) INTO role_exists;

    RETURN role_exists;
END;
$$ LANGUAGE plpgsql;

-- Grant admin role to specific users (Leone and Nick)
INSERT INTO user_roles (user_id, role_id) VALUES
    ((SELECT id FROM auth.users WHERE email = 'Leone@gmail.com'), (SELECT id FROM roles WHERE name = 'admin')),
    ((SELECT id FROM auth.users WHERE email = 'Nick@gmail.com'), (SELECT id FROM roles WHERE name = 'admin'));

-- **3. Account Types Table**

-- This table defines the different types of user accounts (Individual, Group).

-- Create the account_types table
CREATE TABLE account_types (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL -- e.g., 'Individual', 'Group'
);

-- Insert default account types
INSERT INTO account_types (name) VALUES
    ('Individual'),
    ('Group');

-- **4. Individual Account Subtypes Table**

-- This table further categorizes Individual accounts (Normal, Locked).

-- Create the individual_account_subtypes table
CREATE TABLE individual_account_subtypes (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL -- e.g., 'Normal', 'Locked'
);

-- Insert default subtypes
INSERT INTO individual_account_subtypes (name) VALUES
    ('Normal'),
    ('Locked');

-- **5. User Profiles Table**

-- This table will store additional user information, and link to their account type.

-- Create the user_profiles table
CREATE TABLE user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE, -- Link to Supabase auth user
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone_number TEXT UNIQUE NOT NULL,
    id_number TEXT UNIQUE NOT NULL,
    account_type_id INTEGER REFERENCES account_types(id) NOT NULL,
    individual_account_subtype_id INTEGER REFERENCES individual_account_subtypes(id), -- NULL for Group accounts
    referral_code TEXT UNIQUE NOT NULL,
    referrer_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL, -- Self-referencing for referrals
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    verified BOOLEAN DEFAULT FALSE,
    verification_photo_path TEXT, -- Store the path to the verification photo
    terms_accepted BOOLEAN DEFAULT FALSE
);

-- Function to generate a unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
BEGIN
  RETURN substring(md5(random()::text), 1, 8); -- Example: generate an 8-character code
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically set the referral code and set the account type to 'Individual' upon user profile creation.
CREATE OR REPLACE FUNCTION set_referral_code_and_account_type()
RETURNS TRIGGER AS $$
BEGIN
  NEW.referral_code = generate_referral_code();
  NEW.account_type_id = (SELECT id FROM account_types WHERE name = 'Individual');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_referral_code_trigger
BEFORE INSERT ON user_profiles
FOR EACH ROW
EXECUTE PROCEDURE set_referral_code_and_account_type();

-- Enable RLS on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can view all user profiles
CREATE POLICY admin_view_all_user_profiles ON user_profiles
    FOR SELECT
    TO authenticated
    USING (check_user_role(auth.uid(), 'admin'));

-- Policy: Staff can view all user profiles
CREATE POLICY staff_view_all_user_profiles ON user_profiles
    FOR SELECT
    TO authenticated
    USING (check_user_role(auth.uid(), 'staff'));

-- Policy: Users can view their own profile
CREATE POLICY user_view_own_profile ON user_profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- **6. Group Accounts Table**

-- This table is for managing group accounts.

-- Create the group_accounts table
CREATE TABLE group_accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- The user who created the group, also group's admin
    account_type_id INTEGER REFERENCES account_types(id) DEFAULT (SELECT id FROM account_types WHERE name = 'Group'),
    group_name TEXT NOT NULL UNIQUE,
    referral_code TEXT UNIQUE NOT NULL,
    referrer_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL, -- Self-referencing for referrals, from user_profiles table
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    terms_accepted BOOLEAN DEFAULT FALSE,
    verified BOOLEAN DEFAULT FALSE
);

-- Function to generate a unique referral code
CREATE OR REPLACE FUNCTION generate_group_referral_code()
RETURNS TEXT AS $$
BEGIN
  RETURN substring(md5(random()::text), 1, 8); -- Example: generate an 8-character code
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically set the referral code upon group_accounts creation
CREATE OR REPLACE FUNCTION set_group_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  NEW.referral_code = generate_group_referral_code();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_group_referral_code_trigger
BEFORE INSERT ON group_accounts
FOR EACH ROW
EXECUTE PROCEDURE set_group_referral_code();

-- Enable RLS on group_accounts
ALTER TABLE group_accounts ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can view all group accounts
CREATE POLICY admin_view_all_group_accounts ON group_accounts
    FOR SELECT
    TO authenticated
    USING (check_user_role(auth.uid(), 'admin'));

-- Policy: Staff can view all group accounts
CREATE POLICY staff_view_all_group_accounts ON group_accounts
    FOR SELECT
    TO authenticated
    USING (check_user_role(auth.uid(), 'staff'));

-- Policy: Users can view group accounts they own
CREATE POLICY owner_view_own_group_account ON group_accounts
    FOR SELECT
    TO authenticated
    USING (auth.uid() = owner_id);

-- **7. Group Members Table**

-- This table stores information about members of a group.

-- Create the group_members table
CREATE TABLE group_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id UUID REFERENCES group_accounts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone_number TEXT UNIQUE NOT NULL,
    id_number TEXT UNIQUE NOT NULL,
    verification_photo_path TEXT, -- Store the path to the verification photo
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    verified BOOLEAN DEFAULT FALSE
);

-- Enable RLS on group_members
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can view all group members
CREATE POLICY admin_view_all_group_members ON group_members
    FOR SELECT
    TO authenticated
    USING (check_user_role(auth.uid(), 'admin'));

-- Policy: Staff can view all group members
CREATE POLICY staff_view_all_group_members ON group_members
    FOR SELECT
    TO authenticated
    USING (check_user_role(auth.uid(), 'staff'));

-- Policy: Group owners can view members of their group
CREATE POLICY group_owner_view_members ON group_members
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1
            FROM group_accounts
            WHERE id = group_id AND owner_id = auth.uid()
        )
    );

-- Policy: Group members can view details of other members in their group
CREATE POLICY group_members_view_each_other ON group_members
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1
            FROM group_members gm
            WHERE gm.group_id = group_id AND gm.user_id = auth.uid()
        )
    );

-- **8. Group Roles Table**

-- This table defines the roles within a group.

-- Create the group_roles table
CREATE TABLE group_roles (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    parent_role INTEGER REFERENCES group_roles(id) ON DELETE SET NULL -- self-referencing for role hierarchy within the group
);

-- Insert default group roles with hierarchy (owner > admin > member)
INSERT INTO group_roles (name, parent_role) VALUES
    ('owner', NULL), -- top-level role within a group
    ('admin', (SELECT id FROM group_roles WHERE name = 'owner')),
    ('chairperson', (SELECT id FROM group_roles WHERE name = 'admin')),
    ('vice-chair', (SELECT id FROM group_roles WHERE name = 'chairperson')),
    ('treasurer', (SELECT id FROM group_roles WHERE name = 'vice-chair')),
    ('secretary', (SELECT id FROM group_roles WHERE name = 'treasurer')),
    ('member', (SELECT id FROM group_roles WHERE name = 'secretary')); -- regular member

-- Add group_role_id column to group_members table
ALTER TABLE group_members
ADD COLUMN group_role_id INTEGER REFERENCES group_roles(id);

-- Update the group_members table to assign the 'owner' role to the group creator
CREATE OR REPLACE FUNCTION assign_owner_role_to_group_creator()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO group_members (group_id, user_id, group_role_id)
  VALUES (NEW.id, NEW.owner_id, (SELECT id FROM group_roles WHERE name = 'owner'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to assign the 'owner' role to the group creator after group creation
CREATE TRIGGER assign_owner_role_trigger
AFTER INSERT ON group_accounts
FOR EACH ROW
EXECUTE PROCEDURE assign_owner_role_to_group_creator();

-- Function to check if a user has a specific role within a group
CREATE OR REPLACE FUNCTION check_group_user_role(user_id UUID, group_id UUID, role_name TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    role_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        WITH RECURSIVE role_hierarchy AS (
            SELECT id, parent_role
            FROM group_roles
            WHERE name = role_name
            UNION ALL
            SELECT r.id, r.parent_role
            FROM group_roles r
            INNER JOIN role_hierarchy rh ON r.id = rh.parent_role
        )
        SELECT 1
        FROM group_members gm
        INNER JOIN role_hierarchy rh ON gm.group_role_id = rh.id
        WHERE gm.user_id = user_id AND gm.group_id = group_id
    ) INTO role_exists;

    RETURN role_exists;
END;
$$ LANGUAGE plpgsql;
