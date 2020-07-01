/* eslint-disable no-use-before-define */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

export default function ComboBox(props) {

  const [inputValue,setInputValue]=React.useState('');

  let isupdating=true;
    const handelChangr=(event,val)=>{
        // console.log('handel change');
        
        if(val!=null){
          props.handelChange(props.sid,props.sname,val.title);//val is a object {title:'ACT 101'}
          setInputValue(val.title);
          
        }
        
        
    }
    React.useEffect(()=>{
      
      
      // console.log('[DEBUG] '+props.courseCode);
      
      
      // if(isupdating){

        setInputValue(props.courseCode?props.courseCode:'');
      
      // setValue(props.courseCode?props.courseCode:'');
    },[props.courseCode]);
    React.useEffect(()=>{
      return()=>{
        // isupdating=true;
      }
    },[inputValue])

  return (
    <Autocomplete
      id="controllable-states-demo"
      // value={value}
      options={props.clist}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        // console.log('inp');
        
        // isupdating=false;
        setInputValue(newInputValue);
      }}
      onChange={handelChangr}
      getOptionLabel={(option) => option.title}
      style={{ width: 300 }}
      renderInput={(params) => <TextField {...params}  label="Course code" variant="outlined" />}
    />
  );
}
