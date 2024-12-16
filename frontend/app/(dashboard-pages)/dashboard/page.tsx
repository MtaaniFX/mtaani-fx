import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export default function Overview() {
    return (
        <Box>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                <Link underline="hover" color="inherit" href="/frontend/public">
                    Home
                </Link>
                <Typography color="text.primary">Overview</Typography>
            </Breadcrumbs>
            <Typography variant="h4" gutterBottom>
                Dashboard Overview
            </Typography>
            <Typography variant="body1">
                Welcome to your investment dashboard. Here you can get a quick overview of your portfolio.
            </Typography>
        </Box>
    );
}