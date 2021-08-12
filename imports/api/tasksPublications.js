import { Meteor } from 'meteor/meteor';
import { TasksCollection } from '/imports/db/TasksCollection';

// Publication = controls what data Meteor sends to client
// to remove all db functions in all clients send by meteor auto (must be authentcated to control as ex)

//must not use arrow function, because it has no access to this property
Meteor.publish('tasks', function publishTasks() {
    return TasksCollection.find({userId: this.userId});
})

// publications are reactive, you could use methods but its not async
// publish the data this way
// show only specific fields to lient

/*
usage and I have found this interesting discussion on Reddit: https://www.reddit.com/r/Meteor/comments/4b89x5/should_meteor_methods_only_be_used_for/ 

One comment was the one I was searching for:

Always using a publication for getting data adds an absolute ton of load to your server cpu+memory if you've got a lot of publications. It'll look and work great during development but really limit your scaling per server instance. As a rule of thumb, only subscribe to a publication if you need the data to be reactive (keeps updating in realtime). So for chat messages you may want a publication, but for getting a users profile data, that doesn't have to be reactive at all so you should use a Method. If you like always grabbing data from MiniMongo you can use a Method and store it's result in MiniMongo manually.

Think of Methods as similar to a REST call, you want some data one time and you grab it. If you want the data to keep flowing in automatically when things in the db are changed, you subscribe.
*/