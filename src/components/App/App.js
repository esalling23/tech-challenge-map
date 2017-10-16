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
      voters: [], 
      voting: true,
      voted: false,
      zoom: 3, 
      position: {
        lat: 37.774929,
        lng: -82.419416
      }, 
      view: 'map'
    };
  }

  componentWillMount() {

    var that = this;

    // Start with the full map of current voters
    var request = new Request('http://localhost:3000/api/voters', {
      method: 'GET', 
      headers: new Headers({ 'Content-Type': 'application/json'})
    });

    fetch(request)
    .then(function(response) {
      return response.json()
    }).then(function(body) {
      that.setState({ voters: body }, 
        function() {
          console.log(that.state.voters);
          // this.forceUpdate();
        }
      );
    })
    .catch(function(err) {
      console.log(err);
    });

  }

  setMapCenter(getLocation, latLng) {
    if (getLocation) {
      if (this.props.centerAroundCurrentLocation) {
        if (navigator && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((pos) => {
            const coords = pos.coords;
            this.setState({
              position: {
                lat: coords.latitude,
                lng: coords.longitude
              }, 
              function() {
                console.log("new position");
              }
            })
          })
        }
      }
    } else {
      this.setState({
        position: {
          lat: latLng.lat,
          lng: latLng.lng
        }, 
        function() {
          console.log("new position");
        }
      })
    }
  }

  // Add the voter's choice to the database
  addVoter(e) {
    var that = this;
    e.preventDefault();

    coder.find( this.refs.voter_address.value , function handleResults(status, result) {
      
      let latLng = result[0].location.lat.toString() + ', ' + result[0].location.lng.toString()
      // process voter with geocoded address
      let voter_data = {
        'title': that.refs.voter_name.value,
        'address' : latLng, 
        'approves' : that.refs.voter_choice.checked
      };

      // Send request to add voter
      var request = new Request('http://localhost:3000/api/voting', {
        method: 'POST', 
        headers: new Headers({ 'Content-Type': 'application/json'}), 
        body: JSON.stringify(voter_data)
      })

      // Return fetch request
      return fetch(request)
      .then(function(response) {
        return response.json()
      })
      .then(function(body) {
        let voters = that.state.voters;
        let position = { lat: result[0].location.lat, lng: result[0].location.lng}
        // New state
        voters.push(body);
        that.setState({ voters: voters, voted: true }, 
          function() {
            this.setMapCenter(false, position)
          }
        );
      })
      .catch(function(err) {
        console.log(err);
      });
    });

  }

  voter(e) {
    var that = this;
    e.preventDefault();

    // Set voting state to true
    that.setState({ voting: true }, 
      function() {
        console.log("you are a voter");
      }
    );
  }

  seeAll(e) {
    var that = this;
    e.preventDefault();

    // Set voting state to false
    that.setState({ voting: false }, 
      function() {
        console.log("you are viewing all votes");
      }
    );
  }

  setMapZoom(e) {
    var that = this;
    e.preventDefault();

    // Set map zoom to zoom out
    that.setState({ zoom: 0 }, 
      function() {
        console.log("zoom out");
      }
    );
  }

  showList(e) {
    var that = this;
    e.preventDefault();

    that.setState({ view: 'list' }, function() {
      console.log("now viewing as a list");
    });

  }

  showMap(e) {
    var that = this;
    e.preventDefault();

    that.setState({ view: 'map', zoom: 0 }, function() {
      console.log("now viewing as a map");
    });

  }

  // Render page
  render() {
    const style = {
      width: '100vw',
      height: '100vh'
    }
    const { className, ...props } = this.props;

    let voters = [];
    this.state.voters.map(item => voters.push(item));

    if (!this.props.loaded) {
      return <div>Loading...</div>

    } else if (this.state.voting && !this.state.voted) {

      return (
        <div className={classnames('App', className)} style={style}>
          <div className="App-header">
            <h2>Welcome to Voting - Online!</h2>
          </div>
          <p className="App-intro">
            Please enter your address below and choose to vote for this candidate
          </p>
          <form id="vote_form">
            <div>
              <input type="text" ref="voter_name" placeholder="Your Name"/>
              <input type="text" ref="voter_address" placeholder="Your Address"/>
            </div>
            <div>
              <input type="checkbox" ref="voter_choice" id="vote" name="approve" value="approval" />
              <label htmlFor="vote">Vote for candidate?</label>
            </div>

            <button id="send_vote" onClick={this.addVoter.bind(this)}>Send Vote</button>

            <button id="see_all" onClick={this.seeAll.bind(this)}>See All Votes</button>

          </form>
        </div>
      );

    } else {

      voters.map(voter => console.log(voter.address.split(',')[0], voter.address.split(',')[1]));
      return (
        <div className={classnames('App', className)} style={style}>
          <div className="App-header">
            <h2>Welcome to Voting - Online!</h2>
            <button onClick={this.voter.bind(this)}>Add Your Vote</button>
          </div>
          
          {this.state.view === 'map' ? (
            <div>
              <p className="App-intro">
                <button onClick={this.showList.bind(this)}>List View</button>
              </p>
              <Map clickableIcons={false} id="map" ref="map" google={this.props.google} initialCenter={this.state.position} zoom={this.state.zoom}>

              {voters.map(voter => <Marker key={voter.id} className={'voter.approves'}
                    name={voter.title} position={{ lat: voter.address.split(',')[0], lng: voter.address.split(',')[1]}}/>)}

              </Map>
            </div>
          ) : (
            <div>
              <p className="App-intro">
                <button onClick={this.showMap.bind(this)}>Map View</button>
              </p>
              <ul id="list">
                {voters.map((voter, index) => <li key={voter.id}>{voter.title} - {voter.approves ? 'Approves' : 'Disapproves'}</li>)}
              </ul>
            </div>
          )}
        </div>
      );
    }
  }
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyBuLGSfSlrq8w-ZDbQbSlxnVSe_30Dn-Ao"),  
  libraries: ["places"]
})(App)

