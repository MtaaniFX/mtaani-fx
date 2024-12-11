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
import {Alert, AlertTitle} from "@mui/material";

const supabase = createClient();

export default function (props: { disableCustomTheme?: boolean }) {
    const [passwordError, setPasswordError] = React.useState(false);
    const [showAlert, setShowAlert] = React.useState('hidden');
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');

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

        setShowAlert("visible")

        // const { data, error } = await supabase.auth.updateUser({
        //     password: password,
        // })

        // console.log("returned: data: ", data, " error:", error);
    };

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme/>
            <ColorModeSelect sx={{position: 'fixed', top: '1rem', right: '1rem'}}/>
            <PageBackground>
                <Alert
                    className={"animate-bounce z-10 transition-all"}
                    severity="success"
                    sx={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    zIndex: 1000,
                    visibility: showAlert,
                }}>
                    <AlertTitle>Success</AlertTitle>
                    This is a success Alert with an encouraging title.
                </Alert>
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
