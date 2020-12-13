import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function CustomizedSnackbars(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

//   const handleClick = () => {
//     setOpen(true);
//   };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    props.setNotification(false);
    // setOpen(false);
  };
  React.useEffect(()=>{
      return ()=>{
        //   console.log('helo');
        //   console.log(props.notification);
      }
  });

  return (
    <div className={classes.root}>
      <Snackbar open={props.notification} autoHideDuration={6000} onClose={handleClose}>
        {/* <Alert onClose={handleClose} severity="success">
          This is a success message!
        </Alert> */}
      <Alert severity={props.severity} onClose={handleClose}>{props.msg}</Alert>
      </Snackbar>
      {/* <Alert severity="error">This is an error message!</Alert>
      <Alert severity="info">This is an information message!</Alert>
      <Alert severity="success">This is a success message!</Alert> */}
    </div>
  );
}
