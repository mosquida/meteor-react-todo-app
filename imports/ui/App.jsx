import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { Hello } from './Hello.jsx';
import { Task } from './Task.jsx';
import { useTracker } from 'meteor/react-meteor-data';
import { TasksCollection } from '/imports/api/TasksCollection';
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
    TasksCollection.update( _id, {
      $set: {
        isChecked: !isChecked
      }
    })
  }

  const deleteTask = ({ _id }) => {
    TasksCollection.remove(_id);
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
      <h1>Meteor Tasks {pendingTaskNumber} </h1>
      <h3>POWERED BY METEOR X REACT</h3>
      {/* <Hello/> */} 

      <div style={{'display': 'flex', 'justify-content': 'space-between'}}>
        <h2>{user ? user.username : ''}</h2>
        <a className="button" onClick={() => Meteor.logout()}>Logout</a>
      </div>
      
      { user ? (
         <>
          {/* We need _id (owner ref) when inserting new task */}
          <TaskForm user={user}/>

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