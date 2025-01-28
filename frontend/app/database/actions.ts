import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase: SupabaseClient = createClient(supabaseUrl!, supabaseAnonKey!);

const ITEMS_PER_PAGE = 10; // Define pagination size

// 1. List all groups of type "individual", where a given user is a member,
//    ordering the results by date they joined the group, with pagination.
export const listIndividualGroupsForUser = async (userId: string, page: number = 1) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE - 1;

    const { data, error, count } = await supabase
        .from('groups')
        .select('id, name, group_members!inner(joined_at)', { count: 'exact' })
        .eq('type_id', 1) // Assuming 'individual' group type has ID 1
        .eq('group_members.user_id', userId)
        .order('group_members_joined_at', { ascending: true })
        .range(startIndex, endIndex);

    if (error) {
        console.error('Error listing individual groups:', error);
        throw error;
    }

    return { data, count };
};

// 2. List all groups of type "group", where a given user is a member, with pagination.
export const listGroupTypeGroupsForUser = async (userId: string, page: number = 1) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE - 1;

    const { data, error, count } = await supabase
        .from('groups')
        .select('id, name, group_members!inner', { count: 'exact' })
        .eq('type_id', 2) // Assuming 'group' group type has ID 2
        .eq('group_members.user_id', userId)
        .range(startIndex, endIndex);

    if (error) {
        console.error('Error listing group type groups:', error);
        throw error;
    }

    return { data, count };
};

// 3. A user to create a group of type "individual".
export const createIndividualGroup = async (userId: string, groupName: string) => {
    const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .insert([
            { name: groupName, type_id: 1, owner_id: userId }, // Assuming 'individual' group type has ID 1
        ])
        .select()
        .single();

    if (groupError) {
        console.error('Error creating individual group:', groupError);
        throw groupError;
    }

    // Immediately add the creator as the owner in group_members
    const { error: memberError } = await supabase
        .from('group_members')
        .insert([
            { group_id: groupData.id, user_id: userId, role: 'owner' },
        ]);

    if (memberError) {
        console.error('Error adding owner to group_members:', memberError);
        throw memberError;
    }

    return groupData;
};

// 4. A user to create a group of type "group".
export const createGroupTypeGroup = async (userId: string, groupName: string) => {
    const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .insert([
            { name: groupName, type_id: 2, owner_id: userId }, // Assuming 'group' group type has ID 2
        ])
        .select()
        .single();

    if (groupError) {
        console.error('Error creating group type group:', groupError);
        throw groupError;
    }

    // Immediately add the creator as the owner in group_members
    const { error: memberError } = await supabase
        .from('group_members')
        .insert([
            { group_id: groupData.id, user_id: userId, role: 'owner' },
        ]);

    if (memberError) {
        console.error('Error adding owner to group_members:', memberError);
        throw memberError;
    }

    return groupData;
};

// 5. A group owner to add a given user to a given group they own by the group id.
export const addMemberToGroup = async (ownerId: string, groupId: string, userToAddId: string) => {
    // First, verify that the user adding the member is the owner
    const { data: isOwner, error: ownerCheckError } = await supabase
        .from('groups')
        .select('id')
        .eq('id', groupId)
        .eq('owner_id', ownerId)
        .single();

    if (ownerCheckError) {
        console.error('Error checking group ownership:', ownerCheckError);
        throw ownerCheckError;
    }

    if (!isOwner) {
        throw new Error('Only the group owner can add members.');
    }

    const { data, error } = await supabase
        .from('group_members')
        .insert([
            { group_id: groupId, user_id: userToAddId, role: 'member' },
        ]);

    if (error) {
        console.error('Error adding member to group:', error);
        throw error;
    }

    return data;
};

// 6. A group owner to remove a given user from a given group they own by the group id.
export const removeMemberFromGroup = async (ownerId: string, groupId: string, userToRemoveId: string) => {
    // First, verify that the user removing the member is the owner
    const { data: isOwner, error: ownerCheckError } = await supabase
        .from('groups')
        .select('id')
        .eq('id', groupId)
        .eq('owner_id', ownerId)
        .single();

    if (ownerCheckError) {
        console.error('Error checking group ownership:', ownerCheckError);
        throw ownerCheckError;
    }

    if (!isOwner) {
        throw new Error('Only the group owner can remove members.');
    }

    const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', userToRemoveId);

    if (error) {
        console.error('Error removing member from group:', error);
        throw error;
    }

    return true;
};

// 7. Check whether a given user is the owner of a given group
export const isGroupOwner = async (userId: string, groupId: string): Promise<boolean> => {
    const { data, error } = await supabase
        .from('groups')
        .select('id')
        .eq('id', groupId)
        .eq('owner_id', userId);

    if (error) {
        console.error('Error checking group ownership:', error);
        throw error;
    }

    return data.length > 0;
};

// 8. Read all details of a given group.
export const getGroupDetails = async (groupId: string) => {
    const { data, error } = await supabase
        .from('groups')
        .select('*, group_types(*)')
        .eq('id', groupId)
        .single();

    if (error) {
        console.error('Error fetching group details:', error);
        throw error;
    }

    return data;
};

// 9. Join a group from its invite link, invite links may expire.
export const joinGroupWithInvite = async (userId: string, inviteCode: string) => {
    const { data: inviteData, error: inviteError } = await supabase
        .from('group_invites')
        .select('group_id, expires_at')
        .eq('invite_code', inviteCode)
        .single();

    if (inviteError) {
        console.error('Error fetching invite details:', inviteError);
        throw inviteError;
    }

    if (!inviteData) {
        throw new Error('Invalid invite code.');
    }

    if (inviteData.expires_at && new Date(inviteData.expires_at) < new Date()) {
        throw new Error('Invite link has expired.');
    }

    // Check if the user is already a member
    const { data: existingMember, error: memberCheckError } = await supabase
        .from('group_members')
        .select('user_id')
        .eq('group_id', inviteData.group_id)
        .eq('user_id', userId)
        .single();

    if (memberCheckError) {
        console.error('Error checking existing membership:', memberCheckError);
        throw memberCheckError;
    }

    if (existingMember) {
        throw new Error('You are already a member of this group.');
    }

    const { data, error: joinError } = await supabase
        .from('group_members')
        .insert([
            { group_id: inviteData.group_id, user_id: userId, role: 'member' },
        ]);

    if (joinError) {
        console.error('Error joining group:', joinError);
        throw joinError;
    }

    return data;
};

// 10. Leave a group at will.
export const leaveGroup = async (userId: string, groupId: string) => {
    const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', userId);

    if (error) {
        console.error('Error leaving group:', error);
        throw error;
    }

    return true;
};

// 11. Given a group id, check if a given user is a member of the group.
export const isGroupMember = async (userId: string, groupId: string): Promise<boolean> => {
    const { data, error } = await supabase
        .from('group_members')
        .select('user_id')
        .eq('group_id', groupId)
        .eq('user_id', userId);

    if (error) {
        console.error('Error checking group membership:', error);
        throw error;
    }

    return data.length > 0;
};

