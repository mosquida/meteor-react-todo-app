import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { Hello } from './Hello.jsx';
import { Task } from './Task.jsx';
import { TasksCollection } from '/imports/db/TasksCollection';
import { useTracker } from 'meteor/react-meteor-data';
import { TaskForm } from './TaskForm';
import { LoginForm } from './LoginForm';

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

  // Fetch user info from login
  const user = useTracker( () => Meteor.user());

  const userFilter = user ? {userId: user._id} : {}

  // Unfinish tasks
  // $ne = not equal
  const hideCompletedFilter = { isChecked : { $ne: true} }

  // userfilter + hideCompletedFilter = pending tasks owned by user
  const pendingTaskWithOwner = {...userFilter, ...hideCompletedFilter}
  
  const tasks = useTracker( () => {
    if (!user) {
      return [];
    }

    // return owners pending task (hide=true)
    // return owners all task (hide=false)
    return TasksCollection
      .find( hideState ? pendingTaskWithOwner: userFilter,
       { sort: { createdAt: -1 } })
      .fetch();
  });

  const toggleCheckbox= ({ _id, isChecked }) => {
    Meteor.call('task.setIsChecked', _id, !isChecked);
  }

  const deleteTask = ({ _id }) => {
    Meteor.call('tasks.remove', _id);
  }

  const pendingTaskCount = useTracker( () => {
    if (!user) {
      return 0;
    }
    // find uncompleted tasks by owner
    return TasksCollection.find(pendingTaskWithOwner).count();
  })
  
  const pendingTaskNumber = `${
    pendingTaskCount ? `(${pendingTaskCount})` : '(0)'
  }`

  

  return (
    <>
      
      {/* <Hello/> */} 

      <div className="flex-between">
        <div>
          <h1>Meteor Tasks {pendingTaskNumber} </h1>
          <h3>POWERED BY METEOR X REACT</h3>
        </div>

        <div className="flex-between">
          <h2 className="flex-center">@{user ? user.username : ''}</h2>
          <a className="flex-center" onClick={() => Meteor.logout()}>
            <svg className="w-4 " data-darkreader-inline-fill="" fill="currentColor" style={{"--darkreader-inline-fill":"currentColor"}} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd"></path></svg>
          </a>
        </div>
      </div>
      
      { user ? (
         <>
          {/* We need _id (owner ref) when inserting new task */}
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
                onDeleteClick={deleteTask} />
            )}
          </ul> 
        </>
        ) : (<LoginForm />) 
      }
     
    </>
  )
}