/* eslint-disable no-use-before-define */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

export default function ComboBox(props) {
    const handelChangr=(event,val)=>{
        // console.log(val);
        if(val!=null)
            props.handelChange(props.sid,props.sname,val.title);
        
    }
  return (
    <Autocomplete
      id="combo-box-demo"
      options={props.clist}
      onChange={handelChangr}
      getOptionLabel={(option) => option.title}
      style={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Course code" variant="outlined" />}
    />
  );
}
