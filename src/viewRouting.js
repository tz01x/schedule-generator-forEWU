import React from 'react';
import Container from '@material-ui/core/Container';


export default function ViewRouteing(props){
    return(
        <Container maxWidth="lg">
        {props.listofClassRoutting.map((value,i)=>{
          return(
            
            <div className="schedule">
              {Object.keys(value).map((weekday,j)=>{
                return(
                <div className="schedule-item" key={Date.now().toString()+j.toString()}>
                <div className="weekday">{weekday}</div>
                
                <div className="course-details">
                  {value[weekday].map((classDetails,k)=>{
                      return(
                      <div className="course-detail-item" key={Date.now().toString()+k.toString()} > 
                      <div className="course-name">{classDetails.coursecode}</div>
                      <div className="course-section">section : {classDetails.section}</div>
                      <div className="course-time" >{classDetails.time}</div>
                    </div>
                    );
                  })}
                
      
                </div>   
              </div>
                );
              })}
              
      
            </div>
            
          );
        })}

    </Container>
    );
}