import React, {ReactNode} from "react";
import {Spotlight} from "@/components/ui/Spotlight";
import {useTheme} from '@mui/material/styles';
import NotificationButton from "@/components/internal/ui/NotificationButton";
import TextGradient from "@/components/internal/ui/TextGradient";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import {Teknaf} from "@/app/fonts/Teknaf";
import {PoppinsFont} from "@/app/fonts/Poppins";
import {FaviconRow} from "@/components/internal/icons/Favicon";
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

    let gradient = theme.palette.mode === 'dark' ?
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

function HeaderText({children}: { children: ReactNode }) {
    let theme = useTheme()
    let options = {
        startColor: "#d15b00",
        // startColor: "#4c82ed",
        endColor: "#4c82ed",
        // endColor: "#FF6767",
        direction: "left",
        variant: "h3",
        textAlign: "center",
        className: Teknaf.className,
    };

    options.startColor = '#d15b00'
    options.endColor = '#d1c300'
    options.endColor = '#76d100'

    if (theme.palette.mode === 'light') {
        options.endColor = '#BA8B02'
        options.startColor = '#181818'
    }
    return (
        <TextGradient options={options}>
            {children}
        </TextGradient>
    );
}

function Hero() {
    const theme = useTheme();
    return (<>
        <div className="w-full min-h-screen "
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
                >Investment that just works 💼</NotificationButton>
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
                    <Button variant="contained">Get Started</Button>
                    <Button variant="outlined">Our Story</Button>
                </Stack>
            </Stack>

            <div className={cn("mt-5")}></div>
            <TrustedPartners/>
            <FaviconRow/>
        </div>
        <Spotlight
            className="-top-40 left-0 md:left-60 md:-top-20"
            fill="yellow"
        />
    </>);
}

function Hero1() {
    return (<div className="h-[40rem] w-full
        flex md:items-center md:justify-center bg-black/[0.96]
        antialiased bg-grid-white/[0.02] relative overflow-hidden">
        <Spotlight
            className="-top-40 left-0 md:left-60 md:-top-20"
            fill="yellow"
        />
        <div className=" p-4 max-w-7xl  mx-auto relative
            z-10  w-full pt-20 md:pt-0">
            <h1 className="text-4xl md:text-7xl font-bold
                text-center bg-clip-text text-transparent
                bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
                Spotlight <br/> is the new trend.
            </h1>
            <p className="mt-4 font-normal text-base text-neutral-300
                 max-w-lg text-center mx-auto">
                Spotlight effect is a great way to draw attention to a specific part
                of the page. Here, we are drawing the attention towards the text
                section of the page. I don&apos;t know why but I&apos;m running out of
                copy.
            </p>
        </div>
    </div>);
}

export default Hero;
