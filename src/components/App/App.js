import React, { Component } from 'react';
import classnames from 'classnames';
import './style.css';
class App extends Component {

  // Add the voter's choice to the database
  addVoter(e) {
    var that = this;
    e.preventDefault();
    let voter_data = {
      'title': this.refs.voter_name.value,
      'address' : this.refs.voter_address.value, 
      'approves' : this.refs.voter_choice.checked
    };

    console.log(voter_data);

    var request = new Request('http://localhost:3000/api/voting', {
      method: 'POST', 
      headers: new Headers({ 'Content-Type': 'application/json'}), 
      body: JSON.stringify(voter_data)
    })

    fetch(request)
    .then(function(response) {
      return response.json()
    }).then(function(body) {
      console.log(body);
    })
    .catch(function(err) {
      console.log(err);
    });

  }

  // Show a full map of voters
  showVoterPool(e) {
    var that = this;
    e.preventDefault();

    var request = new Request('http://localhost:3000/api/voters', {
      method: 'GET', 
      headers: new Headers({ 'Content-Type': 'application/json'})
    })

    fetch(request)
    .then(function(response) {
      return response.json()
    }).then(function(body) {
      console.log(body);
    })
    .catch(function(err) {
      console.log(err);
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
          <button onClick={this.showVoterPool.bind(this)}>See votes</button>
        </form>
        
      </div>
    );
  }
}

export default App;
