"use client"

import SignUp from "../components/SignUp";
import Content from "../components/Content";
import ContentBySideCard from "../components/ContentBySideCard";
import ThemedRootLayout from "../components/ThemedRootLayout";
import UnderConstructionDialogue from "@/components/internal/ui/UnderConstructionDialogue";
import {Alert, AlertTitle, Snackbar} from "@mui/material";
import React from "react";
import GoToEmailConfirmation from "@/app/(auth)/components/GoToEmailConfirmation";

export default function SignUpPage() {
    const [underConstruction, setUnderConstruction] = React.useState(false);
    const [submissionError, setSubmissionError] = React.useState(false);
    const [showEmailConfirmation, setShowEmailConfirmation] = React.useState(false);
    const [submissionMessage, setSubmissionMessage] = React.useState('');

    return (
        <ThemedRootLayout>
            <UnderConstructionDialogue
                open={underConstruction}
                setOpen={setUnderConstruction}/>
            <Snackbar
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                open={submissionError}>
                <Alert
                    severity="error"
                    variant="filled"
                    onClose={() => {
                        setSubmissionError(false);
                    }}
                    sx={{width: '100%'}}
                >
                    <AlertTitle>Error</AlertTitle>
                    {submissionMessage}
                </Alert>
            </Snackbar>

            {showEmailConfirmation? (
                <GoToEmailConfirmation/>
            ): (
                <ContentBySideCard
                    content={<Content/>}
                    card={
                        <SignUp setSubmissionError={setSubmissionError}
                                setSubmissionMessage={setSubmissionMessage}
                                setUnderConstruction={setUnderConstruction}
                                setShowEmailConfirmation={setShowEmailConfirmation}/>
                    }
                />
            )}

        </ThemedRootLayout>
    )
}
