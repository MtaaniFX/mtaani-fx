import Stack from '@mui/material/Stack';
import React from "react";

export type ContentBySideCardProps = {
    // Single card component, such as a sign-up form
    card: React.ReactNode;
    // Content to be displayed to the left of the card component
    content: React.ReactNode;
}

export default function ContentBySideCard({content, card}: ContentBySideCardProps) {
    return (
        <Stack
            direction="column"
            component="main"
            sx={[
                {
                    justifyContent: 'center',
                    marginTop: 'max(40px - var(--template-frame-height, 0px), 0px)',
                    minHeight: '100vh',
                },
                (theme) => ({
                    '&::before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        zIndex: -1,
                        inset: 0,
                        ...theme.applyStyles('dark', {}),
                    },
                }),
            ]}
        >
            <Stack
                direction={{xs: 'column-reverse', md: 'row'}}
                sx={{
                    justifyContent: 'center',
                    gap: {xs: 6, sm: 12},
                    p: 2,
                    mx: 'auto',
                }}
            >
                <Stack
                    direction={{xs: 'column-reverse', md: 'row'}}
                    sx={{
                        justifyContent: 'center',
                        gap: {xs: 6, sm: 12},
                        p: {xs: 2, sm: 4},
                        m: 'auto',
                    }}
                >
                    {content}
                    {card}
                </Stack>
            </Stack>
        </Stack>
    );
}
