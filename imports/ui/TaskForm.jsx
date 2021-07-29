import React, { useState } from 'react'
import { TasksCollection } from '/imports/api/TasksCollection';

export const TaskForm = ({ user }) => {

    const [taskName, setTaskName] = useState('');

    const handleSubmit = e => {
        e.preventDefault();

        if (!taskName) return;

        TasksCollection.insert({
            name: taskName.trim(),
            createdAt: new Date(),
            userId: user._id
        });

        setTaskName('');
    }

    return (
        <form onSubmit={handleSubmit}>
            <input 
             type="text" 
             placeholder="What's on your mind?"
             value={taskName} 
             onChange={(e) => setTaskName(e.target.value)} />

            <button type="submit" className="button"> Add Task </button>
        </form>
    )
}
