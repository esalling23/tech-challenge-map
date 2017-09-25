import React, { Component } from 'react';
import classnames from 'classnames';
import './style.css';
class App extends Component {

  // Add the voter's choice to the database
  addVoter(e) {
    var that = this;
    event.preventDefault();
    let voter_data = {
      'address' : this.refs.voter_address.value, 
      'vote' : this.refs.voter_choice.value
    };

    console.log(voter_data);

    fetch('/api/voting', { 
      method: 'POST',
      data: voter_data
    })
    .then(function(response) {
      return response.json()
    }).then(function(body) {
      console.log(body);
    });

  }

  // Render page
  render() {
    const { className, ...props } = this.props;
    return (
      <div className={classnames('App', className)} {...props}>
        <div className="App-header">
          <h2>Welcome to Voting - Online!</h2>
        </div>
        <p className="App-intro">
          Please enter your address below and choose to vote for this candidate
        </p>

        <form>
          <input type="text" ref="voter_name" placeholder="Your Name"/>
          <input type="text" ref="voter_address" placeholder="Your Address"/>
          <input type="checkbox" ref="voter_choice" id="vote" name="approve" value="approval" />
          <label for="vote">Vote for candidate?</label>

          <button onClick={this.addVoter.bind(this)}>Send Vote</button>
          <button onClick={this.props.actions.pool}>See votes</button>
        </form>
        
      </div>
    );
  }
}

export default App;
