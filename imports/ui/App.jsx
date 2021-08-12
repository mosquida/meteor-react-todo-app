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

  const toggleCheckbox= ({ _id, isChecked }) => {
    Meteor.call('task.setIsChecked', _id, !isChecked);
  }

  const deleteTask = ({ _id }) => {
    Meteor.call('tasks.remove', _id);
  }

export const App = () => {
  // Fetch user info from login
  const user = useTracker( () => Meteor.user());

  const [hideState, setHideState] = useState(false);

  const userFilter = user ? {userId: user._id} : {}

  // Unfinish tasks
  // $ne = not equal
  const hideCompletedFilter = { isChecked : { $ne: true} }

  // userfilter + hideCompletedFilter = pending tasks owned by user
  const pendingTaskWithOwner = {...userFilter, ...hideCompletedFilter}
  


  const { tasks, pendingTaskCount, isLoading } = useTracker( () => {

    const noDataAvailable = { tasks: [], pendingTaskCount: 0};

    if (!user) return noDataAvailable;

    // tasks is the name of publication in server 
    const tasksHandler = Meteor.subscribe('tasks');

    if (!tasksHandler.ready()) return {...noDataAvailable, isLoading:true};

    // return owners pending task (hide=true)
    // return owners all task (hide=false)
    const tasks = TasksCollection
      .find( hideState ? pendingTaskWithOwner: userFilter,
       { sort: { createdAt: -1 } })
      .fetch();

    // find uncompleted tasks by owner
    const pendingTaskCount = TasksCollection.find(pendingTaskWithOwner).count();
     
    return {tasks, pendingTaskCount}
  });

  const pendingTaskNumber = `${
    pendingTaskCount ? `(${pendingTaskCount})` : '(0)'
  }`

  const logout = () => Meteor.logout();

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
          <a className="flex-center" onClick={logout}>
            <svg className="w-4 " data-darkreader-inline-fill="" fill="currentColor" style={{"--darkreader-inline-fill":"currentColor"}} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd"></path></svg>
          </a>
        </div>
      </div>
      
      { user ? (
         <>
          <TaskForm />

          <div className="filter-group">
            <button onClick={ () => setHideState(!hideState) } className="button">
              { hideState ?  'Show All' : 'Hide Completed' }
            </button>
          </div>

          {/* Display to notify if task subsciption data is not ready */}
          {isLoading && <div className="loading">loading...</div>}

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