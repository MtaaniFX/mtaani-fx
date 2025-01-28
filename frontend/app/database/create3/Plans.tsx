import React, { useState, useCallback, useMemo } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    IconButton,
    Button,
    TablePagination,
    List,
    ListItem,
    ListItemText,
    Paper,
    Chip,
    Stack,
    useTheme,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Checkbox,
    AppBar,
    Toolbar,
    Menu,
    MenuItem,
    Fade,
    ListItemIcon,
    Tooltip
} from '@mui/material';
import {
    GridView as GridViewIcon,
    ViewList as ListViewIcon,
    Add as AddIcon,
    TrendingUp as TrendingUpIcon,
    MoreVert as MoreVertIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Pause as PauseIcon,
    PlayArrow as PlayArrowIcon,
    Close as CloseIcon,
    Download as DownloadIcon
} from '@mui/icons-material';

// Enhanced Types
export interface InvestmentPlan {
    id: string;
    principal: number;
    interest: number;
    earnings: number;
    status: 'active' | 'stale';
    createdAt: string;
    lastUpdated?: string;
    description?: string;
    maturityDate?: string;
}

export interface InvestmentPlansProps {
    plans: InvestmentPlan[];
    isLoading?: boolean;
    onCreatePlan: () => void;
    onUpdatePlan: (plan: InvestmentPlan) => void;
    onDeletePlans: (planIds: string[]) => void;
    onTogglePlanStatus: (planIds: string[]) => void;
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

// Detail Dialog Component
const PlanDetailDialog: React.FC<{
    plan: InvestmentPlan | null;
    open: boolean;
    onClose: () => void;
    onEdit: (plan: InvestmentPlan) => void;
    onDelete: (planId: string) => void;
    onToggleStatus: (planId: string) => void;
}> = ({ plan, open, onClose, onEdit, onDelete, onToggleStatus }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    if (!plan) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    Investment Plan Details
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2}>
                    <Box>
                        <Typography variant="overline">Principal Amount</Typography>
                        <Typography variant="h4">${plan.principal.toLocaleString()}</Typography>
                    </Box>

                    <Box>
                        <Typography variant="overline">Current Earnings</Typography>
                        <Typography variant="h5" color="success.main">
                            ${plan.earnings.toLocaleString()}
                        </Typography>
                    </Box>

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography variant="overline">Interest Rate</Typography>
                            <Typography variant="body1">{plan.interest}%</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="overline">Status</Typography>
                            <Chip
                                label={plan.status}
                                color={plan.status === 'active' ? 'success' : 'default'}
                                size="small"
                            />
                        </Grid>
                    </Grid>

                    {plan.description && (
                        <Box>
                            <Typography variant="overline">Description</Typography>
                            <Typography variant="body2">{plan.description}</Typography>
                        </Box>
                    )}

                    <Box>
                        <Typography variant="overline">Dates</Typography>
                        <Typography variant="body2">
                            Created: {new Date(plan.createdAt).toLocaleDateString()}
                            {plan.maturityDate && (
                                <>
                                    <br />
                                    Maturity: {new Date(plan.maturityDate).toLocaleDateString()}
                                </>
                            )}
                        </Typography>
                    </Box>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => onToggleStatus(plan.id)}
                    startIcon={plan.status === 'active' ? <PauseIcon /> : <PlayArrowIcon />}
                >
                    {plan.status === 'active' ? 'Pause' : 'Activate'}
                </Button>
                <Button
                    onClick={() => onEdit(plan)}
                    startIcon={<EditIcon />}
                >
                    Edit
                </Button>
                <Button
                    onClick={() => onDelete(plan.id)}
                    startIcon={<DeleteIcon />}
                    color="error"
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// Enhanced main component
export const InvestmentPlans: React.FC<InvestmentPlansProps> = ({
                                                                    plans,
                                                                    isLoading = false,
                                                                    onCreatePlan,
                                                                    onUpdatePlan,
                                                                    onDeletePlans,
                                                                    onTogglePlanStatus,
                                                                    itemsPerPage = 6
                                                                }) => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(itemsPerPage);
    const [selectedPlans, setSelectedPlans] = useState<Set<string>>(new Set());
    const [detailPlan, setDetailPlan] = useState<InvestmentPlan | null>(null);
    const [isSelectionMode, setIsSelectionMode] = useState(false);

    // Selection handlers
    const toggleSelection = (planId: string) => {
        const newSelection = new Set(selectedPlans);
        if (newSelection.has(planId)) {
            newSelection.delete(planId);
        } else {
            newSelection.add(planId);
        }
        setSelectedPlans(newSelection);
    };

    const handleSelectAll = () => {
        if (selectedPlans.size === currentPlans.length) {
            setSelectedPlans(new Set());
        } else {
            setSelectedPlans(new Set(currentPlans.map(plan => plan.id)));
        }
    };

    // Batch action handlers
    const handleBatchDelete = () => {
        onDeletePlans(Array.from(selectedPlans));
        setSelectedPlans(new Set());
        setIsSelectionMode(false);
    };

    const handleBatchToggleStatus = () => {
        onTogglePlanStatus(Array.from(selectedPlans));
        setSelectedPlans(new Set());
        setIsSelectionMode(false);
    };

    // Enhanced Grid Item with hover and selection
    const GridViewItem: React.FC<{
        plan: InvestmentPlan;
        isSelected: boolean;
        onSelect: () => void;
        onClick: () => void;
    }> = ({ plan, isSelected, onSelect, onClick }) => (
        <Card
            sx={{
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                }
            }}
        >
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    {isSelectionMode && (
                        <Checkbox
                            checked={isSelected}
                            onChange={(e) => {
                                e.stopPropagation();
                                onSelect();
                            }}
                        />
                    )}
                    <Typography variant="h6">
                        ${plan.principal.toLocaleString()}
                    </Typography>
                </Box>
                <Stack spacing={1} onClick={onClick}>
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
        </Card>
    );

    // Memoized current page data
    const currentPlans = useMemo(() => {
        const startIndex = page * rowsPerPage;
        return plans.slice(startIndex, startIndex + rowsPerPage);
    }, [plans, page, rowsPerPage]);

    // Selection mode toolbar
    const SelectionToolbar = () => (
        <AppBar
            position="static"
            color="default"
            elevation={0}
            sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
        >
            <Toolbar>
                <Checkbox
                    checked={selectedPlans.size === currentPlans.length}
                    indeterminate={selectedPlans.size > 0 && selectedPlans.size < currentPlans.length}
                    onChange={handleSelectAll}
                />
                <Typography sx={{ ml: 2 }}>
                    {selectedPlans.size} selected
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Button
                    startIcon={<DeleteIcon />}
                    color="error"
                    onClick={handleBatchDelete}
                    sx={{ mr: 1 }}
                >
                    Delete Selected
                </Button>
                <Button
                    startIcon={<PlayArrowIcon />}
                    onClick={handleBatchToggleStatus}
                >
                    Toggle Status
                </Button>
            </Toolbar>
        </AppBar>
    );

    // Empty state remains unchanged
    if (plans.length === 0) {
        return <EmptyState onCreatePlan={onCreatePlan} />;
    }

    return (
        <Paper sx={{ p: 2 }}>
            {isSelectionMode ? (
                <SelectionToolbar />
            ) : (
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h5">Investment Plans</Typography>
                    <Box>
                        <Tooltip title="Enable Selection Mode">
                            <IconButton onClick={() => setIsSelectionMode(true)}>
                                <Checkbox />
                            </IconButton>
                        </Tooltip>
                        <IconButton
                            color={viewMode === 'grid' ? 'primary' : 'default'}
                            onClick={() => setViewMode('grid')}
                        >
                            <GridViewIcon />
                        </IconButton>
                        <IconButton
                            color={viewMode === 'list' ? 'primary' : 'default'}
                            onClick={() => setViewMode('list')}
                        >
                            <ListViewIcon />
                        </IconButton>
                    </Box>
                </Box>
            )}

            {viewMode === 'grid' ? (
                <Grid container spacing={2}>
                    {currentPlans.map((plan) => (
                        <Grid item xs={12} sm={6} md={4} key={plan.id}>
                            <GridViewItem
                                plan={plan}
                                isSelected={selectedPlans.has(plan.id)}
                                onSelect={() => toggleSelection(plan.id)}
                                onClick={() => !isSelectionMode && setDetailPlan(plan)}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <List>
                    {currentPlans.map((plan) => (
                        <ListItem
                            key={plan.id}
                            divider
                            sx={{
                                cursor: 'pointer',
                                '&:hover': {
                                    bgcolor: 'action.hover'
                                }
                            }}
                            secondaryAction={
                                isSelectionMode ? (
                                    <Checkbox
                                        checked={selectedPlans.has(plan.id)}
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            toggleSelection(plan.id);
                                        }}
                                    />
                                ) : (
                                    <Chip
                                        label={plan.status}
                                        color={plan.status === 'active' ? 'success' : 'default'}
                                        size="small"
                                    />
                                )
                            }
                            onClick={() => !isSelectionMode && setDetailPlan(plan)}
                        >
                            <ListItemText
                                primary={`$${plan.principal.toLocaleString()}`}
                                secondary={
                                    <>
                                        Interest Rate: {plan.interest}% |
                                        Earnings: ${plan.earnings.toLocaleString()}
                                    </>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            )}

            <TablePagination
                component="div"
                count={plans.length}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                }}
                rowsPerPageOptions={[6, 12, 24]}
            />

            <PlanDetailDialog
                plan={detailPlan}
                open={Boolean(detailPlan)}
                onClose={() => setDetailPlan(null)}
                onEdit={onUpdatePlan}
                onDelete={(planId) => {
                    onDeletePlans([planId]);
                    setDetailPlan(null);
                }}
                onToggleStatus={(planId) => {
                    onTogglePlanStatus([planId]);
                    setDetailPlan(null);
                }}
            />
        </Paper>
    );
};

export default InvestmentPlans;
