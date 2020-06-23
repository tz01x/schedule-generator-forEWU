import React, { useEffect, useReducer, useState } from 'react';

import logo from './logo.svg';
import './App.css';
import jdata from './coursedlist.json';
import ViewRouteing from './viewRouting';
import Container from '@material-ui/core/Container';
import CustomizedTables from './mitable';
import MultipleSelect from './multiselectInput';
import ComboBox from './autoComplect';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
function reducer(state, action) {
  switch (action.type) {
    case 'initCourses':
      {
        return { ...state, courseData: action.payload }
      }
    case 'initCourseList':{
      return {...state,courseList:action.payload}
    }

    default: {

      return state;
    }
  }
}
function strptime(string) {
  // convart string to datetime object 
  // string formate shoule be "h:mAM/PM"
  const postindex = string.search(new RegExp('AM|PM'));// search fo am or pm in the string 
  const time = string.slice(0, postindex);
  const post = string.slice(postindex, string.length);

  if (post == "AM") {
    return new Date(`1900-01-01T${time}Z`);
  }
  let [h, m] = time.split(':');
  if (parseInt(h) != 12) {
    h = parseInt(h) + 12;
  }
  return new Date(`1900-01-01T${h.toString()}:${m}Z`);

}
function covStrToDatetime(time) {
  //[params expample]  ('10:10AM-11:40AM')
  const [t1, t2] = time.split('-');
  return [strptime(t1), strptime(t2)];
}
function isValidSchedule(day, time, classSchedule) {
  //[params expample]  ('S', '10:10AM-11:40AM', OBJECT)
  console.log(day);

  console.log(classSchedule);

  if (classSchedule[day].length === 0) {
    return true;
  }
  if (day == null || time == null) {

    return false;
  }
  const [newStartTime, newFinishTime] = covStrToDatetime(time);
  let counter = 0;
  for (const iterator of classSchedule[day]) {
    const [clsStartTime, clsFinishTime] = covStrToDatetime(iterator['time']);
    if ((newStartTime < clsStartTime && newFinishTime < clsFinishTime) || (newStartTime > clsStartTime && clsFinishTime < newStartTime)) {
      counter += 1;
    }
  }
  if (counter == classSchedule[day].length) {
    return true;
  }

  return false;
}

function Generator(inputs, idx, classSchedule, dstate, handleAddlistofRouting) {

  const values = Object.values(inputs);
  // console.log(values);
  // console.log(idx);


  if (idx == values.length)
    return;
  // console.log(values);
  const [course, code] = values[idx].coursecode.split(' ') //CSE 225=> ['CSE' , '225']
  const listOFsection = values[idx].section[0] == 'all' ? Object.keys(dstate.courseData[course][code]) : [...values[idx].section];
  // for eache section in this  course 
  for (let index = 0; index < listOFsection.length; index++) {
    let validSection = 0;
    const classSchedulecpy = JSON.parse(JSON.stringify(classSchedule));
    //  classSchedulecpy =  JSON.parse(classSchedulecpy);
    const listOFschedule = Object.keys(dstate.courseData[course][code][listOFsection[index]]);//return list of days that a particular sectoin have a class on

    for (let schduleIdx = 0; schduleIdx < listOFschedule.length; schduleIdx++) {
      // #for every schedule in a section we chack its valid or not
      // # if its not valid then new loop next section in this course 

      //[argument expample]  (S, 10:10AM-11:40AM, classSchduelOBJ)
      if (isValidSchedule(listOFschedule[schduleIdx], dstate.courseData[course][code][listOFsection[index]][listOFschedule[schduleIdx]], classSchedulecpy)) {
        validSection += 1;

        classSchedulecpy[listOFschedule[schduleIdx]].push({
          'coursecode': `${course} ${code}`,
          'section': listOFsection[index],
          'time': dstate.courseData[course][code][listOFsection[index]][listOFschedule[schduleIdx]],
          'room': 'none'
        });
      } else {
        break;
      }

    }
    if (listOFschedule.length == validSection) {

      if (idx == values.length - 1) {
        // console.log('[dubug]');

        // console.log(classSchedulecpy);
        handleAddlistofRouting(classSchedulecpy)

      } else {
        Generator(inputs, idx + 1, { ...classSchedulecpy }, dstate, handleAddlistofRouting);
      }
    }

  }


}

function App() {

  const [dstate, dispatch] = useReducer(reducer, {});

  const [idata, setIdata] = useState({ 'fk': { 'coursecode': 'CSE 301', 'section': ['all'] } });
  const [listofClassRoutting, setlistofClassRoutting] = useState([]);
  const classSchedule = { 'S': [], 'M': [], 'T': [], 'W': [], 'R': [] }
  const handelChange = (id,name,value) => {

    // console.log(event.target.id);
    // console.log(event.target.name);
    // console.log(event.target.value);

    // handel change a value of a particular id 
    if (name == 'section') {
      // console.log(idata[event.target.id][event.target.name]);
      // let tempsection = [];
      // if (idata[id][name] === undefined) {

      //   tempsection.push(value);
      // } else {

      //   tempsection = [...idata[id][name]];
      // }

      setIdata({ ...idata, [id]: { ...idata[id], [name]: [...value] } });
      return;
    }
    setIdata({ ...idata, [id]: { ...idata[id], [name]: value.toString().toUpperCase() } })

  }
  const addMoreInputfields = () => {
    if(Object.keys(idata).length>3){
      return;
    }
    setIdata({
      ...idata, [Date.now()]: {
        'coursecode': '',
        'section': ['all']
      }
    })
  }
  const removeInputField=(key)=>{
    const temp={...idata}
    delete temp[key];
    setIdata({...temp});
  }
  const handleAddlistofRouting = (obj) => {
    // console.log(obj);

    // const newlist = [...listofClassRoutting];
    // newlist.push(obj);
    setlistofClassRoutting((s) => [...s, obj]);
  }
  function renderOption(id) {
    try {
      const [couse, code] = idata[id].coursecode.split(' ')

      let sections = dstate.courseData[couse][code];
      return Object.keys(sections);
      // .map((section, idx) => {


      //   return <option key={idx} value={section}>{section}</option>;
      // });

      // for (let index = 0; index < sections.length; index++) {
      //   const element = array[index];

      // }

    } catch (error) {
      return []
    }
  }
  const doPreOprationWork=()=>{
    let counter=0;
    let keys=Object.keys(idata);
    for (const key of keys) {
     let validlist= dstate.courseList.filter((val,i)=>val.title===idata[key].coursecode);
      if (validlist.length===1)
      {counter+=1;}
      
    }
    return counter===keys.length;
  }
  const doOparation=()=>{
    if(!doPreOprationWork()){
      return;
    }
    setlistofClassRoutting([]);
    Generator(idata, 0, classSchedule, dstate, handleAddlistofRouting);
  }
  const showData=()=>{
    // const tableDataSingleClassSchedule=[{'coursecode':'','section':'','days':[{'day':'','time':''}]}]
    const gdata=[]
    for (let index = 0; index < listofClassRoutting.length; index++) {
      const clsScheduleObj=listofClassRoutting[index];
      const listofweekdays= Object.keys(clsScheduleObj);
      let m={}
      for (const iterator of listofweekdays) {
        ///iterator -> sunday, monday, thuesday ...
        for (const clsDetailsObj of clsScheduleObj[iterator]){
          //M:[{classroutingOBJ},.....]
          //S:[{classroutingOBJ},.....]
          // let v={'coursecode':,'section':'','days':[{'day':'','time':''}]}
          if(m[clsDetailsObj.coursecode]){
            m={...m,[clsDetailsObj.coursecode]:{
              coursecode:clsDetailsObj.coursecode,
              section:clsDetailsObj.section,
              schedule:[...m[clsDetailsObj.coursecode].schedule,`${iterator} ${clsDetailsObj.time}`]
            }}
          }else{
            m={...m,[clsDetailsObj.coursecode]:{
              coursecode:clsDetailsObj.coursecode,
              section:clsDetailsObj.section,
              schedule:[`${iterator} ${clsDetailsObj.time}`]
            }}
          }
          

          
        }
      }
      gdata.push(m);


    }
    return gdata;
  }

  useEffect(() => {
    dispatch({ type: 'initCourses', payload: jdata });
    const clist=[]
    Object.keys(jdata).map((course,i)=>{
      Object.keys(jdata[course]).map((code,j)=>{
          clist.push({title:`${course} ${code}`});
      });
    });
    dispatch({ type: 'initCourseList', payload: clist });


  }, [])


  return (
    <div className="App">
      <h1>Schedule Generator </h1>
      <samp className="subtitle">for EWU</samp>
      <div>
      
     
      </div>
      
    <div className="input-fields">
      {Object.keys(idata).map((key, idx) => {
        return (
          <div key={idx} className="input-field" >
            <ComboBox sid={key} sname="coursecode" handelChange={handelChange} clist={dstate.courseList}/>
            {/* <TextField id={key} name="coursecode" onChange={(event)=>handelChange(key,'coursecode',event.target.value)} value={idata[key].coursecode} label="Course Code" variant="outlined" /> */}
            {/* <input id= name="coursecode" onChange={handelChange} value={idata[key].coursecode} placeholder="cse 225" /> */}
            <MultipleSelect sid={key} sname="section" handelChange={handelChange} soptions={renderOption} />
            {/* <select id={key} name="section" onChange={handelChange}  >
              <option value={"all"}>all</option>
              {renderOption(key)}
            </select> */}
              <IconButton aria-label="delete"  onClick={() => { removeInputField(key)}}>
              <DeleteIcon />
              </IconButton>
            {/* <button onClick={() => { }}>remove</button> */}

          </div>
        );
      })}
      </div>

      {/* <button onClick={() => {addMoreInputfields()  }}>add more fields</button> */}
      {/* if inputfield has  more then  4 input*/}
      {Object.keys(idata).length>3?null:
      <Button variant="outlined" onClick={() => {addMoreInputfields()  }}>add more fields</Button>
      }
      <br></br>
      <br></br>
      {/* <button onClick={() => {
        setlistofClassRoutting([])
        Generator(idata, 0, classSchedule, dstate, handleAddlistofRouting);
      }}></button> */}
      <Button variant="contained" size="large" color="primary"  onClick={() => {
        doOparation();
      }}
       >
      Generate
      </Button>
      {/* <ViewRouteing
       listofClassRoutting={listofClassRoutting}
       ></ViewRouteing> */}
      <Container maxWidth="lg">

        {/* <div className="">
          
          <div>
            <div className="r-title" >
              <div>Course Code</div>
              <div>Section</div>
              <div>Schedule</div>
            </div>

            <div className="r-items">
              <div className="r-c">

                css 225
        </div>
              <div className="r-sec">

                3
        </div>
              <div className="r-times">
                <div className="r-time">
                 <samp className="r-tday">S</samp>  10:10AM-11:40AM
          </div>
          <div className="r-time">

                <samp className="r-tday">S</samp>  10:10AM-11:40AM

          </div>
          <div className="r-time">

                <samp className="r-tday">S</samp>  10:10AM-11:40AM

          </div>

              </div>

            </div>
           
            
          </div>


        </div> */}
        {showData().map((value,i)=>{

          return <div className="schedule-table" key={Date.now().toString()+i.toString()}><CustomizedTables key={i} data={value} /></div>;
          
        })}
        
        {/* <br/>
        
        <CustomizedTables /> */}


      </Container>

    </div>
  );
}

export default App;

