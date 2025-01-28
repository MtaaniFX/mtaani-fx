import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Image from 'next/image'
import { useTheme } from '@mui/system';

interface LogoInfo {
    alt: string;
    src: string;
}

const logos: LogoInfo[] = [
    // {
    //     alt: "CMA",
    //     src: "/res/regulatory/cma-logo-horizontal-1-257x65.png",
    // },

    {
        alt: "Lipa na M-Pesa",
        src: "/res/regulatory/lipa-na-m-pesa.png",
    },

    // {
    //     alt: "IRA",
    //     src: "/res/regulatory/logo-ira-lg.webp",
    // },
    //
    // {
    //     alt: "KRA",
    //     src: "/res/regulatory/logoKRA.webp",
    // },
    //
    // {
    //     alt: "CBK",
    //     src: "/res/regulatory/NewLogoCBK.png",
    // },
    //
    // {
    //     alt: "Safaricom",
    //     src: "/res/regulatory/safaricom-logo-green.png",
    // }
]

// const logoStyle = {
//     width: '100px',
//     height: '80px',
//     margin: '0 32px',
//     opacity: 0.7,
// };

export default function TrustedPartners() {
    // const theme = useTheme();
    // const logos = theme.palette.mode === 'light' ? darkLogos : whiteLogos;

    const ratio = 0.25
    return (
        <Box id="trusted-partners" sx={{ py: 4 }}>
            <Typography
                component="p"
                variant="subtitle2"
                align="center"
                sx={{ color: 'text.secondary' }}
            >
                Payment Processor
            </Typography>
            <Grid container sx={{ justifyContent: 'center', mt: 0.5, opacity: 0.6 }}>
                {logos.map((logo, index) => (
                    <Grid item key={index}>
                        {/*<img*/}
                        {/*    src={logo.src}*/}
                        {/*    alt={logo.alt}*/}
                        {/*    style={logoStyle}*/}
                        {/*/>*/}
                        <Image
                            src={logo.src}
                            alt={logo.alt}
                            width={666*ratio}
                            height={375*ratio}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
