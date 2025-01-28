import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export default function Portfolio() {
    return (
        <Box>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                <Link underline="hover" color="inherit" href="/frontend/public">
                    Home
                </Link>
                <Typography color="text.primary">Portfolio</Typography>
            </Breadcrumbs>
            <Typography variant="h4" gutterBottom>
                Portfolio
            </Typography>
            <Typography variant="body1">
                This is your portfolio page.
            </Typography>
        </Box>
    );
}
