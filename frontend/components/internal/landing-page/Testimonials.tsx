import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
// import Avatar from "@mui/material/Avatar";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export type Testimonial = {
    name: string,
    message: string,
    position: string,
    avatar: string,
}

const mockTestimonials: Testimonial[] = [
    {
        avatar: "res/testimonials/nothing-here.svg",
        name: 'Tatu Wambui',
        message: "I was skeptical at first, but the consistent 10% returns have completely changed my perspective on investing.",
        position: 'Investor'
    },

    {
        avatar: "res/testimonials/nothing-here.svg",
        name: 'Kendi Mwangangi',
        message: "As a young professional, I appreciate how easy it is to track my investments. No complicated jargon, just clear returns.",
        position: 'Investor'
    },

    {
        avatar: "res/testimonials/nothing-here.svg",
        name: 'Jabari Mutiso',
        message: "I started with just $100 and now make $50 monthly. It's like finding money I didn't know I had!",
        position: 'Investor'
    },

    {
        avatar: "res/testimonials/nothing-here.svg",
        name: 'Amina Njeri',
        message: "The instant withdrawal feature is a game-changer. My money works for me, but I'm never locked in.",
        position: 'Investor'
    },

    {
        avatar: "res/testimonials/nothing-here.svg",
        name: 'Ochieng Odinga',
        message: "Zero commission means every shilling counts. This is the smartest financial move I've made.",
        position: 'Investor'
    },

    {
        avatar: "res/testimonials/nothing-here.svg",
        name: 'Kiprop Chebet',
        message: "Flexible investment options let me start small and grow at my own pace. Finally, an investment platform that understands me.",
        position: 'Investor'
    },
]

const logoStyle = {
    width: '64px',
    opacity: 0.3,
};

export default function Testimonials({testimonials}:{testimonials?: Testimonial[] }) {
    if (testimonials === undefined){
        testimonials = mockTestimonials
    }

    return (
        <Container
            id="testimonials"
            sx={{
                pt: { xs: 4, sm: 12 },
                pb: { xs: 8, sm: 16 },
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: { xs: 3, sm: 6 },
            }}
        >
            <Box
                sx={{
                    width: { sm: '100%', md: '60%' },
                    textAlign: { sm: 'left', md: 'center' },
                }}
            >
                <Typography
                    component="h2"
                    variant="h4"
                    gutterBottom
                    sx={{ color: 'text.primary' }}
                >
                    Why Our Investors Trust Us
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Our platform stands out by offering transparent,
                    high-yield investments with unprecedented flexibility.
                    Real people, real results – hear directly from investors who've transformed
                    their financial futures with us.
                </Typography>
            </Box>
            <Grid container spacing={2}>
                {testimonials.map((testimonial, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index} sx={{ display: 'flex' }}>
                        <Card
                            variant="outlined"
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                flexGrow: 1,
                            }}
                        >
                            <CardContent>
                                <Typography
                                    variant="body1"
                                    gutterBottom
                                    sx={{ color: 'text.secondary' }}
                                >
                                    {testimonial.message}
                                </Typography>
                            </CardContent>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <CardHeader
                                    // avatar={<Avatar alt="user avatar" src={testimonial.avatar} />}
                                    avatar={<AccountCircleIcon/>}
                                    title={testimonial.name}
                                    subheader={testimonial.position}
                                />
                                <img
                                    src={testimonial.avatar}
                                    alt="user company"
                                    style={logoStyle}
                                />
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
