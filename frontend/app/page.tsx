"use client";

import React from "react";
import {ShootingStars} from "@/components/ui/shooting-stars";
import {StarsBackground} from "@/components/ui/stars-background";
import AppTheme from "@/components/internal/shared-theme/AppTheme";
import CssBaseline from "@mui/material/CssBaseline";
import AppAppBar from "@/components/internal/mui-template/components/AppAppBar";
import Hero from "@/components/internal/ui/Hero";
import ServiceFeatures from "@/components/internal/landing-page/ServiceFeatures";

function LandingPage(props) {
    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <AppAppBar />
            <Hero/>
            <ServiceFeatures/>
            <div className={"w-full h-[2000px] bg-amber-600"}></div>
        </AppTheme>
    );
}

function LandingPage4(props) {
    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <AppAppBar />
            <div className={"w-full h-[2000px] bg-amber-600"}></div>
            {/*<Hero />*/}
            {/*<div>*/}
            {/*    <LogoCollection />*/}
            {/*    <Features />*/}
            {/*    <Divider />*/}
            {/*    <Testimonials />*/}
            {/*    <Divider />*/}
            {/*    <Highlights />*/}
            {/*    <Divider />*/}
            {/*    <Pricing />*/}
            {/*    <Divider />*/}
            {/*    <FAQ />*/}
            {/*    <Divider />*/}
            {/*    <Footer />*/}
            {/*</div>*/}
        </AppTheme>
    );
}

function LandingPage2() {
    return (
        <>
            <header className="fixed top-0 z-50 backdrop-blur border-none
            rounded-full py-5 px-4 w-full h-[70px] bg-amber-600 overflow-hidden">
                {/*<div className={"h-[60px] w-[100%] bg-amber-600"}></div>*/}
            </header>

            <div className="h-[2000px] bg-neutral-900 flex flex-col items-center
            justify-center relative w-full border-b-blue-800 border-4">
                {/*<h2 className="relative flex-col md:flex-row z-10 text-3xl md:text-5xl md:leading-tight*/}
                {/*max-w-5xl mx-auto text-center tracking-tight font-medium*/}
                {/*bg-clip-text text-transparent bg-gradient-to-b from-neutral-800*/}
                {/*via-white to-white flex items-center gap-2 md:gap-8">*/}
                {/*    <span>Shooting Star</span>*/}
                {/*    <span className="text-white text-lg font-thin">x</span>*/}
                {/*    <span>Star Background</span>*/}
                {/*</h2>*/}
                <ShootingStars/>
                <StarsBackground/>
            </div>
        </>
    )
}

function LandingPage3() {
    return (
        <>
            <header className="sticky top-0 z-50 backdrop-blur border-none
          rounded-full py-5 px-4 w-full h-[70px] bg-amber-600">
                {/*<div className={"h-[60px] w-[100%] bg-amber-600"}></div>*/}
            </header>

            {/*<div className="h-[100vh] bg-neutral-900 flex flex-col items-center justify-center relative w-full">*/}
            {/*    <h2 className="relative flex-col md:flex-row z-10 text-3xl md:text-5xl md:leading-tight*/}
            {/*    max-w-5xl mx-auto text-center tracking-tight font-medium*/}
            {/*    bg-clip-text text-transparent bg-gradient-to-b from-neutral-800*/}
            {/*    via-white to-white flex items-center gap-2 md:gap-8">*/}
            {/*        <span>Shooting Star</span>*/}
            {/*        <span className="text-white text-lg font-thin">x</span>*/}
            {/*        <span>Star Background</span>*/}
            {/*    </h2>*/}
            {/*<ShootingStars/>*/}
            {/*<StarsBackground/>*/}
            {/*</div>*/}

            <div className="h-[100vh] bg-neutral-900 flex flex-col items-center justify-center relative w-full">
                {/*<h2 className="relative flex-col md:flex-row z-10 text-3xl md:text-5xl md:leading-tight*/}
                {/*max-w-5xl mx-auto text-center tracking-tight font-medium*/}
                {/*bg-clip-text text-transparent bg-gradient-to-b from-neutral-800*/}
                {/*via-white to-white flex items-center gap-2 md:gap-8">*/}
                {/*    <span>Shooting Star</span>*/}
                {/*    <span className="text-white text-lg font-thin">x</span>*/}
                {/*    <span>Star Background</span>*/}
                {/*</h2>*/}
                <ShootingStars/>
                <StarsBackground/>
            </div>


            <div className={"w-full h-[2000px]"}></div>
            {/*<ShootingStars/>*/}
            {/*<StarsBackground/>*/}
        </>
    );
}

export default LandingPage;
