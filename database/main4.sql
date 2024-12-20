-- Database design for the investment groups application.

-- Extend the default auth.users table to store additional user information.
CREATE TABLE public.user_profiles
(
    id              UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    -- Consider making 'available_funds' a separate table with history for auditing
    available_funds NUMERIC NOT NULL         DEFAULT 0.00,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.user_profiles
    ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow individual read access to profiles." ON public.user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Allow individual update access to their own profile." ON public.user_profiles FOR UPDATE USING (auth.uid() = id);

-- Table to store different group types and their associated interest rates.
CREATE TABLE public.group_types
(
    id            SERIAL PRIMARY KEY,
    name          TEXT UNIQUE NOT NULL, -- e.g., "individual", "group"
    interest_rate NUMERIC     NOT NULL  -- e.g., 0.05 for 5%
);

-- Table to store the investment groups.
CREATE TABLE public.groups
(
    id                         UUID                     DEFAULT gen_random_uuid() PRIMARY KEY,
    name                       TEXT                                                          NOT NULL,
    type_id                    INTEGER REFERENCES public.group_types (id)                    NOT NULL,
    owner_id                   UUID REFERENCES auth.users (id)                               NOT NULL,
    created_at                 TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    contributions_finalized_at TIMESTAMP WITH TIME ZONE -- Timestamp when contributions are locked
);

ALTER TABLE public.groups
    ENABLE ROW LEVEL SECURITY;

-- Only the group owner can perform DELETE operations on groups.
CREATE POLICY "Owners can delete their groups." ON public.groups FOR DELETE USING (auth.uid() = owner_id);
-- Owners and admins can perform UPDATE operations on groups (e.g., finalizing contributions).
CREATE POLICY "Owners and admins can update their groups." ON public.groups FOR UPDATE USING (auth.uid() = owner_id OR
                                                                                              auth.uid() IN
                                                                                              (SELECT user_id
                                                                                               FROM public.group_members
                                                                                               WHERE group_id = id
                                                                                                 AND role IN ('owner', 'admin')));
-- Any authenticated user can create groups.
CREATE POLICY "Anyone can create groups." ON public.groups FOR INSERT WITH CHECK (TRUE);
-- Anyone can view group details.
CREATE POLICY "Anyone can view group details." ON public.groups FOR SELECT USING (TRUE);

-- Junction table for group members, managing roles within the group.
CREATE TABLE public.group_members
(
    group_id  UUID REFERENCES public.groups (id) ON DELETE CASCADE,
    user_id   UUID REFERENCES auth.users (id) ON DELETE CASCADE,
    role      TEXT                                                          NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (group_id, user_id)
);

ALTER TABLE public.group_members
    ENABLE ROW LEVEL SECURITY;

-- Only members of the group can view the members list.
CREATE POLICY "Members can view group members." ON public.group_members FOR SELECT USING (group_id IN (SELECT group_id
                                                                                                       FROM public.group_members
                                                                                                       WHERE user_id = auth.uid()));
-- Only owners and admins can insert new members.
CREATE POLICY "Owners and admins can add members." ON public.group_members FOR INSERT WITH CHECK (group_id IN (SELECT id
                                                                                                               FROM public.groups
                                                                                                               WHERE owner_id = auth.uid()) OR
                                                                                                  group_id IN
                                                                                                  (SELECT group_id
                                                                                                   FROM public.group_members
                                                                                                   WHERE user_id = auth.uid()
                                                                                                     AND role = 'admin'));
-- Owners and admins can delete members.
CREATE POLICY "Owners and admins can remove members." ON public.group_members FOR DELETE USING (group_id IN (SELECT id
                                                                                                             FROM public.groups
                                                                                                             WHERE owner_id = auth.uid()) OR
                                                                                                group_id IN
                                                                                                (SELECT group_id
                                                                                                 FROM public.group_members
                                                                                                 WHERE user_id = auth.uid()
                                                                                                   AND role = 'admin'));

-- Table to store individual user contributions to a group.
CREATE TABLE public.contributions
(
    id         UUID                     DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id   UUID REFERENCES public.groups (id) ON DELETE CASCADE,
    user_id    UUID REFERENCES auth.users (id) ON DELETE CASCADE,
    amount     NUMERIC                                                       NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.contributions
    ENABLE ROW LEVEL SECURITY;

-- Only members of the group can view contributions.
CREATE POLICY "Members can view group contributions." ON public.contributions FOR SELECT USING (group_id IN
                                                                                                (SELECT group_id
                                                                                                 FROM public.group_members
                                                                                                 WHERE user_id = auth.uid()));
-- Only members can create contributions if the group hasn't finalized contributions.
CREATE POLICY "Members can create contributions if not finalized." ON public.contributions FOR INSERT WITH CHECK (
    group_id IN (SELECT group_id
                 FROM public.group_members
                 WHERE user_id = auth.uid()) AND
    group_id IN (SELECT id
                 FROM public.groups
                 WHERE contributions_finalized_at IS NULL)
    );

-- Table to store group invite links.
CREATE TABLE public.group_invites
(
    id                 UUID                     DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id           UUID REFERENCES public.groups (id) ON DELETE CASCADE,
    invite_code        TEXT UNIQUE                                                   NOT NULL,
    created_by_user_id UUID REFERENCES auth.users (id), -- User who created the invite
    created_at         TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at         TIMESTAMP WITH TIME ZONE         -- Optional expiration time for the invite link
);

ALTER TABLE public.group_invites
    ENABLE ROW LEVEL SECURITY;

-- Only members of the group can view invites.
CREATE POLICY "Members can view group invites." ON public.group_invites FOR SELECT USING (group_id IN (SELECT group_id
                                                                                                       FROM public.group_members
                                                                                                       WHERE user_id = auth.uid()));
-- Only owners and admins can create invites.
CREATE POLICY "Owners and admins can create invites." ON public.group_invites FOR INSERT WITH CHECK (
    group_id IN (SELECT id
                 FROM public.groups
                 WHERE owner_id = auth.uid()) OR group_id IN (SELECT group_id
                                                              FROM public.group_members
                                                              WHERE user_id = auth.uid()
                                                                AND role = 'admin'));
-- Owners and admins can delete invites.
CREATE POLICY "Owners and admins can delete invites." ON public.group_invites FOR DELETE USING (group_id IN (SELECT id
                                                                                                             FROM public.groups
                                                                                                             WHERE owner_id = auth.uid()) OR
                                                                                                group_id IN
                                                                                                (SELECT group_id
                                                                                                 FROM public.group_members
                                                                                                 WHERE user_id = auth.uid()
                                                                                                   AND role = 'admin'));

--------------------------------------------------------------------------------------
-- SQL statements for the specified queries:
--------------------------------------------------------------------------------------

-- 1. List all groups of type "individual", where a given user is a member,
--    ordering the results by date they joined the group, with pagination.
SELECT g.id,
       g.name,
       gt.name AS group_type,
       gm.joined_at
FROM public.groups g
         JOIN public.group_types gt ON g.type_id = gt.id
         JOIN public.group_members gm ON g.id = gm.group_id
WHERE gt.name = 'individual'
  AND gm.user_id = 'your_user_id' -- Replace with the actual user ID
ORDER BY gm.joined_at
LIMIT 10 -- Adjust for pagination
    OFFSET 0;
-- Adjust for pagination

-- 2. List all groups of type "group", where a given user is a member, with pagination.
SELECT g.id,
       g.name,
       gt.name AS group_type,
       gm.joined_at
FROM public.groups g
         JOIN public.group_types gt ON g.type_id = gt.id
         JOIN public.group_members gm ON g.id = gm.group_id
WHERE gt.name = 'group'
  AND gm.user_id = 'your_user_id' -- Replace with the actual user ID
LIMIT 10 -- Adjust for pagination
    OFFSET 0;
-- Adjust for pagination

-- 3. A user to create a group of type "individual".
INSERT INTO public.groups (name, type_id, owner_id)
VALUES ('My Individual Group', (SELECT id FROM public.group_types WHERE name = 'individual'), auth.uid());
-- Immediately add the creator as the owner in group_members
INSERT INTO public.group_members (group_id, user_id, role)
VALUES (currval('groups_id_seq'::regclass), auth.uid(), 'owner');
-- Assuming 'id' is SERIAL

-- 4. A user to create a group of type "group".
INSERT INTO public.groups (name, type_id, owner_id)
VALUES ('My Friends Group', (SELECT id FROM public.group_types WHERE name = 'group'), auth.uid());
-- Immediately add the creator as the owner in group_members
INSERT INTO public.group_members (group_id, user_id, role)
VALUES (currval('groups_id_seq'::regclass), auth.uid(), 'owner');
-- Assuming 'id' is SERIAL

-- 5. A group owner to add a given user to a given group they own by the group id.
INSERT INTO public.group_members (group_id, user_id, role)
VALUES ('your_group_id', 'user_to_add_id', 'member');
-- Replace with actual IDs

-- 6. A group owner to remove a given user from a given group they own by the group id.
DELETE
FROM public.group_members
WHERE group_id = 'your_group_id'
  AND user_id = 'user_to_remove_id';
-- Replace with actual IDs

-- 7. Check whether a given user is the owner of a given group.
SELECT EXISTS (SELECT 1
               FROM public.groups
               WHERE id = 'your_group_id' -- Replace with the actual group ID
                 AND owner_id = 'your_user_id' -- Replace with the actual user ID
);

-- 8. Read all details of a given group.
SELECT g.id,
       g.name,
       gt.name AS group_type,
       g.owner_id,
       g.created_at,
       g.contributions_finalized_at
FROM public.groups g
         JOIN public.group_types gt ON g.type_id = gt.id
WHERE g.id = 'your_group_id';
-- Replace with the actual group ID

-- 9. Join a group from its invite link, invite links may expire.
INSERT INTO public.group_members (group_id, user_id, role)
SELECT gi.group_id,
       auth.uid(),
       'member'
FROM public.group_invites gi
WHERE gi.invite_code = 'your_invite_code' -- Replace with the actual invite code
  AND (gi.expires_at IS NULL OR gi.expires_at > now())
  AND NOT EXISTS (SELECT 1
                  FROM public.group_members
                  WHERE group_id = gi.group_id
                    AND user_id = auth.uid());

-- 10. Leave a group at will.
DELETE
FROM public.group_members
WHERE group_id = 'your_group_id' -- Replace with the actual group ID
  AND user_id = auth.uid();

-- 11. Given a group id, check if a given user is a member of the group.
SELECT EXISTS (SELECT 1
               FROM public.group_members
               WHERE group_id = 'your_group_id' -- Replace with the actual group ID
                 AND user_id = 'your_user_id' -- Replace with the actual user ID
);
