/* eslint-env mocha */
 
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'meteor/practicalmeteor:chai';
 
import { Tasks } from './tasks.js';
 
if (Meteor.isServer) {
  describe('Tasks', () => {
    describe('methods', () => {
      const userId = Random.id();
      let taskId;
 
      beforeEach(() => {
        Tasks.remove({});
        taskId = Tasks.insert({
          text: 'test task',
          createdAt: new Date(),
          owner: userId,
          username: 'tmeasday',
        });
      });

      it('can delete owned task', () => {
        // Find the internal implementation of the task method so we can
        // test it in isolation
        const deleteTask = Meteor.server.method_handlers['tasks.remove'];
 
        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };
 
        // Run the method with `this` set to the fake invocation
        deleteTask.apply(invocation, [taskId]);
 
        // Verify that the method does what we expected
        assert.equal(Tasks.find().count(), 0);
      });

      it('cannot add a task if user is not signed in', () => {
        const addTask = Meteor.server.method_handlers['tasks.insert'];

        const invocation = {};

        assert.throws(() => {
          addTask.apply(invocation, ['This is a test']);
          }, Meteor.Error, '[not-authorized]');

        assert.equal(Tasks.find().count(), 1);
      });

      it('can check off owned task as complete', () => {
        const setPrivate = Meteor.server.method_handlers['tasks.setChecked'];

        const invocation = { userId };

        setPrivate.apply(invocation, [taskId, true]);

        assert.propertyVal(Tasks.findOne(), 'checked', true);
      });

      it('can set owned task to private', () => {
        const setPrivate = Meteor.server.method_handlers['tasks.setPrivate'];

        const invocation = { userId };

        setPrivate.apply(invocation, [taskId, true]);

        assert.isTrue(Tasks.findOne().private);
        assert.isBoolean(Tasks.findOne().private);
      });

    });
  });
}
