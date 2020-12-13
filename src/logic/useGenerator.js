import { logDOM } from "@testing-library/react";

function strptime(string) {
    // convart string to datetime object 
    // string formate shoule be "h:mAM/PM"
    const postindex = string.search(new RegExp('AM|PM'));// search fo am or pm in the string 
    const time = string.slice(0, postindex);
    const post = string.slice(postindex, string.length);
  
    let [h, m] = time.split(':');

    //if h=="1" or "2"...."9" then make it "01" or "02"...."09"
    if(parseInt(h)<10){
      h=`0${h}`;
    }
    if (post === "AM") {
      return new Date(`1900-01-01T${h}:${m}`);
    }

    // post PM  
    if (parseInt(h) != 12) {
      h = parseInt(h) + 12;
    }
    return new Date(`1900-01-01T${h.toString()}:${m}`);
  
  }
  function covStrToDatetime(time) {
    //[params expample]  ('10:10AM-11:40AM')
    const [t1, t2] = time.split('-');
    return [strptime(t1), strptime(t2)];
  }

function isValidSchedule(day, times, classSchedule) {
    //[params expample]  ('S', '10:10AM-11:40AM', OBJECT)
    // console.log(day);
  
    // console.log(classSchedule);
    // console.log(classSchedule[day].length);
  
    if (classSchedule[day].length === 0) {
      return true;
    }
    if (day == null || times == null) {
  
      return false;
    }
    let isvalid=false;
    let counter = 0;
    for(const time of times){
      
      const [newStartTime, newFinishTime] = covStrToDatetime(time);
      for (const iterator of classSchedule[day]) {
        const [clsStartTime, clsFinishTime] = covStrToDatetime(iterator['time']);
        // if the new starting time less then current starting time  and new finis time is less then current starting time 
        if ((newFinishTime < clsStartTime) || (newStartTime > clsFinishTime )) {
          counter++;
        }
      }
    }
    if(counter==classSchedule[day].length*times.length)
      isvalid=true;

    return isvalid;
  }



export default function Generator( inputs, idx, classSchedule, dstate, handleAddlistofRouting,handelFinishGenerating){
    const values = Object.values(inputs);
  // console.log(values);
  // console.log(idx);


  if (idx == values.length)
    return;
  // console.log(values);
  const [course, code] = values[idx].coursecode.split(' ') //CSE 225=> ['CSE' , '225']
  const listOFsection = values[idx].section.indexOf('all') !== -1 ? Object.keys(dstate.courseData[course][code]) : [...values[idx].section];
  // for eache section in this  course 
  for (let index = 0; index < listOFsection.length; index++) {
    let validSection = 0;
    const classSchedulecpy = JSON.parse(JSON.stringify(classSchedule));
    //  classSchedulecpy =  JSON.parse(classSchedulecpy);
    const listOFschedule = Object.keys(dstate.courseData[course][code][listOFsection[index]]);//return list of days that a particular sectoin have a class on

    for (let schduleIdx = 0; schduleIdx < listOFschedule.length; schduleIdx++) {
      // #for every schedule in a section we chack its valid or not
      // # if its not valid then new loop next section in this course 

      //[argument expample]  (S, [10:10AM-11:40AM,], classSchduelOBJ)
      // console.log( dstate.courseData[course][code][listOFsection[index]][listOFschedule[schduleIdx]]);
      if (isValidSchedule(listOFschedule[schduleIdx], dstate.courseData[course][code][listOFsection[index]][listOFschedule[schduleIdx]], classSchedulecpy)) {
        validSection += 1;
        for(const time of dstate.courseData[course][code][listOFsection[index]][listOFschedule[schduleIdx]]){
          classSchedulecpy[listOFschedule[schduleIdx]].push({
            'coursecode': `${course} ${code}`,
            'section': listOFsection[index],
            'time': time,
            'room': 'none'
          });
        }
       
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
  if(idx==0){
    handelFinishGenerating();
  }
  
}