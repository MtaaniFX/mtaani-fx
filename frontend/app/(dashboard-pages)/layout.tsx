"use client"

import { useState, useEffect, ReactNode } from 'react';
import {
    AppBar,
    Avatar,
    Box,
    CssBaseline,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem, ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {linkIdMap, pages} from "@/app/(dashboard-pages)/dashboard.settings";
import { LinearProgress } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const drawerWidth = 240;

interface Props {
    children: ReactNode;
}

const getDesignTokens = (mode: 'light' | 'dark') => ({
    palette: {
        mode,
        ...(mode === 'light'
            ? {
                // palette values for light mode
                primary: {
                    main: '#1976d2',
                },
            }
            : {
                // palette values for dark mode
                primary: {
                    main: '#90caf9',
                },
                background: {
                    default: '#121212',
                    paper: '#121212',
                },
            }),
    },
});

const getStoredTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined') {
        return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    }
    return 'light';
};

export default function RootLayout({ children }: Props) {
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<'light' | 'dark'>(getStoredTheme());
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
    const pathname = usePathname();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        localStorage.setItem('theme', mode);
    }, [mode]);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const handleThemeChange = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    const selectedItem = linkIdMap.get(pathname);
    const [selectedPage, setSelectedPage] = useState(selectedItem === undefined ? "" : selectedItem);

    const colorMode = {
        toggleColorMode: handleThemeChange,
    };

    const themeInstance = createTheme(getDesignTokens(mode));

    const [hideAppBar, setHideAppBar] = useState(false);
    const [prevScrollPos, setPrevScrollPos] = useState(0);

    const handleScroll = () => {
        const currentScrollPos = window.scrollY;
        setHideAppBar(prevScrollPos < currentScrollPos && currentScrollPos > 64);
        setPrevScrollPos(currentScrollPos);
    };

    useEffect(() => {
        // window.addEventListener('load', ()=>{setLoading(false)});
        // document.addEventListener('load', ()=>{setLoading(false)});
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [prevScrollPos, hideAppBar]);

    const drawer = (
        <div>
            <Toolbar />
            <Divider />
            <List>
                {pages.map((item) => (
                    <Link href={item.link} key={item.text} passHref legacyBehavior>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => {
                                    setSelectedPage(item.id);
                                    setLoading(true);
                                }}
                                selected={selectedPage === item.id}>
                                <ListItemIcon>
                                    {item.icon}
                                </ListItemIcon>
                                {isMdUp && open && <ListItemText primary={item.text} />}
                            </ListItemButton>
                        </ListItem>
                    </Link>
                ))}
            </List>
        </div>
    );

    return (
        <ThemeProvider theme={themeInstance}>
            <CssBaseline />
            <Box sx={{ display: 'flex' }}>
                {/*{loading && <LinearProgress color="success" />}*/}
                <AppBar
                    position="fixed"
                    sx={{
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                        top: hideAppBar ? '-64px' : (loading ? '4px' : '0px'),
                        transition: 'top 0.3s'
                }}
                    // sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, top: hideAppBar ? '-64px' : '0px', transition: 'top 0.3s' }}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={toggleDrawer}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                            <Avatar
                                alt="App Logo"
                                src="/app-logo.svg"
                                sx={{ width: 24, height: 24, mr: 1 }}
                            />
                            Investify
                        </Typography>
                        <IconButton onClick={colorMode.toggleColorMode} color="inherit">
                            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                        </IconButton>
                        <Avatar alt="User Avatar" src="/user-avatar.png" sx={{ ml: 2 }} />
                    </Toolbar>
                </AppBar>
                <Box component="nav" sx={{ width: { md: open ? drawerWidth : 'auto' }, flexShrink: { md: 0 } }}>
                    <Drawer
                        variant={isMdUp ? 'persistent' : 'temporary'}
                        open={open}
                        onClose={toggleDrawer}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                        sx={{
                            '& .MuiDrawer-paper': {
                                boxSizing: 'border-box',
                                width: drawerWidth,
                            },
                        }}
                    >
                        {drawer}
                    </Drawer>
                </Box>
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Toolbar />
                    {children}
                    <Box component="footer" sx={{ mt: 5, textAlign: 'center', width: '100%' }}>
                        <Typography variant="body2" color="text.secondary">
                            Copyright © {new Date().getFullYear()} Investify. All rights reserved.
                        </Typography>
                        {loading && <LinearProgress color="success" />}
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    );
}
