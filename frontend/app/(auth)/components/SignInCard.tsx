import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { GoogleIcon, FacebookIcon } from './CustomIcons';
import {FaviconRow} from '@/components/internal/icons/Favicon';
import {paths} from "@/lib/paths";
import UnderConstructionDialogue from "@/components/internal/ui/UnderConstructionDialogue";
import {createClient} from "@/utils/supabase/client";
import {useRouter} from "next/navigation";
import {Alert, AlertTitle, Snackbar} from "@mui/material";
import { MtCard } from '@/components/internal/styled/MtCard';

const supabase = createClient();

export default function SignInCard() {
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [underConstruction, setUnderConstruction] = React.useState(false);
    const [submissionError, setSubmissionError] = React.useState(false);
    const [submissionMessage, setSubmissionMessage] = React.useState('');
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (emailError || passwordError) {
            return;
        }

        const formData = new FormData(event.currentTarget);
        const email = formData.get('email');
        const password = formData.get('password');

        if(!email || !password) {
            return
        }

        const { error } = await supabase.auth.signInWithPassword({
            email: email as string,
            password: password as string,
        })

        if(error) {
            setSubmissionError(true);
            setSubmissionMessage(error.message)
            return
        }

        setTimeout(()=>{
            const url = new URL(window.location.href);
            const redirectTo = url.searchParams.get("redirect_to");

            if (redirectTo) {
                router.replace(redirectTo);
            } else {
                router.replace(paths.dashboard.overview);
            }
        }, 200);
    };

    const validateInputs = () => {
        const email = document.getElementById('email') as HTMLInputElement;
        const password = document.getElementById('password') as HTMLInputElement;
        setSubmissionError(false);

        let isValid = true;

        if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!password.value || password.value.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 6 characters long.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        return isValid;
    };

    return (
        <MtCard variant="outlined">
            <UnderConstructionDialogue
                open={underConstruction}
                setOpen={setUnderConstruction}/>
            <Snackbar
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                open={submissionError} >
                <Alert
                    severity="error"
                    variant="filled"
                    onClose={() => {setSubmissionError(false);}}
                    sx={{ width: '100%' }}
                >
                    <AlertTitle>Error</AlertTitle>
                    {submissionMessage}
                </Alert>
            </Snackbar>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                <FaviconRow/>
            </Box>
            <Typography
                component="h1"
                variant="h4"
                sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
            >
                Sign in
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
            >
                <FormControl>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <TextField
                        error={emailError}
                        helperText={emailErrorMessage}
                        id="email"
                        type="email"
                        name="email"
                        placeholder="your@email.com"
                        autoComplete="email"
                        autoFocus
                        required
                        fullWidth
                        variant="outlined"
                        color={emailError ? 'error' : 'primary'}
                    />
                </FormControl>
                <FormControl>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <Link
                            href={paths.auth.resetPassword}
                            variant="body2"
                            sx={{ alignSelf: 'baseline' }}
                        >
                            Forgot your password?
                        </Link>
                    </Box>
                    <TextField
                        error={passwordError}
                        helperText={passwordErrorMessage}
                        name="password"
                        placeholder="•••••••••"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        autoFocus
                        required
                        fullWidth
                        variant="outlined"
                        color={passwordError ? 'error' : 'primary'}
                    />
                </FormControl>
                <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                />
                <Button type="submit" fullWidth variant="contained" onClick={validateInputs}>
                    Sign in
                </Button>
                <Typography sx={{ textAlign: 'center' }}>
                    Don&apos;t have an account?{' '}
                    <span>
            <Link
                href={paths.auth.signUp}
                variant="body2"
                sx={{ alignSelf: 'center' }}
            >
              Sign up
            </Link>
          </span>
                </Typography>
            </Box>
            <Divider>or</Divider>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setUnderConstruction(true)}
                    startIcon={<GoogleIcon />}
                >
                    Sign in with Google
                </Button>
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setUnderConstruction(true)}
                    startIcon={<FacebookIcon />}
                >
                    Sign in with Facebook
                </Button>
            </Box>
        </MtCard>
    );
}
