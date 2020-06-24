import React, { useEffect, useReducer, useState } from 'react';

import logo from './logo.svg';
import './App.css';
import jdata from './coursedlist.json';
//material ui
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
// compunent
import ViewRouteing from './compunent/viewRouting';
import CustomizedTables from './compunent/mitable';
import MultipleSelect from './compunent/multiselectInput';
import ComboBox from './compunent/autoComplect';
// logic
import Generator from './logic/useGenerator';

function reducer(state, action) {
  switch (action.type) {
    case 'initCourses':
      {
        return { ...state, courseData: action.payload }
      }
    case 'initCourseList': {
      return { ...state, courseList: action.payload }
    }

    default: {

      return state;
    }
  }
}





function App() {

  const [dstate, dispatch] = useReducer(reducer, {});

  const [idata, setIdata] = useState({ 'fk': { 'coursecode': 'CSE 301', 'section': ['all'] } });
  const [listofClassRoutting, setlistofClassRoutting] = useState([]);
  const classSchedule = { 'S': [], 'M': [], 'T': [], 'W': [], 'R': [] }
  const handelChange = (id, name, value) => {

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
    if (Object.keys(idata).length > 3) {
      return;
    }
    setIdata({
      ...idata, [Date.now()]: {
        'coursecode': '',
        'section': ['all']
      }
    })
  }
  const removeInputField = (key) => {
    const temp = { ...idata }
    delete temp[key];
    setIdata({ ...temp });
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
  const doPreOprationWork = () => {
    let counter = 0;
    let keys = Object.keys(idata);
    for (const key of keys) {
      let validlist = dstate.courseList.filter((val, i) => val.title === idata[key].coursecode);
      if (validlist.length === 1) { counter += 1; }

    }
    return counter === keys.length;
  }
  const doOparation = () => {
    if (!doPreOprationWork()) {
      return;
    }
    setlistofClassRoutting([]);
    Generator(idata, 0, classSchedule, dstate, handleAddlistofRouting);
  }
  const showData = () => {
    //return a list of schedule in below formate
    /*
    [
      //scheule one 
      {

        'CSE 225':{
          coursecode:'CSE 225',
          section:2,
          schedule:[
            'M 10:10AM-11:40AM',
            'W 10:10AM-11:40AM',
            'R 4:50PM-6:40PM',
          ]
        },
        'CSE 301':{
          .
          .
          .
        },
      },
      //schedule two
      {
        .
        .
        .
      }
    ]
    */
    const gdata = []
    for (let index = 0; index < listofClassRoutting.length; index++) {
      const clsScheduleObj = listofClassRoutting[index];
      const listofweekdays = Object.keys(clsScheduleObj);
      let m = {}
      for (const iterator of listofweekdays) {
        ///iterator -> sunday, monday, thuesday ...
        for (const clsDetailsObj of clsScheduleObj[iterator]) {
          //M:[{classroutingOBJ},.....]
          //S:[{classroutingOBJ},.....]
          // let v={'coursecode':,'section':'','days':[{'day':'','time':''}]}
          if (m[clsDetailsObj.coursecode]) {
            m = {
              ...m, [clsDetailsObj.coursecode]: {
                coursecode: clsDetailsObj.coursecode,
                section: clsDetailsObj.section,
                schedule: [...m[clsDetailsObj.coursecode].schedule, `${iterator} ${clsDetailsObj.time}`]
              }
            }
          } else {
            m = {
              ...m, [clsDetailsObj.coursecode]: {
                coursecode: clsDetailsObj.coursecode,
                section: clsDetailsObj.section,
                schedule: [`${iterator} ${clsDetailsObj.time}`]
              }
            }
          }



        }
      }
      gdata.push(m);


    }
    return gdata;
  }

  useEffect(() => {
    dispatch({ type: 'initCourses', payload: jdata });
    const clist = []
    Object.keys(jdata).map((course, i) => {
      Object.keys(jdata[course]).map((code, j) => {
        clist.push({ title: `${course} ${code}` });
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
              <ComboBox sid={key} sname="coursecode" handelChange={handelChange} clist={dstate.courseList} />
              {/* <TextField id={key} name="coursecode" onChange={(event)=>handelChange(key,'coursecode',event.target.value)} value={idata[key].coursecode} label="Course Code" variant="outlined" /> */}
              {/* <input id= name="coursecode" onChange={handelChange} value={idata[key].coursecode} placeholder="cse 225" /> */}
              <MultipleSelect sid={key} sname="section" handelChange={handelChange} soptions={renderOption} />
              {/* <select id={key} name="section" onChange={handelChange}  >
              <option value={"all"}>all</option>
              {renderOption(key)}
            </select> */}
              <IconButton aria-label="delete" onClick={() => { removeInputField(key) }}>
                <DeleteIcon />
              </IconButton>
              {/* <button onClick={() => { }}>remove</button> */}

            </div>
          );
        })}
      </div>

      {/* <button onClick={() => {addMoreInputfields()  }}>add more fields</button> */}
      {/* if inputfield has  more then  4 input*/}
      {Object.keys(idata).length > 3 ? null :
        <Button variant="outlined" onClick={() => { addMoreInputfields() }}>add more fields</Button>
      }
      <br></br>
      <br></br>
      <Button variant="contained" size="large" color="primary" onClick={() => {
        doOparation();
      }}>
        Generate
      </Button>
      
      <Container maxWidth="lg">
        {showData().map((value, i) => {

          return <div className="schedule-table" key={Date.now().toString() + i.toString()}><CustomizedTables key={i} data={value} /></div>;

        })}
      </Container>
      <footer>
        <div>
          <pre>
          <a href="https://tumzied.pythonanywhere.com/" style={{color:'black'}}>tz</a> © 2020
          </pre>
        </div>
      </footer>

    </div>
  );
}

export default App;

