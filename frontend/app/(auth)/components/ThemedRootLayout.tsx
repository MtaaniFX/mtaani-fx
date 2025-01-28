import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import ColorModeSelect from "@/components/internal/shared-theme/ColorModeSelect";
import AppTheme from "@/components/internal/shared-theme/AppTheme";
import PageBackground from "@/components/internal/ui/PageBackground";
import {ThemeOptions} from "@mui/material/styles";

interface AppThemeProps {
    children: React.ReactNode;
    disableCustomTheme?: boolean;
    themeComponents?: ThemeOptions["components"];
}

export default function ThemedRootLayout({children, themeComponents, disableCustomTheme}: AppThemeProps) {
    return (
        <AppTheme themeComponents={themeComponents} disableCustomTheme={disableCustomTheme}>
            <CssBaseline enableColorScheme/>
            <ColorModeSelect sx={{position: 'fixed', top: '1rem', right: '1rem'}}/>
            <PageBackground>
                {children}
            </PageBackground>
        </AppTheme>
    )
}
