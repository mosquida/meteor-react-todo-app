import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { TasksCollection } from '/imports/api/TasksCollection';
import { Hello } from './Hello.jsx';
import { Task } from './Task.jsx';



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

  const tasks = useTracker( () => TasksCollection.find({}).fetch());

  return (
    <div>
      <h1>Welcome to Meteor Task!</h1>
      <Hello/>
      <hr />

      <ul>
        { tasks.map( task => <Task key={task._id} task={task}/>) }
      </ul> 
    
    </div>
  )
};
