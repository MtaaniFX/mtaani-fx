'use client'

import InvestmentPlans from "./Plans";
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { CreatePlanModal } from './CreatePlanModal';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Snackbar,
    Alert
} from '@mui/material';

// Types
interface InvestmentPlan {
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

interface CreatePlanFormData {
    principal: number;
    interest: number;
    duration: number;
}

// API functions
const api = {
    getPlans: async (): Promise<InvestmentPlan[]> => {
        const { data } = await axios.get('/api/investment-plans');
        return data;
    },

    createPlan: async (plan: Omit<InvestmentPlan, 'id' | 'createdAt'>) => {
        const { data } = await axios.post('/api/investment-plans', plan);
        return data;
    },

    updatePlan: async (plan: InvestmentPlan) => {
        const { data } = await axios.put(`/api/investment-plans/${plan.id}`, plan);
        return data;
    },

    deletePlans: async (planIds: string[]) => {
        const { data } = await axios.delete('/api/investment-plans', {
            data: { planIds }
        });
        return data;
    },

    togglePlanStatus: async (planIds: string[]) => {
        const { data } = await axios.patch('/api/investment-plans/toggle-status', {
            planIds
        });
        return data;
    }
};

// Hooks
const useInvestmentPlans = () => {
    return useQuery({
        queryKey: ['investmentPlans'],
        queryFn: api.getPlans,
        staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    });
};

export const InvestmentPlanContainer: React.FC = () => {
    const queryClient = useQueryClient();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState<{
        open: boolean;
        planIds: string[];
    }>({ open: false, planIds: [] });
    const [notification, setNotification] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error';
    }>({ open: false, message: '', severity: 'success' });

    // Queries and Mutations
    const { data: plans = [], isLoading } = useInvestmentPlans();

    const createPlanMutation = useMutation({
        mutationFn: api.createPlan,
        onSuccess: (newPlan) => {
            queryClient.setQueryData<InvestmentPlan[]>(
                ['investmentPlans'],
                (old = []) => [...old, newPlan]
            );
            setNotification({
                open: true,
                message: 'Investment plan created successfully',
                severity: 'success'
            });
        },
        onError: () => {
            setNotification({
                open: true,
                message: 'Failed to create investment plan',
                severity: 'error'
            });
        }
    });

    const updatePlanMutation = useMutation({
        mutationFn: api.updatePlan,
        onSuccess: (updatedPlan) => {
            queryClient.setQueryData<InvestmentPlan[]>(
                ['investmentPlans'],
                (old = []) => old.map(plan =>
                    plan.id === updatedPlan.id ? updatedPlan : plan
                )
            );
            setNotification({
                open: true,
                message: 'Investment plan updated successfully',
                severity: 'success'
            });
        },
        onError: () => {
            setNotification({
                open: true,
                message: 'Failed to update investment plan',
                severity: 'error'
            });
        }
    });

    const deletePlansMutation = useMutation({
        mutationFn: api.deletePlans,
        onSuccess: (_, variables) => {
            queryClient.setQueryData<InvestmentPlan[]>(
                ['investmentPlans'],
                (old = []) => old.filter(plan => !variables.includes(plan.id))
            );
            setNotification({
                open: true,
                message: 'Investment plan(s) deleted successfully',
                severity: 'success'
            });
        },
        onError: () => {
            setNotification({
                open: true,
                message: 'Failed to delete investment plan(s)',
                severity: 'error'
            });
        }
    });

    const toggleStatusMutation = useMutation({
        mutationFn: api.togglePlanStatus,
        onSuccess: (updatedPlans) => {
            queryClient.setQueryData<InvestmentPlan[]>(
                ['investmentPlans'],
                (old = []) => old.map(plan => {
                    const updatedPlan = updatedPlans.find(p => p.id === plan.id);
                    return updatedPlan || plan;
                })
            );
            setNotification({
                open: true,
                message: 'Plan status(es) updated successfully',
                severity: 'success'
            });
        },
        onError: () => {
            setNotification({
                open: true,
                message: 'Failed to update plan status(es)',
                severity: 'error'
            });
        }
    });

    // Handlers
    const handleCreatePlan = async (values: CreatePlanFormData) => {
        await createPlanMutation.mutateAsync({
            principal: values.principal,
            interest: values.interest,
            earnings: 0, // Initial earnings
            status: 'active',
            description: `${values.duration} month investment plan`,
            maturityDate: new Date(
                Date.now() + values.duration * 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
        });
        setIsCreateModalOpen(false);
    };

    const handleUpdatePlan = (plan: InvestmentPlan) => {
        updatePlanMutation.mutate(plan);
    };

    const handleDeletePlans = (planIds: string[]) => {
        setDeleteConfirmation({ open: true, planIds });
    };

    const confirmDelete = () => {
        deletePlansMutation.mutate(deleteConfirmation.planIds);
        setDeleteConfirmation({ open: false, planIds: [] });
    };

    const handleTogglePlanStatus = (planIds: string[]) => {
        toggleStatusMutation.mutate(planIds);
    };

    return (
        <>
            <InvestmentPlans
                plans={plans}
                isLoading={isLoading}
                onCreatePlan={() => setIsCreateModalOpen(true)}
                onUpdatePlan={handleUpdatePlan}
                onDeletePlans={handleDeletePlans}
                onTogglePlanStatus={handleTogglePlanStatus}
            />

            <CreatePlanModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreatePlan}
                isSubmitting={createPlanMutation.isPending}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteConfirmation.open}
                onClose={() => setDeleteConfirmation({ open: false, planIds: [] })}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete {deleteConfirmation.planIds.length}
                        investment plan(s)? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setDeleteConfirmation({ open: false, planIds: [] })}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={confirmDelete}
                        color="error"
                        variant="contained"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Notification Snackbar */}
            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={() => setNotification(prev => ({ ...prev, open: false }))}
            >
                <Alert
                    onClose={() => setNotification(prev => ({ ...prev, open: false }))}
                    severity={notification.severity}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default InvestmentPlanContainer;
