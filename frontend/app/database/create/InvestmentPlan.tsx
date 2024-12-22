"use client"

import React, { useState, useEffect, useCallback } from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Switch,
    FormControlLabel,
    Pagination,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Box,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';

// Data types for investment plan
export interface InvestmentPlan {
    id: string; // Unique identifier for each plan
    principal: number;
    interestRate: number;
    earnings: number;
    status: 'active' | 'stale';
    startDate: Date;
    endDate: Date;
}

// Props for the InvestmentPlans component
export interface InvestmentPlansProps {
    fetchPlans: (page: number, pageSize: number) => Promise<InvestmentPlan[]>; // Function to fetch plans
    createPlan: (newPlan: Omit<InvestmentPlan, 'id'>) => Promise<InvestmentPlan>; // Function to create a plan
    pageSizeOptions?: number[]; // Optional prop to customize pagination page sizes
}

// View mode
type ViewMode = 'grid' | 'details';


// (Placeholder - Replace with your actual no-plans graphic)
const NoPlansImage = styled('img')({
    maxWidth: '100%',
    height: 'auto',
});

const InvestmentPlans: React.FC<InvestmentPlansProps> = ({
                                                             fetchPlans,
                                                             createPlan,
                                                             pageSizeOptions = [5, 10, 25],
                                                         }) => {
    const [plans, setPlans] = useState<InvestmentPlan[]>([]);
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(pageSizeOptions[0]);
    const [totalPlans, setTotalPlans] = useState<number>(0); // Assuming API returns total count
    const [loading, setLoading] = useState<boolean>(false);
    const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false);
    const [newPlanData, setNewPlanData] = useState<Omit<InvestmentPlan, 'id'>>({
        principal: 0,
        interestRate: 0,
        earnings: 0,
        status: 'active',
        startDate: new Date(),
        endDate: new Date(),
    });

    // Efficiently fetches plans with pagination
    const loadPlans = useCallback(async () => {
        setLoading(true);
        try {
            const fetchedPlans = await fetchPlans(page, pageSize);
            // Assuming your fetchPlans also returns total count
            // setTotalPlans(fetchedPlans.total);
            setPlans(fetchedPlans);
        } catch (error) {
            console.error('Error fetching plans:', error);
            // Handle error appropriately (e.g., show error message)
        } finally {
            setLoading(false);
        }
    }, [fetchPlans, page, pageSize]);

    // Load plans on initial render and when page/pageSize changes
    useEffect(() => {
        loadPlans();
    }, [loadPlans]);

    // Handle creating a new plan
    const handleCreatePlan = async () => {
        setLoading(true);
        try {
            const createdPlan = await createPlan(newPlanData);
            setPlans((prevPlans) => [...prevPlans, createdPlan]); // Add to the beginning of the list
            setTotalPlans((prevTotal) => prevTotal + 1); // Update total count if using
            setOpenCreateDialog(false);
            setNewPlanData({
                principal: 0,
                interestRate: 0,
                earnings: 0,
                status: 'active',
                startDate: new Date(),
                endDate: new Date(),
            });
        } catch (error) {
            console.error('Error creating plan:', error);
            // Handle error appropriately
        } finally {
            setLoading(false);
        }
    };

    // Handle plan updates (insertions/removals)
    const handlePlanUpdate = (updatedPlan: InvestmentPlan) => {
        setPlans((prevPlans) => {
            const planIndex = prevPlans.findIndex((plan) => plan.id === updatedPlan.id);
            if (planIndex === -1) {
                // Plan not found, treat as new (insert)
                return [...prevPlans, updatedPlan];
            } else {
                // Plan found, update existing (replace)
                const updatedPlans = [...prevPlans];
                updatedPlans[planIndex] = updatedPlan;
                return updatedPlans;
            }
        });
    };

    const handlePlanDelete = (planId: string) => {
        setPlans((prevPlans) => prevPlans.filter((plan) => plan.id !== planId));
        setTotalPlans((prevTotal) => prevTotal - 1); // Update total count if using
    };

    const handleViewModeChange = () => {
        setViewMode((prevMode) => (prevMode === 'grid' ? 'details' : 'grid'));
    };

    const handlePageChange = (event: unknown, value: number) => {
        setPage(value);
    };

    const handlePageSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPageSize(parseInt(event.target.value, 10));
        setPage(1); // Reset to first page when page size changes
    };

    const handleInputChange = (field: keyof Omit<InvestmentPlan, 'id'>) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = field === 'principal' || field === 'interestRate' || field === 'earnings'
            ? parseFloat(event.target.value)
            : event.target.value;
        setNewPlanData({
            ...newPlanData,
            [field]: value,
        });
    };

    // Grid view columns
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'principal', headerName: 'Principal', type: 'number', width: 120 },
        { field: 'interestRate', headerName: 'Interest Rate', type: 'number', width: 120 },
        { field: 'earnings', headerName: 'Earnings', type: 'number', width: 120 },
        { field: 'status', headerName: 'Status', width: 100 },
        { field: 'startDate', headerName: 'Start Date', type: 'date', width: 150},
        { field: 'endDate', headerName: 'End Date', type: 'date', width: 150 },
    ];

    return (
        <div>
            {/* Toggle for view mode */}
            <FormControlLabel
                control={<Switch checked={viewMode === 'details'} onChange={handleViewModeChange} />}
                label="Details View"
            />

            {/* Conditional rendering based on view mode and plans */}
            {loading ? (
                <div>Loading...</div> // Replace with a nice MUI Skeleton loading component
            ) : plans.length === 0 ? (
                <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
                    <NoPlansImage src="/no-plans-graphic.svg" alt="No investment plans yet" />
                    <Button variant="contained" onClick={() => setOpenCreateDialog(true)} sx={{ mt: 2 }}>
                        Create New Investment
                    </Button>
                </Box>
            ) : (
                <>
                    {viewMode === 'grid' ? (
                        <Grid container spacing={2}>
                            {plans.map((plan) => (
                                <Grid item xs={12} sm={6} md={4} key={plan.id}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6">Principal: ${plan.principal}</Typography>
                                            <Typography>Interest Rate: {plan.interestRate}%</Typography>
                                            <Typography>Earnings: ${plan.earnings}</Typography>
                                            <Typography>Status: {plan.status}</Typography>
                                            <Typography>Start Date: {plan.startDate.toLocaleDateString()}</Typography>
                                            <Typography>End Date: {plan.endDate.toLocaleDateString()}</Typography>
                                            {/* Add buttons for edit/delete, etc. */}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <div style={{ height: 400, width: '100%' }}>
                            <DataGrid
                                rows={plans}
                                columns={columns}
                                // pageSize={pageSize}
                                // rowsPerPageOptions={pageSizeOptions}
                                pagination
                                // onPageChange={handlePageChange}
                                // onPageSizeChange={handlePageSizeChange}
                            />
                        </div>
                    )}
                </>
            )}

            {/* Pagination (only show if there are plans) */}
            {plans.length > 0 && (
                <Pagination
                    count={Math.ceil(totalPlans / pageSize)} // Calculate total pages
                    page={page}
                    onChange={handlePageChange}
                    sx={{ mt: 2 }}
                />
            )}

            {/* Create New Plan Dialog */}
            <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)}>
                <DialogTitle>Create New Investment Plan</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Principal"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={newPlanData.principal}
                        onChange={handleInputChange('principal')}
                    />
                    <TextField
                        label="Interest Rate (%)"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={newPlanData.interestRate}
                        onChange={handleInputChange('interestRate')}
                    />
                    <TextField
                        label="Start Date"
                        type="date"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        value={newPlanData.startDate.toISOString().substring(0, 10)}
                        onChange={handleInputChange('startDate')}
                    />
                    <TextField
                        label="End Date"
                        type="date"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        value={newPlanData.endDate.toISOString().substring(0, 10)}
                        onChange={handleInputChange('endDate')}
                    />
                    {/* You can add more fields as needed */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
                    <Button onClick={handleCreatePlan} variant="contained">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default InvestmentPlans;
