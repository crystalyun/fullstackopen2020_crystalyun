import React from 'react';
import Course from './components/Course'

const App = ({course}) => {
   return (
     <div>
       <h1>Web development curriculum</h1>
       {course.map(oneCourse => 
          <Course key={oneCourse.id} course={oneCourse} />
       )}
     </div>
   )
}

export default App