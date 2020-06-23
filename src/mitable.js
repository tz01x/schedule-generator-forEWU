import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontWeight:700
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);




const useStyles = makeStyles({
  table: {
    minWidth: 400,
  },
});

export default function CustomizedTables(props) {
  const classes = useStyles();

  return (
    <div>
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Course code</StyledTableCell>
            <StyledTableCell >section</StyledTableCell>
            <StyledTableCell >Schedule</StyledTableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(props.data).map((key,i) => (
            <StyledTableRow key={key+i}>
              <StyledTableCell component="th" scope="row">
                  <div className="r-courseC">

                {props.data[key].coursecode}
                  </div>
              </StyledTableCell>
              <StyledTableCell><div style={{textAlign:"center"}}>{props.data[key].section}</div></StyledTableCell>
              <StyledTableCell>

                <div className="r-times">
                    {props.data[key].schedule.map((sch,i)=>{
                        const [day,time]=sch.split(' ');
                        return(
                            <div className="r-time" key={sch}>
                            <samp className="r-tday">{day}</samp>  {time}
                            </div>
                        );
                    })}

                

                </div>
              </StyledTableCell>
           
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    
    </div>
  );
}
