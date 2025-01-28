import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import MuiChip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import {styled} from '@mui/material/styles';

import TrendingUpRounded from '@mui/icons-material/TrendingUpRounded';
import TuneRounded from '@mui/icons-material/TuneRounded';
import VisibilityRounded from '@mui/icons-material/VisibilityRounded';
import AttachMoneyRounded from '@mui/icons-material/AttachMoneyRounded';
import AccountBalanceWalletRounded from '@mui/icons-material/AccountBalanceWalletRounded';
import SecurityRounded from '@mui/icons-material/SecurityRounded';

const items = [
    {
        icon: <TrendingUpRounded/>,
        title: 'Instant Returns',
        description:
            'Earn guaranteed 10% monthly returns immediately after investment, ' +
            'with no waiting periods or complex vesting schedules. ' +
            'Your money starts working for you the moment you invest',
        imageLight: `url("/res/features/instant-returns.jpeg")`,
        imageDark: `url("/res/features/instant-returns.jpeg")`,
    },

    {
        icon: <VisibilityRounded/>,
        title: 'Transparent Tracking',
        description:
            'Real-time investment dashboard providing instant visibility into your earnings, total returns, ' +
            'and investment performance. ' +
            'Track every shilling of your investment with crystal-clear, user-friendly analytics.',
        imageLight: `url("/res/features/transparent-tracking.jpeg")`,
        imageDark: `url("/res/features/transparent-tracking.jpeg")`,
    },

    {
        icon: <SecurityRounded/>,
        title: 'Smart Risk Management',
        description:
            'Carefully curated investment strategies backed by sophisticated risk assessment algorithms. ' +
            'Your funds are protected through diversified, calculated investment approaches ' +
            'that prioritize consistent, stable returns',
        imageLight: `url("/res/features/smart-risk.jpeg")`,
        imageDark: `url("/res/features/smart-risk.jpeg")`,
    },

    {
        icon: <AccountBalanceWalletRounded/>,
        title: 'Instant Withdrawals',
        description:
            'Access your funds anytime without penalties. ' +
            "Our platform ensures your money remains liquid and available at a moment's notice, " +
            "providing financial freedom and flexibility",
        imageLight: `url("/res/features/instant-withdrawals.jpeg")`,
        imageDark: `url("/res/features/instant-withdrawals.jpeg")`,
    },

    {
        icon: <AttachMoneyRounded/>,
        title: 'Zero Commission',
        description:
            "No hidden fees or transaction costs. " +
            "Every shilling you invest goes directly towards generating returns, " +
            "maximizing your potential earnings without reducing your principal.",
        imageLight: `url("/res/features/zero-commission.jpeg")`,
        imageDark: `url("/res/features/zero-commission.jpeg")`,
    },

    {
        icon: <TuneRounded/>,
        title: 'Flexible Investment',
        description:
            "Scale your investment seamlessly from $100 to $1,000 in $50 increments. " +
            "Adapt your investment strategy as your financial goals evolve, " +
            "with complete control over your investment amount.",
        imageLight: `url("/res/features/flexible-investment.jpeg")`,
        imageDark: `url("/res/features/flexible-investment.jpeg")`,
    },

];

interface ChipProps {
    selected?: boolean;
}

// @ts-ignore
const Chip = styled(MuiChip)<ChipProps>(({theme}) => ({
    variants: [
        {
            props: ({selected}) => selected,
            style: {
                background:
                    'linear-gradient(to bottom right, hsl(210, 98%, 48%), hsl(210, 98%, 35%))',
                color: 'hsl(0, 0%, 100%)',
                borderColor: theme.palette.primary.light,
                '& .MuiChip-label': {
                    color: 'hsl(0, 0%, 100%)',
                },
                ...theme.applyStyles('dark', {
                    borderColor: theme.palette.primary.dark,
                }),
            },
        },
    ],
}));

interface MobileLayoutProps {
    selectedItemIndex: number;
    handleItemClick: (index: number) => void;
    selectedFeature: (typeof items)[0];
}

export function MobileLayout({
                                 selectedItemIndex,
                                 handleItemClick,
                                 selectedFeature,
                             }: MobileLayoutProps) {
    if (!items[selectedItemIndex]) {
        return null;
    }

    return (
        <Box
            sx={{
                display: {xs: 'flex', sm: 'none'},
                flexDirection: 'column',
                gap: 2,
            }}
        >
            <Box sx={{display: 'flex', gap: 2, overflow: 'auto'}}>
                {items.map(({title}, index) => (
                    <Chip
                        size="medium"
                        key={index}
                        label={title}
                        onClick={() => handleItemClick(index)}
                        selected={selectedItemIndex === index}
                    />
                ))}
            </Box>
            <Card variant="outlined">
                <Box
                    sx={(theme) => ({
                        mb: 2,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        minHeight: 280,
                        backgroundImage: 'var(--items-imageLight)',
                        ...theme.applyStyles('dark', {
                            backgroundImage: 'var(--items-imageDark)',
                        }),
                    })}
                    style={
                        items[selectedItemIndex]
                            ? ({
                                '--items-imageLight': items[selectedItemIndex].imageLight,
                                '--items-imageDark': items[selectedItemIndex].imageDark,
                            } as any)
                            : {}
                    }
                />
                <Box sx={{px: 2, pb: 2}}>
                    <Typography
                        gutterBottom
                        sx={{color: 'text.primary', fontWeight: 'medium'}}
                    >
                        {selectedFeature.title}
                    </Typography>
                    <Typography variant="body2" sx={{color: 'text.secondary', mb: 1.5}}>
                        {selectedFeature.description}
                    </Typography>
                </Box>
            </Card>
        </Box>
    );
}

export default function ServiceFeatures() {
    const [selectedItemIndex, setSelectedItemIndex] = React.useState(0);

    const handleItemClick = (index: number) => {
        setSelectedItemIndex(index);
    };

    const selectedFeature = items[selectedItemIndex];

    return (
        <Container id="features" sx={{py: {xs: 8, sm: 16}}}>
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
                    Here's a tip of the leaf, why you should choose us as your investment partner.
                </Typography>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: {xs: 'column', md: 'row-reverse'},
                    gap: 2,
                }}
            >
                <div>
                    <Box
                        sx={{
                            display: {xs: 'none', sm: 'flex'},
                            flexDirection: 'column',
                            gap: 2,
                            height: '100%',
                        }}
                    >
                        {items.map(({icon, title, description}, index) => (
                            <Box
                                key={index}
                                component={Button}
                                onClick={() => handleItemClick(index)}
                                sx={[
                                    (theme) => ({
                                        p: 2,
                                        height: '100%',
                                        width: '100%',
                                        '&:hover': {
                                            backgroundColor: theme.palette.action.hover,
                                        },
                                    }),
                                    selectedItemIndex === index && {
                                        backgroundColor: 'action.selected',
                                    },
                                ]}
                            >
                                <Box
                                    sx={[
                                        {
                                            width: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'left',
                                            gap: 1,
                                            textAlign: 'left',
                                            textTransform: 'none',
                                            color: 'text.secondary',
                                        },
                                        selectedItemIndex === index && {
                                            color: 'text.primary',
                                        },
                                    ]}
                                >
                                    {icon}

                                    <Typography variant="h6">{title}</Typography>
                                    <Typography variant="body2">{description}</Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                    <MobileLayout
                        selectedItemIndex={selectedItemIndex}
                        handleItemClick={handleItemClick}
                        selectedFeature={selectedFeature}
                    />
                </div>
                <Box
                    sx={{
                        display: {xs: 'none', sm: 'flex'},
                        width: {xs: '100%', md: '70%'},
                        height: 'var(--items-image-height)',
                    }}
                >
                    <Card
                        variant="outlined"
                        sx={{
                            height: '100%',
                            width: '100%',
                            display: {xs: 'none', sm: 'flex'},
                            pointerEvents: 'none',
                        }}
                    >
                        <Box
                            sx={(theme) => ({
                                m: 'auto',
                                width: 420,
                                height: 500,
                                backgroundSize: 'contain',
                                backgroundImage: 'var(--items-imageLight)',
                                ...theme.applyStyles('dark', {
                                    backgroundImage: 'var(--items-imageDark)',
                                }),
                            })}
                            style={
                                items[selectedItemIndex]
                                    ? ({
                                        '--items-imageLight': items[selectedItemIndex].imageLight,
                                        '--items-imageDark': items[selectedItemIndex].imageDark,
                                    } as any)
                                    : {}
                            }
                        />
                    </Card>
                </Box>
            </Box>
        </Container>
    );
}
