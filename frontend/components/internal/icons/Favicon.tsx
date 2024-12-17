import SvgIcon from '@mui/material/SvgIcon';
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {Melete} from "./fonts/Melete";
import {useTheme} from "@mui/material/styles";

function FaviconBase({fill}: {fill?: string}) {
    return (
        <SvgIcon sx={{height: 21, width: 21}}>
            <svg
                width={127}
                height={127}
                viewBox="0 0 127 127"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M127 111.944c0 3.537-2.05 4.39-4.535 1.886L88.083
                    79.445a17.96 17.96 0 01-4.535-11.002V6.44A6.467 6.467
                    0 0189.988 0h30.527a6.467 6.467 0 016.449 6.44L127
                    111.944zM13.178 4.554C10.675 2.05 11.518.017 15.064.017h49.837a6.457
                    6.457 0 016.44 6.44v49.886c0 3.546-2.05 4.39-4.535 1.886L13.178
                    4.553zm100.671 117.911c2.503 2.503 1.66 4.535-1.886
                    4.535H62.126a6.46 6.46 0 01-6.44-6.44V70.674c0-3.537 2.05-4.39
                    4.535-1.886l53.628 53.677zM.036 15.084c0-3.547 2.04-4.39 4.535-1.887l34.383
                    34.385a17.914 17.914 0 014.534 10.993v61.985a6.46 6.46 0 01-6.44
                    6.44H6.44A6.448 6.448 0 010 120.56L.036 15.084z"
                    fill={fill}
                />
            </svg>
        </SvgIcon>
    );
}

export default function Favicon() {
    const theme = useTheme();
    return <FaviconBase fill={theme.palette.primary.main}/>
}

export function FaviconRow() {
    const theme = useTheme();
    return (
        <Stack direction="row"
               spacing={0.08}
               sx={{
                   justifyContent: "center",
                   alignItems: "center",
               }}>
            <FaviconBase fill={theme.palette.primary.main}/>
            <Typography
                sx={{
                    fontFamily: Melete.style.fontFamily,
                    fontSize: '21px',
                    color: theme.palette.primary.main,
                    letterSpacing: "0",
                    mr: 3,
                }}
            >MTAANI</Typography>
        </Stack>
    )
}

export function FaviconRowTextColor() {
    // const theme = useTheme();
    return (
        <Stack direction="row"
               spacing={0.08}
               sx={{
                   justifyContent: "center",
                   alignItems: "center",
               }}>
            <FaviconBase fill='white'/>
            <Typography
                sx={{
                    fontFamily: Melete.style.fontFamily,
                    fontSize: '21px',
                    color: "white",
                    letterSpacing: "0",
                    mr: 3,
                }}
            >MTAANI</Typography>
        </Stack>
    )
}

export function FaviconCol() {
    const theme = useTheme();
    return (
        <Stack spacing={0.08}
               sx={{
                   justifyContent: "center",
                   alignItems: "left",
               }}>
            <FaviconBase fill={theme.palette.primary.main}/>
            {/*<Typography*/}
            {/*    sx={{*/}
            {/*        fontFamily: Melete.style.fontFamily,*/}
            {/*        fontSize: '21px',*/}
            {/*        color: theme.palette.primary.main,*/}
            {/*        letterSpacing: "0",*/}
            {/*        mr: 3,*/}
            {/*    }}*/}
            {/*>MTAANI</Typography>*/}
            <Typography
                sx={{
                    fontFamily: Melete.style.fontFamily,
                    fontSize: '21px',
                    color: theme.palette.primary.main,
                    letterSpacing: "0",
                    mr: 3,
                }}
            >FX</Typography>
        </Stack>
    )
}
