// See: https://codesandbox.io/p/sandbox/material-ui-gradient-text-q93hd2?file=%2Fsrc%2FApp.js%3A1%2C1-44%2C1
import Typography from "@mui/material/Typography";
import {ReactNode} from "react";

interface Props {
    startColor: string, //first color
    endColor: string, //second color
    direction: string, //top, bottom, left, right, degrees
    variant: string, //body1, body2, 'body1', 'body2', etc. see //https://mui.com/material-ui/react-typography/
    textAlign: string, //left, center, right
    className: string,
}

function TextGradient({options, children}: {options: Props, children: ReactNode}) {
    return (
        <Typography
            // variant=options.variant textAlign=options.textAlign className=options.className
            sx={{
                backgroundImage: `linear-gradient( to ${options.direction}, ${options.startColor}, ${options.endColor})`,
                backgroundSize: "100%",
                backgroundRepeat: "repeat",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
            }}
        >
            {children}
        </Typography>
    );
}

export default TextGradient;

//Making gradient text in Material UI can be annoying and
//when using them a lot can require a lot of boilerplate code
//This reusable component is meant to make gradient text easier to implement in Material UI
//https://mui.com/material-ui/react-typography/
