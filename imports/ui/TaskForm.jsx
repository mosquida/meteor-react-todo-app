import React, { useState } from 'react'
import { Meteor } from "meteor/meteor";

export const TaskForm = () => {

    const [taskName, setTaskName] = useState('');

    const handleSubmit = e => {
        e.preventDefault();

        if (!taskName) return;

        Meteor.call('task.insert', taskName);

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
