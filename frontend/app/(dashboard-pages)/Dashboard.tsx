import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  LinearProgress,
} from '@mui/material';

export const Dashboard = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Investment
              </Typography>
              <Typography variant="h5">KES 150,000</Typography>
              <LinearProgress
                variant="determinate"
                value={75}
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Returns
              </Typography>
              <Typography variant="h5">KES 15,000</Typography>
              <LinearProgress
                variant="determinate"
                value={45}
                sx={{ mt: 2 }}
                color="success"
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Investments
              </Typography>
              <Typography variant="h5">3</Typography>
              <LinearProgress
                variant="determinate"
                value={60}
                sx={{ mt: 2 }}
                color="secondary"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};