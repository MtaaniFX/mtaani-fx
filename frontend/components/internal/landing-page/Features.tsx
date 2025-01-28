import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import TrendingUpRounded from "@mui/icons-material/TrendingUpRounded";
import VisibilityRounded from "@mui/icons-material/VisibilityRounded";
import SecurityRounded from "@mui/icons-material/SecurityRounded";
import AccountBalanceWalletRounded from "@mui/icons-material/AccountBalanceWalletRounded";
import AttachMoneyRounded from "@mui/icons-material/AttachMoneyRounded";
import TuneRounded from "@mui/icons-material/TuneRounded";
import Grid from "@mui/material/Grid2";

type FeatureProp = {
    title: string; description: string; icon: React.ReactNode; image: string;
}

const features: FeatureProp[] =  [
    {
        icon: <TrendingUpRounded/>,
        title: 'Instant Returns',
        description:
            'Earn guaranteed 10% monthly returns immediately after investment, ' +
            'with no waiting periods or complex vesting schedules. ' +
            'Your money starts working for you the moment you invest',
        image: "/res/features/instant-returns.jpeg",
    },

    {
        icon: <VisibilityRounded/>,
        title: 'Transparent Tracking',
        description:
            'Real-time investment dashboard providing instant visibility into your earnings, total returns, ' +
            'and investment performance. ' +
            'Track every shilling of your investment with crystal-clear, user-friendly analytics.',
        image: "/res/features/transparent-tracking.jpeg",
    },

    {
        icon: <SecurityRounded/>,
        title: 'Smart Risk Management',
        description:
            'Carefully curated investment strategies backed by sophisticated risk assessment algorithms. ' +
            'Your funds are protected through diversified, calculated investment approaches ' +
            'that prioritize consistent, stable returns',
        image: "/res/features/smart-risk.jpeg",
    },

    {
        icon: <AccountBalanceWalletRounded/>,
        title: 'Instant Withdrawals',
        description:
            'Access your funds anytime without penalties. ' +
            "Our platform ensures your money remains liquid and available at a moment's notice, " +
            "providing financial freedom and flexibility",
        image: "/res/features/instant-withdrawals.jpeg",
    },

    {
        icon: <AttachMoneyRounded/>,
        title: 'Zero Commission',
        description:
            "No hidden fees or transaction costs. " +
            "Every shilling you invest goes directly towards generating returns, " +
            "maximizing your potential earnings without reducing your principal.",
        image: "/res/features/zero-commission.jpeg",
    },

    {
        icon: <TuneRounded/>,
        title: 'Flexible Investment',
        description:
            "Scale your investment seamlessly from $100 to $1,000 in $50 increments. " +
            "Adapt your investment strategy as your financial goals evolve, " +
            "with complete control over your investment amount.",
        image: "/res/features/flexible-investment.jpeg",
    },
];

function ActionAreaCard({title, description, icon, image}: FeatureProp) {
    return (<Card sx={{maxWidth: 345}}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="140"
                    image={image}
                    alt="green iguana"
                />
                <CardContent>
                    <span>
                        {icon}
                        <Typography gutterBottom variant="h5" component="span">
                        &nbsp;&nbsp;{title}
                        </Typography>
                    </span>

                    <Typography variant="body2" sx={{color: 'text.secondary'}}>
                        {description}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>);
}

export default function Features() {
    return (
        <Container sx={{py: {xs: 8, sm: 16}}}>
            <Box sx={{width: {sm: '100%', md: '60%'}}}>
                <Typography
                    component="h2"
                    variant="h4"
                    gutterBottom
                    sx={{color: 'text.primary'}}
                >
                    Product features
                </Typography>
                <Typography
                    variant="body1"
                    sx={{color: 'text.secondary', mb: {xs: 2, sm: 4}}}
                >
                    Here's a tip of the leaf, why we're the investment partner you've been looking for.
                </Typography>
            </Box>

            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                {features.map((feat, index) => (
                    <Grid key={index} size={{ xs: 2, sm: 4, md: 4 }}>
                        <ActionAreaCard key={index}
                                        title={feat.title}
                                        description={feat.description}
                                        icon={feat.icon}
                                        image={feat.image}
                        />
                    </Grid>
                ))}
            </Grid>
        </Container>)
}
