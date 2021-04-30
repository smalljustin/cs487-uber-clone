import React from "react";
import styled from "styled-components";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import keys from "../keys";
import Login from "../components/login";
import RideRequest from "../components/rideRequest";
import ProgressBar from "react-bootstrap/ProgressBar";
import Alert from "react-bootstrap/Alert";

const HeadingStyled = styled.h1``;

const ContentDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

const Pane = styled.div`
  width: 100%;
  min-width: 300px;
  padding-left: 20px;
`;

const PageDiv = styled.div`
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
  padding: 20px;
`;

const ButtonDiv = styled.div`
  display: flex;
  justify-content: space-between;
`;

class UserRoute extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: null,
      location: null,
    };

    let urlParams = new URLSearchParams(window.location.search);
    this.userRouteId = urlParams.get("userRouteId");

    this.map = null;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (loc) => this.setState({ location: loc }),
        () => console.error("Error: Can't access user location!")
      );
    }
    this.updateRouteStatus = this.updateRouteStatus.bind(this);
    this.updateFunc = window.setInterval(this.updateRouteStatus, 4000);
    this.updateRouteStatus();
  }

  updateRouteStatus() {
    fetch(
      "http://" +
        window.location.hostname +
        ":8000/rides/id?id=" +
        this.userRouteId
    )
      .then((res) => res.json())
      .then((json) => this.setState({ route: json }));
  }

  renderMap() {
    if (this.state.route == null) {
      return;
    }
    if (this.state.routed != 1) {
      this.setState({ routed: 1 });
      this.map = (
        <iframe
          src={
            "https://www.google.com/maps/embed/v1/directions?key=" +
            keys.gmaps +
            "&origin=" + this.state.route.sourceLat + "," + this.state.route.sourceLong + 
            "&destination=" + this.state.route.destLat + "," + this.state.route.destLong
          }
          width="500px"
          height="700px"
        />
      );
    }
  }

  progressBar(stage) {
    return (
      <ProgressBar>
        <ProgressBar
          striped
          variant={stage >= 1 ? "success" : "info"}
          now={20}
          key={1}
          label="Route Created"
        />
        <ProgressBar
          striped
          variant={stage >= 2 ? "success" : "info"}
          now={stage >= 1 ? 50 : 0}
          key={1}
          label="Finding Driver"
        />
        <ProgressBar
          striped
          variant={stage >= 3 ? "success" : "info"}
          now={stage >= 2 ? 50 : 0}
          key={1}
          label="Driver Arriving"
        />
      </ProgressBar>
    );
  }

  render() {
    this.renderMap();

    if (this.state.route == null) {
      return null;
    }
    return (
      <PageDiv>
        <h1>Route Page</h1>
        <ContentDiv>
          <Pane>
            <h2>Your Route</h2>
            <p>Price: {this.state.route.price.toFixed(2)}</p>
            <p>Distance: {this.state.route.distance}</p>
            {this.progressBar(this.state.route.stage)}
          </Pane>
          <Pane>
            <h2>Pickup Location</h2>
            {this.map}
          </Pane>
        </ContentDiv>
      </PageDiv>
    );
  }
}

export default UserRoute;
