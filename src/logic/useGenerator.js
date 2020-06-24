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
    // console.log(day);
  
    // console.log(classSchedule);
  
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



export default function Generator( inputs, idx, classSchedule, dstate, handleAddlistofRouting){
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