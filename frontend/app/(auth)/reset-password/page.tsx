"use client"

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AppTheme from '@/components/internal/shared-theme/AppTheme';
import ColorModeSelect from '@/components/internal/shared-theme/ColorModeSelect';
import {FaviconRow} from '@/components/internal/icons/Favicon';
import PageBackground from "@/components/internal/ui/PageBackground";
import {createClient} from "@/utils/supabase/client";
import {MtCard} from "@/components/internal/styled/MtCard";
import {Alert, AlertTitle, Collapse} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {CloseIcon} from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";
import ResetSuccessDialogue from "@/app/(auth)/reset-password/ResetSuccessDialogue";
import {siteURL} from "@/lib/constants";
import {paths} from "@/lib/paths";

const supabase = createClient();

export default function (props: { disableCustomTheme?: boolean }) {
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [alertOpen, setAlertOpen] = React.useState(false);
    const [openSuccessDialogue, setOpenSuccessDialogue] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState('');

    const validateInputs = () => {
        const email = document.getElementById('email') as HTMLInputElement;

        let isValid = true;

        if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        return isValid;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (emailError) {
            return;
        }

        const formData = new FormData(event.currentTarget);
        const email = formData.get('email');

        const {error} = await supabase.auth.resetPasswordForEmail(email as string, {
            redirectTo: `${siteURL}/auth/callback?redirect_to=${paths.auth.updatePassword}`,
        })

        if (error) {
            setAlertMessage(error.message);
            setAlertOpen(true);
            setOpenSuccessDialogue(false);
            return
        } else {
            setOpenSuccessDialogue(true);
            setAlertOpen(false);
        }
    };

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme/>
            <ColorModeSelect sx={{position: 'fixed', top: '1rem', right: '1rem'}}/>
            <ResetSuccessDialogue
                open={openSuccessDialogue}
                setOpen={setOpenSuccessDialogue}/>
            <PageBackground>
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "2em",
                    minHeight: "100vh"
                }}>
                    <MtCard variant="outlined">
                        <FaviconRow/>
                        <Typography
                            component="h1"
                            variant="h4"
                            sx={{width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)'}}
                        >
                            Password Reset
                        </Typography>
                        <Typography variant="body1">
                            Enter your account's email address, and we'll send you a link to
                            reset your password.
                        </Typography>
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            sx={{display: 'flex', flexDirection: 'column', gap: 2}}
                        >
                            <FormControl>
                                <FormLabel htmlFor="email">Email</FormLabel>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    placeholder="your@email.com"
                                    name="email"
                                    autoComplete="email"
                                    variant="outlined"
                                    error={emailError}
                                    helperText={emailErrorMessage}
                                />
                            </FormControl>
                            <Collapse in={alertOpen}>
                                <Alert
                                    severity="error"
                                    action={
                                        <IconButton
                                            aria-label="close"
                                            color="inherit"
                                            size="small"
                                            onClick={() => {
                                                setAlertOpen(false);
                                            }}
                                        >
                                            <CloseIcon  />
                                        </IconButton>
                                    }
                                    sx={{ mb: 2 }}
                                >
                                    <AlertTitle>Error</AlertTitle>
                                    {alertMessage}
                                </Alert>
                            </Collapse>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                onClick={validateInputs}
                            >
                                Reset Password
                            </Button>
                        </Box>
                    </MtCard>
                </Box>
            </PageBackground>
        </AppTheme>
    )
}
