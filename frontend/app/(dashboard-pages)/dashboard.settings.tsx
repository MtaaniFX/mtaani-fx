import DashboardIcon from "@mui/icons-material/Dashboard";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import {JSX} from "react";
import { Person, Person2 } from "@mui/icons-material";
import Portfolio from "./dashboard/portfolio/page";

type PageProps = {
    text: string,
    icon: JSX.Element  ,
    link: string,
    id: string
};

export const dashboardUrl = '/dashboard';
// export const dashboardTitle = 'Dashboard';
export const pages: PageProps[] = [
    { text: 'Overview', icon: <DashboardIcon />, link: '/', id: 'overview' },
    { text: 'Portfolio', icon: <Person />, link: '/portfolio', id: 'portfolio' },
    { text: 'Transactions', icon: <AccountBalanceWalletIcon />, link: '/transactions', id: 'transactions'},
    { text: 'Deposit', icon: <MonetizationOnIcon />, link: '/deposit', id: 'deposit'},
    { text: 'Referrals', icon: <Person2 />, link: '/referrals', id: 'referrals'}
];

export const linkIdMap = function () {
    function trimEndingSlash(str: string) {
        str = str.replace(/\/+$/, '');
        if (str === "") {
            return "/";
        }
        return str;
    }
    const map = new Map<string, string>();
    for (let i = 0; i < pages.length; i++) {
        pages[i].link = trimEndingSlash(`${dashboardUrl}${pages[i].link}`);
        map.set(pages[i].link, pages[i].id);
    }
    return map;
}();
