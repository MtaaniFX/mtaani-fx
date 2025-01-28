import React, {ReactNode} from "react";
import {Spotlight} from "@/components/ui/Spotlight";
import {useTheme} from '@mui/material/styles';
import NotificationButton from "@/components/internal/ui/NotificationButton";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import {Teknaf} from "@/app/fonts/Teknaf";
import {PoppinsFont} from "@/app/fonts/Poppins";
import {cn} from "@/lib/utils";
import TrustedPartners from "@/components/internal/landing-page/TrustedPartners";

type HeroTextGradientProps = {
    // Dark theme gradient
    darkGradient?: string,
    // Light theme gradient
    lightGradient?: string,
    children: ReactNode,
}

function HeroTextGradient(props: HeroTextGradientProps) {
    let theme = useTheme()

    function simpleGradient(startColor: string, endColor: string) {
        const direction = "left"
        return `linear-gradient( to ${direction}, ${startColor}, ${endColor})`
    }

    const gradient = theme.palette.mode === 'dark' ?
        props.darkGradient !== undefined ?
            props.darkGradient : simpleGradient('#d15b00', '#76d100') :
        props.lightGradient !== undefined ?
            props.lightGradient : simpleGradient('#BA8B02', '#181818');

    return (
        <Typography
            variant="h1"
            textAlign="center"
            sx={{
                backgroundImage: gradient,
                backgroundSize: "100%",
                backgroundRepeat: "repeat",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontFamily: Teknaf.style.fontFamily,
                letterSpacing: "0.25rem",
            }}
        >
            {props.children}
        </Typography>
    );
}

function Hero() {
    const theme = useTheme();
    return (<>
        <div className="w-full"
             style={{backgroundColor: theme.palette.background.default}}>

            <Stack
                direction="column"
                spacing={2}
                sx={{
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <div className={"h-[5rem] w-full pt-[18vh]"}></div>
                <NotificationButton sx={{
                    fontFamily: `${PoppinsFont.style.fontFamily}, sans-serif`,
                }}
                >💼 &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; Investment that just works!</NotificationButton>
                <HeroTextGradient>Building the future of investment with MtaaniFX</HeroTextGradient>
                <Typography
                    align={"center"}
                    sx={{
                        mt: 3,
                        fontFamily: `${PoppinsFont.style.fontFamily}, sans-serif`,
                        fontSize: 'medium',
                    }}
                >
                    Unlock the potential of your money with an investment platform designed for success.<br/>
                    Whether you're a beginner or a seasoned investor,
                    our platform makes it easy to grow your wealth with confidence.
                    <br/>
                    <br/>
                    Join thousands of investors who trust us to turn their financial goals into reality.
                    <br/>
                    It’s time for your investment strategy to just work.
                </Typography>
                <Stack direction="row" spacing={2}>
                    <Button href={"/#go-pricing"}
                            variant="contained">
                        Get Started
                    </Button>
                    <Button href={"/#go-testimonials"}
                            variant="outlined">
                        Our Story
                    </Button>
                </Stack>
            </Stack>

            <div className={cn("mt-5")}></div>
            <TrustedPartners/>
        </div>
        <Spotlight
            className="-top-40 left-0 md:left-60 md:-top-20"
            fill="yellow"
        />
    </>);
}

export default Hero;
