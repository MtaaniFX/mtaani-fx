'use client';

import { useState } from 'react';
import { TextField, Button, CircularProgress, Alert, MenuItem } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import { createClient } from '@supabase/supabase-js';
import {number} from "yup";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function isValidNumber(number: string): boolean{
  // if the number does not start with a 254 code for KENYA
  if(!number.startsWith('254')) return false;
  // check if the remaining part contains only 9 digits
  const sliced = number.slice(3);
  console.log(sliced)// remove the 254 from the number and check if the other numbers are 9  in total
  return !(number.length !== 12 || !/^\d{9}$/.test(sliced));
}

const predefinedAmounts = ['10000', '15000', '20000', '30000' , '35000' , '50000', '100000'];

const DepositForm = () => {
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [withdrawalInfo, setWithdrawalInfo] = useState('')

  const calculateWithdrawalDate = () => {
    const depositDate = new Date();
    let withdrawalDate = new Date(depositDate);
    withdrawalDate.setDate(depositDate.getDate() + 30);
    return withdrawalDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };

  const handleDeposit = async () => {
    setError(null);
    setSuccess(false);
    setDialogOpen(false);
    setWithdrawalInfo('');

    if((phone.trim() === "")){
      setError("provide your phone number");
      return
    }
    if (!isValidNumber(phone)){
      setError("phone number must be in this format 254xxxxxxxxx");
      return
    }
    if (!amount ) {
      setError('amount required');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseInt(amount, 10),
          phone,
        }),
      });

      if (!response.ok) {
        throw new Error('Deposit failed');
      }
      setSuccess(true);
      setAmount('10000');
      setPhone('');
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
      <div>
        <h2>deposit</h2>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">Deposit successful!</Alert>}
        <TextField
            select
            label="Amount"
            type="number"
            fullWidth
            margin="normal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
        >
          {/* call backend to generate this */}
          {predefinedAmounts.map((amt) => (
              <MenuItem key={amt} value={amt}>
                {amt}
              </MenuItem>
          ))}
        </TextField>
        <TextField
            label="Phone Number"
            type="text"
            fullWidth
            margin="normal"
            color='primary'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
        />
        <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleDeposit}
            disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Deposit'}
        </Button>
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>deposit success</DialogTitle>
          <DialogContent>
            your deposit of kes {amount} has been received 
            <br />
            {withdrawalInfo && <strong>{withdrawalInfo}</strong>}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">OK</Button>
          </DialogActions>
        </Dialog>
      </div>
  );
};

export default DepositForm;
