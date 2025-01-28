'use client'

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
    Container,
    Typography,
    List,
    ListItem,
    ListItemText,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Pagination,
    Stack,
    Alert,
    CircularProgress,
} from '@mui/material';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ITEMS_PER_PAGE = 5;

const InvestmentGroups = () => {
    const [individualGroups, setIndividualGroups] = useState([]);
    const [groupGroups, setGroupGroups] = useState([]);
    const [newIndividualGroupName, setNewIndividualGroupName] = useState('');
    const [newGroupGroupName, setNewGroupGroupName] = useState('');
    const [loadingIndividual, setLoadingIndividual] = useState(false);
    const [loadingGroup, setLoadingGroup] = useState(false);
    const [individualPage, setIndividualPage] = useState(1);
    const [groupPage, setGroupPage] = useState(1);
    const [individualTotalCount, setIndividualTotalCount] = useState(0);
    const [groupTotalCount, setGroupTotalCount] = useState(0);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null); // Assume you have a way to get the logged-in user ID

    useEffect(() => {
        // Fetch the current user's ID (replace with your actual authentication logic)
        const fetchUserId = async () => {
            const { data: { session }, error: authError } = await supabase.auth.getUser();
            if (authError) {
                console.error("Error fetching session:", authError);
                return;
            }

            console.log(`Found user session -> id: ${session.user.id} email: ${session.user.email}`);

            // session.user.id
            setUserId(session.user.id);
        };

        fetchUserId().then(r => {});
    }, []);

    useEffect( () => {
        if (userId) {
            fetchIndividualGroups().then();
            fetchGroupGroups().then();
        }
    }, [userId, individualPage, groupPage]);

    const fetchIndividualGroups = async () => {
        setLoadingIndividual(true);
        setError(null);
        try {
            const { data, error: fetchError, count } = await supabase
                .from('groups')
                .select('id, name, group_members!inner(joined_at)', { count: 'exact' })
                .eq('type_id', 1) // Assuming 'individual' group type has ID 1
                .eq('group_members.user_id', userId)
                .order('group_members_joined_at', { ascending: true })
                .range((individualPage - 1) * ITEMS_PER_PAGE, individualPage * ITEMS_PER_PAGE - 1);

            if (fetchError) {
                throw fetchError;
            }
            setIndividualGroups(data);
            setIndividualTotalCount(count);
        } catch (err) {
            console.error('Error fetching individual groups:', err);
            setError(err.message);
        } finally {
            setLoadingIndividual(false);
        }
    };

    const fetchGroupGroups = async () => {
        setLoadingGroup(true);
        setError(null);
        try {
            const { data, error: fetchError, count } = await supabase
                .from('groups')
                .select('id, name, group_members!inner')
                .eq('type_id', 2) // Assuming 'group' group type has ID 2
                .eq('group_members.user_id', userId)
                .range((groupPage - 1) * ITEMS_PER_PAGE, groupPage * ITEMS_PER_PAGE - 1);

            if (fetchError) {
                throw fetchError;
            }
            setGroupGroups(data);
            setGroupTotalCount(count);
        } catch (err) {
            console.error('Error fetching group type groups:', err);
            setError(err.message);
        } finally {
            setLoadingGroup(false);
        }
    };

    const handleCreateIndividualGroup = async (e) => {
        e.preventDefault();
        if (!newIndividualGroupName.trim()) return;

        try {
            const { data: groupData, error: groupError } = await supabase
                .from('groups')
                .insert([
                    { name: newIndividualGroupName, type_id: 1, owner_id: userId },
                ])
                .select()
                .single();

            if (groupError) {
                throw groupError;
            }

            // Immediately add the creator as the owner in group_members
            const { error: memberError } = await supabase
                .from('group_members')
                .insert([
                    { group_id: groupData.id, user_id: userId, role: 'owner' },
                ]);

            if (memberError) {
                throw memberError;
            }

            setNewIndividualGroupName('');
            await fetchIndividualGroups(); // Refresh the list
        } catch (err) {
            console.error('Error creating individual group:', err);
            setError(err.message);
        }
    };

    const handleCreateGroupGroup = async (e) => {
        e.preventDefault();
        if (!newGroupGroupName.trim()) return;

        try {
            const { data: groupData, error: groupError } = await supabase
                .from('groups')
                .insert([
                    { name: newGroupGroupName, type_id: 2, owner_id: userId },
                ])
                .select()
                .single();

            if (groupError) {
                throw groupError;
            }

            // Immediately add the creator as the owner in group_members
            const { error: memberError } = await supabase
                .from('group_members')
                .insert([
                    { group_id: groupData.id, user_id: userId, role: 'owner' },
                ]);

            if (memberError) {
                throw memberError;
            }

            setNewGroupGroupName('');
            await fetchGroupGroups(); // Refresh the list
        } catch (err) {
            console.error('Error creating group type group:', err);
            setError(err.message);
        }
    };

    const handleIndividualPageChange = (event, value) => {
        setIndividualPage(value);
    };

    const handleGroupPageChange = (event, value) => {
        setGroupPage(value);
    };

    // if (!userId) {
    //     return <Container><Typography variant="h6">Loading user information...</Typography></Container>;
    // }

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Investment Groups</Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* List of Individual Groups */}
            <Typography variant="h6" gutterBottom>My Individual Groups</Typography>
            {loadingIndividual ? (
                <CircularProgress />
            ) : individualGroups.length > 0 ? (
                <List>
                    {individualGroups.map((group) => (
                        <ListItem key={group.id}>
                            <ListItemText primary={group.name} />
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography variant="body1">No individual groups joined yet.</Typography>
            )}
            {individualTotalCount > ITEMS_PER_PAGE && (
                <Stack alignItems="center" mt={2}>
                    <Pagination
                        count={Math.ceil(individualTotalCount / ITEMS_PER_PAGE)}
                        page={individualPage}
                        onChange={handleIndividualPageChange}
                        color="primary"
                    />
                </Stack>
            )}

            {/* Create Individual Group Form */}
            <Typography variant="h6" gutterBottom mt={3}>Create Individual Group</Typography>
            <form onSubmit={handleCreateIndividualGroup}>
                <FormControl fullWidth>
                    <TextField
                        label="Group Name"
                        value={newIndividualGroupName}
                        onChange={(e) => setNewIndividualGroupName(e.target.value)}
                        required
                        margin="normal"
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Create Individual Group
                    </Button>
                </FormControl>
            </form>

            {/* List of Group Type Groups */}
            <Typography variant="h6" gutterBottom mt={4}>My Friend Groups</Typography>
            {loadingGroup ? (
                <CircularProgress />
            ) : groupGroups.length > 0 ? (
                <List>
                    {groupGroups.map((group) => (
                        <ListItem key={group.id}>
                            <ListItemText primary={group.name} />
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography variant="body1">No friend groups joined yet.</Typography>
            )}
            {groupTotalCount > ITEMS_PER_PAGE && (
                <Stack alignItems="center" mt={2}>
                    <Pagination
                        count={Math.ceil(groupTotalCount / ITEMS_PER_PAGE)}
                        page={groupPage}
                        onChange={handleGroupPageChange}
                        color="primary"
                    />
                </Stack>
            )}

            {/* Create Group Type Group Form */}
            <Typography variant="h6" gutterBottom mt={3}>Create Friend Group</Typography>
            <form onSubmit={handleCreateGroupGroup}>
                <FormControl fullWidth>
                    <TextField
                        label="Group Name"
                        value={newGroupGroupName}
                        onChange={(e) => setNewGroupGroupName(e.target.value)}
                        required
                        margin="normal"
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Create Friend Group
                    </Button>
                </FormControl>
            </form>
        </Container>
    );
};

export default InvestmentGroups;
