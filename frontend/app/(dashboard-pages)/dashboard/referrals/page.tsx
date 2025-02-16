'use client';

import { useState } from 'react';
import { TextField, Button, Alert, CircularProgress } from '@mui/material';

const ReferralComponent = () => {
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleReferralSubmit = async () => {
    setError(null);
    setSuccess(false);
    if (!referralCode) {
      setError('Please enter a referral code');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/apply-referral`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referralCode }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to apply referral code');
      }
      setSuccess(true);
      setReferralCode('');
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Enter valid referal code to get bonus</h2>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">Referral code applied successfully!</Alert>}
      <TextField
        label="enter valid referal code"
        fullWidth
        margin="normal"
        value={referralCode}
        onChange={(e) => setReferralCode(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleReferralSubmit}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Apply Code'}
      </Button>
    </div>
  );
};

export default ReferralComponent;
