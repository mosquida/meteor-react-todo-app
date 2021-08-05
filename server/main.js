import { Meteor } from 'meteor/meteor';
import { TasksCollection } from '/imports/db/TasksCollection';
import { Accounts } from 'meteor/accounts-base';
// register methods on server startup
import '/imports/api/tasksMethods'; 

const insertTask = (taskName, user) => 
    TasksCollection.insert({
        name: taskName,
        userId: user._id,
        createdAt: new Date()
    });

const SEED_USERNAME = 'meteorite';
const SEED_PASSWORD = 'password';

Meteor.startup(() => {
    // If no default account found, create one
    if (!Accounts.findUserByUsername(SEED_USERNAME)) {
        Accounts.createUser({
            username: SEED_USERNAME,
            password: SEED_PASSWORD
        });
    }

    const user = Accounts.findUserByUsername(SEED_USERNAME);

    // Seed Tasks
    if (TasksCollection.find().count() === 0) {
        [
            'First Task',
            'Second Task',
            'Third Task'
        ].forEach(task => insertTask(task, user))
    }
});
