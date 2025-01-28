import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import {Backdrop} from "@mui/material";
import {paths} from "@/lib/paths";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

type DialogueProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function UnderConstructionDialogue({open, setOpen}: DialogueProps) {
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Backdrop
                sx={(theme) => ({ zIndex: theme.zIndex.drawer + 1 })}
                open={open}
                onClick={handleClose}
            >
                <BootstrapDialog
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={open}
                >
                    <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                        Service Outage
                    </DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={(theme) => ({
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: theme.palette.grey[500],
                        })}
                    >
                        <CloseIcon />
                    </IconButton>
                    <DialogContent dividers>
                        <Typography gutterBottom>
                           Our developers are hard at work, getting third party authentication back.
                            <br/>
                           Use the email-password login option instead.
                        </Typography>
                        <img
                            src={'/res/pages/general/under-construction.svg'}
                            alt="Under construction"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            href={paths.auth.signIn}
                            autoFocus
                        >
                            OK
                        </Button>
                    </DialogActions>
                </BootstrapDialog>
            </Backdrop>
        </React.Fragment>
    );
}
