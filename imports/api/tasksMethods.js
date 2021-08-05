import { check } from 'meteor/check';
import { TasksCollection } from '/imports/db/TasksCollection';

// Methods provides a way for the client to not call directly database operation
// making only specific methods available for them if they are authenticated (security issues)

Meteor.methods({
    'task.insert'(text) {

        // checks expected data
        // "text should be string" 
        check(text, String);

        if (!this.userId) throw new Meteor.Error('Unauthorized');
        
        TasksCollection.insert({
            name: text,
            createdAt: new Date,
            userId: this.userId
        })
    },

    'tasks.remove'(taskId) {
        check(taskId, String);

        if (!this.userId) throw new Meteor.Error('Unauthorized');

        TasksCollection.remove(taskId);
    },

    // update 
    'task.setIsChecked'(taskId, isChecked) {
        check(taskId, String);
        check(isChecked, Boolean);

        if (!this.userId) throw new Meteor.Error('Unauthorized');

        TasksCollection.update(taskId, {
            $set: {
                isChecked
            }
        });      
    }
}); 