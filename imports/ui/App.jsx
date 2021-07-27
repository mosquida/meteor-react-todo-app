import React from 'react';
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

  // THIS WILL DOES NO WORK!!!, IF IT HAS BRACES
  // const tasks = useTracker( () => {
  //   TasksCollection.find({}).fetch()
  // });

  const tasks = useTracker( () => 
    TasksCollection
      .find({},  { sort: { createdAt: -1 } })
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

  return (
    <div>
      <h1>Meteor Tasks</h1>
      <h3>POWERED BY METEOR X REACT</h3>
      {/* <Hello/> */}

      <TaskForm />

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
