"use client"

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MuiCard from '@mui/material/Card';
import {styled} from '@mui/material/styles';
import AppTheme from '@/components/internal/shared-theme/AppTheme';
import ColorModeSelect from '@/components/internal/shared-theme/ColorModeSelect';
import {FaviconRow} from '@/components/internal/icons/Favicon';
import PageBackground from "@/components/internal/ui/PageBackground";
import {createClient} from "@/utils/supabase/client";

const supabase = createClient();

const Card = styled(MuiCard)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    [theme.breakpoints.up('sm')]: {
        width: '450px',
    },
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

export default function (props: { disableCustomTheme?: boolean }) {
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');

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

        const { data, error } = await supabase.auth.resetPasswordForEmail(email as string, {
            // TODO replace localhost
            redirectTo: `http://localhost:3000/auth/callback?redirect_to=/u/0/update-password`,
        })
        console.log("returned: data: ", data, " error:", error);
    };

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme/>
            <ColorModeSelect sx={{position: 'fixed', top: '1rem', right: '1rem'}}/>
            <PageBackground>
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "2em",
                    minHeight: "100vh"
                }}>
                    <Card variant="outlined">
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
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                onClick={validateInputs}
                            >
                                Reset Password
                            </Button>
                        </Box>
                    </Card>
                </Box>
            </PageBackground>
        </AppTheme>
    )
}
