import React, {useCallback, useMemo, useState} from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Paper,
    Stack,
    TablePagination,
    Typography,
    useTheme
} from '@mui/material';
import {
    Add as AddIcon, GridView as GridViewIcon, TrendingUp as TrendingUpIcon, ViewList as ListViewIcon
} from '@mui/icons-material';

// Types
export interface InvestmentPlan {
    id: string;
    principal: number;
    interest: number;
    earnings: number;
    status: 'active' | 'stale';
    createdAt: string;
}

interface InvestmentPlansProps {
    plans: InvestmentPlan[];
    isLoading?: boolean;
    onCreatePlan: () => void;
    itemsPerPage?: number;
}

// Component for empty state
const EmptyState: React.FC<{ onCreatePlan: () => void }> = ({onCreatePlan}) => (<Box
        sx={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 4, textAlign: 'center', gap: 2
        }}
    >
        <TrendingUpIcon sx={{fontSize: 60, color: 'primary.main'}}/>
        <Typography variant="h6">No Investment Plans Yet</Typography>
        <Typography color="text.secondary">
            Start growing your wealth by creating your first investment plan
        </Typography>
        <Button
            variant="contained"
            startIcon={<AddIcon/>}
            onClick={onCreatePlan}
        >
            Create Investment Plan
        </Button>
    </Box>);

// Grid view item component
const GridViewItem: React.FC<{ plan: InvestmentPlan }> = ({plan}) => {
    const theme = useTheme();

    return (<Card>
            <CardContent>
                <Stack spacing={1}>
                    <Typography variant="h6" gutterBottom>
                        ${plan.principal.toLocaleString()}
                    </Typography>
                    <Typography color="text.secondary">
                        Interest Rate: {plan.interest}%
                    </Typography>
                    <Typography color="text.secondary">
                        Earnings: ${plan.earnings.toLocaleString()}
                    </Typography>
                    <Chip
                        label={plan.status}
                        color={plan.status === 'active' ? 'success' : 'default'}
                        size="small"
                    />
                </Stack>
            </CardContent>
        </Card>);
};

// Main component
export const InvestmentPlans: React.FC<InvestmentPlansProps> = ({
                                                                    plans,
                                                                    isLoading = false,
                                                                    onCreatePlan,
                                                                    itemsPerPage = 6
                                                                }) => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(itemsPerPage);

    // Memoized slice of plans for current page
    const currentPlans = useMemo(() => {
        const startIndex = page * rowsPerPage;
        return plans.slice(startIndex, startIndex + rowsPerPage);
    }, [plans, page, rowsPerPage]);

    // Handlers
    const handleChangePage = useCallback((event: unknown, newPage: number) => {
        setPage(newPage);
    }, []);

    const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }, []);

    // If no plans, show empty state
    if (plans.length === 0) {
        return <EmptyState onCreatePlan={onCreatePlan}/>;
    }

    return (<Paper sx={{p: 2}}>
            <Box sx={{mb: 2, display: 'flex', justifyContent: 'space-between'}}>
                <Typography variant="h5">Investment Plans</Typography>
                <Box>
                    <IconButton
                        color={viewMode === 'grid' ? 'primary' : 'default'}
                        onClick={() => setViewMode('grid')}
                    >
                        <GridViewIcon/>
                    </IconButton>
                    <IconButton
                        color={viewMode === 'list' ? 'primary' : 'default'}
                        onClick={() => setViewMode('list')}
                    >
                        <ListViewIcon/>
                    </IconButton>
                </Box>
            </Box>

            {viewMode === 'grid' ? (<Grid container spacing={2}>
                    {currentPlans.map((plan) => (<Grid item xs={12} sm={6} md={4} key={plan.id}>
                            <GridViewItem plan={plan}/>
                        </Grid>))}
                </Grid>) : (<List>
                    {currentPlans.map((plan) => (<ListItem
                            key={plan.id}
                            divider
                            secondaryAction={<Chip
                                label={plan.status}
                                color={plan.status === 'active' ? 'success' : 'default'}
                                size="small"
                            />}
                        >
                            <ListItemText
                                primary={`$${plan.principal.toLocaleString()}`}
                                secondary={<>
                                    Interest Rate: {plan.interest}% |
                                    Earnings: ${plan.earnings.toLocaleString()}
                                </>}
                            />
                        </ListItem>))}
                </List>)}

            <TablePagination
                component="div"
                count={plans.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[6, 12, 24]}
            />
        </Paper>);
};

export default InvestmentPlans;
