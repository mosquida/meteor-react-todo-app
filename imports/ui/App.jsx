import React, { useState } from 'react';
import { Hello } from './Hello.jsx';
import { Task } from './Task.jsx';
import { useTracker } from 'meteor/react-meteor-data';
import { TasksCollection } from '/imports/api/TasksCollection';
import { TaskForm } from './TaskForm';

// const tasks = [
//   {_id: 1, text: 'Task 1'},
//   {_id: 2, text: 'Task 2'},
//   {_id: 3, text: 'Task 3'},
// ];

export const App = () => {

  const [hideState, setHideState] = useState(false);

  // THIS WILL DOES NO WORK!!!, IF IT HAS BRACES
  // const tasks = useTracker( () => {
  //   TasksCollection.find({}).fetch()
  // });

  // $ne = not equal
  const hideCompletedFilter = { isChecked : { $ne: true} }

  // fetch task with filter when only only need uncompleted task 
  const tasks = useTracker( () => 
    TasksCollection
      .find( hideState ? hideCompletedFilter : {}, { sort: { createdAt: -1 } })
      .fetch()
    );

  const toggleCheckbox= ({ _id, isChecked }) => {
    TasksCollection.update( _id, {
      $set: {
        isChecked: !isChecked
      }
    })
  }

  const deleteTask = ({ _id }) => {
    TasksCollection.remove(_id)
  }

  const pendingTaskCount = useTracker( () => {
    // find uncompleted tasks 
    return TasksCollection.find(hideCompletedFilter).count();
  })
  
  const pendingTaskNumber = `${
    pendingTaskCount ? `(${pendingTaskCount})` : '(0)'
  }`;

  return (
    <div>
      <h1>Meteor Tasks {pendingTaskNumber} 
        <span> </span>
      </h1>
      <h3>POWERED BY METEOR X REACT</h3>
      {/* <Hello/> */}

      <TaskForm />

      <div className="filter-group">
        <button onClick={ () => setHideState(!hideState) } className="button">
          { hideState ?  'Show All' : 'Hide Completed' }
        </button>
      </div>

      <ul>
        { tasks.map( task => 
          <Task 
            key={task._id}
            task={task} 
            onCheckboxClick={toggleCheckbox} 
            onDeleteClick={deleteTask}/>
        )}
      </ul> 
    
    </div>
  )
};
