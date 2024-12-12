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
import {Alert, AlertTitle, Collapse, Snackbar} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {CloseIcon} from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";
import {useRouter} from "next/navigation";
import {paths} from "@/lib/paths";

const supabase = createClient();

export default function UpdatePassword(props: { disableCustomTheme?: boolean }) {
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [alertOpen, setAlertOpen] = React.useState(false);
    const [redirectAlertOpen, setRedirectAlertOpen] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState("");

    const router = useRouter();

    const validateInputs = () => {
        const password = document.getElementById('password') as HTMLInputElement;
        const passwordConfirm = document.getElementById('password-confirm') as HTMLInputElement;

        let isValid = true;

        function Error(message: string) {
            setPasswordError(true);
            setPasswordErrorMessage(message);
            isValid = false;
        }

        if (!password.value || password.value.length < 6) {
            Error('Password must be at least 6 characters long.')
        } else if (password.value !== passwordConfirm.value) {
            Error('Passwords must match, re-enter passwords correctly');
            console.log("pass: ", password.value, "confirm:", passwordConfirm.value)
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        return isValid;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (passwordError) {
            return;
        }

        const formData = new FormData(event.currentTarget);
        const password = formData.get('password') as string;

        const {error} = await supabase.auth.updateUser({
            password: password,
        })

        if (error) {
            setAlertMessage(error.message)
            setAlertOpen(true);
            return
        } else {
            setAlertOpen(false);
            setRedirectAlertOpen(true)
        }

        setTimeout(()=>{
            const url = new URL(window.location.href);
            const redirectTo = url.searchParams.get("redirect_to");

            if (redirectTo) {
                router.replace(redirectTo);
            } else {
                router.replace(paths.dashboard.overview);
            }
        }, 2000)
    };

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme/>
            <ColorModeSelect sx={{position: 'fixed', top: '1rem', right: '1rem'}}/>
            <Snackbar
                open={redirectAlertOpen}
                autoHideDuration={6000}
                onClose={()=>{}}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert
                    onClose={()=>{}}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Password updated successfully!
                </Alert>
            </Snackbar>
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
                            Password Update
                        </Typography>
                        <Typography variant="body1">
                            Now set up a new secure password for your account.
                        </Typography>
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            sx={{display: 'flex', flexDirection: 'column', gap: 2}}
                        >
                            <FormControl>
                                <FormLabel htmlFor="email">New Password</FormLabel>
                                <TextField
                                    error={passwordError}
                                    helperText={passwordErrorMessage}
                                    name="password"
                                    placeholder="•••••••••"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    autoFocus
                                    required
                                    fullWidth
                                    variant="outlined"
                                    color={passwordError ? 'error' : 'primary'}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="email">Confirm New Password</FormLabel>
                                <TextField
                                    error={passwordError}
                                    helperText={passwordErrorMessage}
                                    name="password-confirm"
                                    placeholder="•••••••••"
                                    type="password"
                                    id="password-confirm"
                                    autoComplete="new-password"
                                    autoFocus
                                    required
                                    fullWidth
                                    variant="outlined"
                                    color={passwordError ? 'error' : 'primary'}
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
                                Update Password
                            </Button>
                        </Box>
                    </MtCard>
                </Box>
            </PageBackground>
        </AppTheme>
    )
}
