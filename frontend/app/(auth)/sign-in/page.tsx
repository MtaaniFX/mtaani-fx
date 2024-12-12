"use client"

import SignInCard from '../components/SignInCard'
import ThemedRootLayout from "@/app/(auth)/components/ThemedRootLayout";
import Content from "@/app/(auth)/components/Content";
import ContentBySideCard from "@/app/(auth)/components/ContentBySideCard";

export default function SignInPage() {
    return (
        <ThemedRootLayout>
            <ContentBySideCard
                content={<Content/>}
                card={<SignInCard/>}/>
        </ThemedRootLayout>
    )
};
