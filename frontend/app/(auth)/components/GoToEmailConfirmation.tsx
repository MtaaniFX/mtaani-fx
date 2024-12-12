import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Image from "next/image";
import Button from "@mui/material/Button";

function GoToEmailConfirmation() {
    return (
        <Container>
            <Grid container spacing={2}>
                <Grid size={{xs: 12, md: 6}}>
                    <div className={"flex items-center p-8 h-full w-full"}>
                        <div>
                            <Typography variant="h4">
                                Check your email
                            </Typography>
                            <br/>
                            <Typography>
                                Hey! check your inbox, we've sent you an email with the next steps.
                            </Typography>
                            <Typography sx={{mt: "0.3rem"}}>
                                Didn't receive an email? Check your Spam box.
                            </Typography>
                            <Typography sx={{mt: "0.3rem"}}>
                                Problems? &nbsp;
                                <Link href={'mailto:mtaanifx@gmail.com'}>Contact us</Link>
                            </Typography>
                            <br/>
                            <Button variant="contained" href="/">
                                Go to Homepage
                            </Button>
                        </div>
                    </div>
                </Grid>
                <Grid size={{xs: 12, md: 6}}>
                <Image
                        src={"/res/pages/general/check-email.svg"}
                        alt="Check email"
                        height={500}
                        width={500}
                        priority
                    />
                </Grid>
            </Grid>
        </Container>
    )
}

export default GoToEmailConfirmation;
