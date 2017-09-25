import React, { Component } from 'react';
import classnames from 'classnames';
import './style.css';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import geocoder from 'google-geocoder';

const key = { key: 'AIzaSyBuLGSfSlrq8w-ZDbQbSlxnVSe_30Dn-Ao'};
const coder = geocoder(key);

export class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      title: 'Vote right here', 
      voters: []
    };
  }

  componentDidMount() {

    var that = this;

    // Start with the full map of current voters
    var request = new Request('http://localhost:3000/api/voters', {
      method: 'GET', 
      headers: new Headers({ 'Content-Type': 'application/json'})
    })

    fetch(request)
    .then(function(response) {
      return response.json()
    }).then(function(body) {
      that.setState({
        voters: body
      });
    })
    .catch(function(err) {
      console.log(err);
    });

  }


  // Add the voter's choice to the database
  addVoter(e) {
    var that = this;
    e.preventDefault();

    coder.find( this.refs.voter_address.value , function handleResults(status, result) {
      console.log(result);

      let latLng = result[0].location.lat.toString() + ', ' + result[0].location.lng.toString()
      // process voter with geocoded address
      let voter_data = {
        'title': that.refs.voter_name.value,
        'address' : latLng, 
        'approves' : that.refs.voter_choice.checked
      };

      var request = new Request('http://localhost:3000/api/voting', {
        method: 'POST', 
        headers: new Headers({ 'Content-Type': 'application/json'}), 
        body: JSON.stringify(voter_data)
      })

      fetch(request)
      .then(function(response) {
        return response.json()
      })
      .then(function(body) {
        console.log(body);
        let voters = that.state.voters;
        voters.concat(body);
        that.setState({
          voters: voters
        });
      })
      .catch(function(err) {
        console.log(err);
      });
    });

  }


  // Render page
  render() {
    const { className, ...props } = this.props;
    let voters = this.state.voters;

    return (
      <div className={classnames('App', className)} {...props}>
        <div className="App-header">
          <h2>Welcome to Voting - Online!</h2>
        </div>
        <p className="App-intro">
          Please enter your address below and choose to vote for this candidate
        </p>
        <ul id="list">
          {voters.map(voter => <li>{voter.title} > {JSON.stringify(voter.approves)}</li>)}
        </ul>
        <form>
          <input type="text" ref="voter_name" placeholder="Your Name"/>
          <input type="text" ref="voter_address" placeholder="Your Address"/>
          <input type="checkbox" ref="voter_choice" id="vote" name="approve" value="approval" />
          <label for="vote">Vote for candidate?</label>

          <button onClick={this.addVoter.bind(this)}>Send Vote</button>
        </form>

        <Map id="map" ref="map" google={this.props.google} zoom={14}>

          {voters.map(voter => <Marker key={voter.id} className={'voter.approves'}
                  name={voter.title} position={voter.latLng}/>)}

        </Map>

      
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyBuLGSfSlrq8w-ZDbQbSlxnVSe_30Dn-Ao")
})(App)

