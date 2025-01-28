import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {FacebookIcon, GoogleIcon} from './CustomIcons';
import {FaviconRow as SitemarkIcon} from '@/components/internal/icons/Favicon';
import {MtCard} from "@/components/internal/styled/MtCard";
import {paths} from "@/lib/paths";
import {createClient} from "@/utils/supabase/client";
import { useRouter } from 'next/navigation';

const supabase = createClient();

type SignUpProps = {
    // A dispatcher, that when set to true, will display a dialogue,
    // telling the user the given action is under construction
    setUnderConstruction:  React.Dispatch<React.SetStateAction<boolean>>,
    setSubmissionError:  React.Dispatch<React.SetStateAction<boolean>>,
    setSubmissionMessage:  React.Dispatch<React.SetStateAction<string>>,
    setShowEmailConfirmation:  React.Dispatch<React.SetStateAction<boolean>>,
}

export default function SignUp(props: SignUpProps) {
    const {setUnderConstruction, setSubmissionMessage, setSubmissionError, setShowEmailConfirmation} = props;
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [nameError, setNameError] = React.useState(false);
    const [nameErrorMessage, setNameErrorMessage] = React.useState('');

    const router = useRouter();

    const validateInputs = () => {
        const email = document.getElementById('email') as HTMLInputElement;
        const password = document.getElementById('password') as HTMLInputElement;
        const name = document.getElementById('name') as HTMLInputElement;

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

        if (!name.value || name.value.length < 1) {
            setNameError(true);
            setNameErrorMessage('Name is required.');
            isValid = false;
        } else {
            setNameError(false);
            setNameErrorMessage('');
        }

        return isValid;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (nameError || emailError || passwordError) {
            return;
        }

        const formData = new FormData(event.currentTarget);
        const {name, email, password} = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
        }

        if (!name || !email || !password) {
            setSubmissionError(true);
            setSubmissionMessage("Invalid Credentials");
            return;
        }

        const url = new URL(window.location.href);
        let redirectTo: string | null | undefined = url.searchParams.get("redirect_to");
        if (!redirectTo) {
            redirectTo = undefined;
        }

        console.log("Sending SignUp request: email:", email, " password: ", password);
        const { data, error } = await supabase.auth.signUp({
            email: email as string,
            password: password as string,
            options: {
                emailRedirectTo: redirectTo,
            },
        });
        console.log("SignUp response: ", error);
        console.log("SignUp response: data: ", data);

        if (error) {
            setSubmissionError(true);
            setSubmissionMessage(error.message);
            return;
        }

        if (data.user) {
            if(data.user.email_confirmed_at){
                // This user is already a member, redirect to login page
                let goTo: string = paths.auth.signIn;
                if (redirectTo){
                    goTo = `${goTo}/redirect_to=${redirectTo}`;
                }
                router.replace(goTo);
                return;
            }
        }

        setShowEmailConfirmation(true);
    };

    return (
        <MtCard variant="outlined">
            <SitemarkIcon/>
            <Typography
                component="h1"
                variant="h4"
                sx={{width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)'}}
            >
                Sign up
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{display: 'flex', flexDirection: 'column', gap: 2}}
            >
                <FormControl>
                    <FormLabel htmlFor="name">Full name</FormLabel>
                    <TextField
                        autoComplete="name"
                        name="name"
                        required
                        fullWidth
                        id="name"
                        placeholder="Jon Doe Snow"
                        error={nameError}
                        helperText={nameErrorMessage}
                        color={nameError ? 'error' : 'primary'}
                    />
                </FormControl>
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
                        color={passwordError ? 'error' : 'primary'}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <TextField
                        required
                        fullWidth
                        name="password"
                        placeholder="•••••••••"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        variant="outlined"
                        error={passwordError}
                        helperText={passwordErrorMessage}
                        color={passwordError ? 'error' : 'primary'}
                    />
                </FormControl>
                <FormControlLabel
                    control={<Checkbox value="allowExtraEmails" color="primary"/>}
                    label="I want to receive updates via email."
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    onClick={validateInputs}
                >
                    Sign up
                </Button>
                <Typography sx={{textAlign: 'center'}}>
                    Already have an account?{' '}
                    <Link
                        href={paths.auth.signIn}
                        variant="body2"
                        sx={{alignSelf: 'center'}}
                    >
                        Sign in
                    </Link>
                </Typography>
            </Box>
            <Divider>
                <Typography sx={{color: 'text.secondary'}}>or</Typography>
            </Divider>
            <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setUnderConstruction(true)}
                    startIcon={<GoogleIcon/>}
                >
                    Sign up with Google
                </Button>
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setUnderConstruction(true)}
                    startIcon={<FacebookIcon/>}
                >
                    Sign up with Facebook
                </Button>
            </Box>
        </MtCard>
    );
}
