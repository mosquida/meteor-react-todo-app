import { Meteor } from 'meteor/meteor';
import { TasksCollection } from "/imports/api/TasksCollection";

const insertTask = taskName => TasksCollection.insert({name: taskName});

Meteor.startup(() => {
    if (TasksCollection.find().count() === 0) {
        [
            'First Task',
            'Second Task',
            'Third Task'
        ].forEach(insertTask)
    }
});
