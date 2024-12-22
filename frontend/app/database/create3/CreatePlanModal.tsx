import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Typography,
    InputAdornment,
    Alert,
    CircularProgress
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Types
interface CreatePlanFormData {
    principal: number;
    interest: number;
    duration: number;
}

interface CreatePlanModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: CreatePlanFormData) => Promise<void>;
    isSubmitting?: boolean;
}

// Validation schema
const validationSchema = Yup.object({
    principal: Yup.number()
        .required('Principal amount is required')
        .min(1000, 'Minimum investment is $1,000')
        .max(1000000, 'Maximum investment is $1,000,000'),
    interest: Yup.number()
        .required('Interest rate is required')
        .min(0.1, 'Minimum interest rate is 0.1%')
        .max(30, 'Maximum interest rate is 30%'),
    duration: Yup.number()
        .required('Investment duration is required')
        .min(1, 'Minimum duration is 1 month')
        .max(120, 'Maximum duration is 120 months')
});

// Calculate estimated earnings
const calculateEstimatedEarnings = (
    principal: number,
    interest: number,
    duration: number
): number => {
    const monthlyRate = interest / 100 / 12;
    return principal * Math.pow(1 + monthlyRate, duration) - principal;
};

export const CreatePlanModal: React.FC<CreatePlanModalProps> = ({
                                                                    open,
                                                                    onClose,
                                                                    onSubmit,
                                                                    isSubmitting = false
                                                                }) => {
    const formik = useFormik<CreatePlanFormData>({
        initialValues: {
            principal: 10000,
            interest: 5,
            duration: 12
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                await onSubmit(values);
                onClose();
            } catch (error) {
                // Handle error in parent component
            }
        },
    });

    // Calculate estimated earnings based on current form values
    const estimatedEarnings = React.useMemo(() => {
        if (!formik.values.principal || !formik.values.interest || !formik.values.duration) {
            return 0;
        }
        return calculateEstimatedEarnings(
            formik.values.principal,
            formik.values.interest,
            formik.values.duration
        );
    }, [formik.values]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <form onSubmit={formik.handleSubmit}>
                <DialogTitle>Create New Investment Plan</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2, mb: 3 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Enter the details of your new investment plan. We'll help you estimate your potential earnings.
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            fullWidth
                            id="principal"
                            name="principal"
                            label="Principal Amount"
                            type="number"
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            value={formik.values.principal}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.principal && Boolean(formik.errors.principal)}
                            helperText={formik.touched.principal && formik.errors.principal}
                        />

                        <TextField
                            fullWidth
                            id="interest"
                            name="interest"
                            label="Annual Interest Rate"
                            type="number"
                            InputProps={{
                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                            value={formik.values.interest}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.interest && Boolean(formik.errors.interest)}
                            helperText={formik.touched.interest && formik.errors.interest}
                        />

                        <TextField
                            fullWidth
                            id="duration"
                            name="duration"
                            label="Investment Duration"
                            type="number"
                            InputProps={{
                                endAdornment: <InputAdornment position="end">months</InputAdornment>,
                            }}
                            value={formik.values.duration}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.duration && Boolean(formik.errors.duration)}
                            helperText={formik.touched.duration && formik.errors.duration}
                        />
                    </Box>

                    {estimatedEarnings > 0 && (
                        <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
                            <Typography variant="subtitle2" color="primary.contrastText">
                                Estimated Earnings
                            </Typography>
                            <Typography variant="h6" color="primary.contrastText">
                                ${estimatedEarnings.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                            </Typography>
                            <Typography variant="caption" color="primary.contrastText">
                                This is an estimate based on compound interest calculated monthly
                            </Typography>
                        </Box>
                    )}

                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={!formik.isValid || !formik.dirty || isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size={20} /> : undefined}
                    >
                        Create Plan
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

//
// // Example usage with the container component
// export const InvestmentPlanContainer = () => {
//     const [isModalOpen, setIsModalOpen] = React.useState(false);
//     const { data: plans = [], isLoading } = useInvestmentPlans();
//     const { mutate: createPlan, isPending } = useCreateInvestmentPlan();
//
//     const handleCreatePlan = async (values: CreatePlanFormData) => {
//         await createPlan({
//             principal: values.principal,
//             interest: values.interest,
//             earnings: calculateEstimatedEarnings(
//                 values.principal,
//                 values.interest,
//                 values.duration
//             ),
//             status: 'active'
//         });
//     };
//
//     return (
//         <>
//             <InvestmentPlans
//                 plans={plans}
//                 isLoading={isLoading}
//                 onCreatePlan={() => setIsModalOpen(true)}
//             />
//
//             <CreatePlanModal
//                 open={isModalOpen}
//                 onClose={() => setIsModalOpen(false)}
//                 onSubmit={handleCreatePlan}
//                 isSubmitting={isPending}
//             />
//         </>
//     );
// };
