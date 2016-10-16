import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Tasks } from '../api/tasks.js';
 
import Task from './Task.js';
 
// App component - represents the whole app
class App extends Component {
  renderTasks() {
    return this.props.tasks.map((task) => (
      <Task key={task._id} task={task} />
    ));
  }
 
  render() {
    return (
      <div className="container">
        <header>
          <h1>Todo List</h1>
        </header>
 
        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    );
  }
}

App.propTypes = {
  tasks: PropTypes.array.isRequired,
};

// The wrapped App component fetches tasks from the Tasks collection and
// supplies them to the underlying App component it wraps as the tasks prop
export default createContainer(() => {
  return {
    tasks: Tasks.find({}).fetch(),
  };
}, App);
