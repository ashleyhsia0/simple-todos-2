import React, { Component, PropTypes } from 'react';
// import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import { Tasks } from '../api/tasks.js';
 
import Task from './Task.js';
 
// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);
    // This line is important for autobinding
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    const text = this.refs.textInput.value.trim();
 
    Tasks.insert({
      text,
      createdAt: new Date(), // current time
    });
 
    // Clear form
    this.refs.textInput.value = '';
  }

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

          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted.bind(this)}
            />
            Hide Completed Tasks
          </label>

          <form className="new-task" onSubmit={this.handleSubmit} >
            <input
              type="text"
              ref="textInput"
              placeholder="Type to add new tasks"
            />
          </form>
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
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
  };
}, App);
