import {useTheme} from "@mui/material/styles";
import {ReactNode} from "react";

export default function PageBackground({children}: {children?: ReactNode}) {
    const theme = useTheme();
    return (
        <div className="w-full h-full"
             style={{backgroundColor: theme.palette.background.default}}>
            {children}
        </div>
    );
}
