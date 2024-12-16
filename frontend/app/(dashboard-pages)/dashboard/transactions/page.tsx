import {Box, Breadcrumbs, LinearProgress, Link, Typography} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export default function Transactions() {
    return (
        <Box sx={{ height: '115vh' }}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                <Link underline="hover" color="inherit" href="/frontend/public">
                    Home
                </Link>
                <Typography color="text.primary">Transactions</Typography>
            </Breadcrumbs>
            <Typography variant="h4" gutterBottom>
                Transactions
            </Typography>
            <Typography variant="body1">
                This is your transactions page.
            </Typography>
        </Box>
    );
}
