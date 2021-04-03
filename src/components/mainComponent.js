import React, { Component } from "react";
import "./mainComponent.css";
import { MapContainer, TileLayer, Polygon, Tooltip } from "react-leaflet";
import users from "../jsonData/users";
import areas from "../jsonData/areas";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      areasData: areas,
      usersData: users,
      usersArr: {},
      proUser: {},
      male: {},
      female: {},
      AverageAge: {},
    };
    this.setData();
  }
  componentDidMount() {
    this.setData();
  }
  setData() {
    let usersArr = {};
    let proUser = {};
    let male = {};
    let female = {};
    let AverageAge = {};
    let totalage = {};
    users.users.map((user) => {
      usersArr[user.area_id] = 0;
      proUser[user.area_id] = 0;
      male[user.area_id] = 0;
      female[user.area_id] = 0;
      AverageAge[user.area_id] = 0;
      totalage[user.area_id] = 0;
    });
    users.users.map((user) => {
      usersArr[user.area_id]++;
      totalage[user.area_id] += user.age;
      if (user.is_pro_user === true) {
        proUser[user.area_id]++;
      }
      if (user.gender === "M") {
        male[user.area_id]++;
      }
      if (user.gender === "F") {
        female[user.area_id]++;
      }
    });
    users.users.map((user) => {
      AverageAge[user.area_id] =
        totalage[user.area_id] / usersArr[user.area_id];
    });
    this.setState({
      usersArr,
      proUser,
      male,
      female,
      AverageAge,
    });
  }
  getOpacity(areaId) {
    if (this.state.usersArr) {
      if (this.state.usersArr[areaId] > 200) {
        return 0.6;
      } else if (this.state.usersArr[areaId] > 150) {
        return 0.4;
      } else if (this.state.usersArr[areaId] > 100) {
        return 0.2;
      } else if (this.state.usersArr[areaId] > 50) {
        return 0.1;
      }
    }
    return 0.05;
  }

  getStrokeWeight(areaId) {
    if (this.state.proUser[areaId] > 150) {
      return 7;
    } else if (this.state.proUser[areaId] > 100) {
      return 5;
    } else if (this.state.proUser[areaId] > 50) {
      return 3;
    } else if (this.state.proUser[areaId] < 10) {
      return 2;
    }
    return 1;
  }
  getStrokeColor(areaId) {
    let male = this.state.male[areaId];
    let female = this.state.female[areaId];
    let ratio = male / female;
    if (ratio > 1.4) {
      return "#0099ff";
    } else if (ratio < 0.7) {
      return "#ff00ff";
    } else {
      return "#33cc33";
    }
  }
  getDashArray(areaId) {
    if (this.state.AverageAge[areaId] > 26) {
      return [12, 12];
    }
    return [1, 1];
  }
  render() {
    return (
      <div>
        <div>
        <MapContainer className="map-container" center={[13.040467663222651, 77.52199183093504]} zoom={12}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {this.state.areasData.features.map((area) => (
          <div>
            <Polygon
              fillColor="#006600"
              color={this.getStrokeColor(area.properties.area_id)}
              dashArray={this.getDashArray(area.properties.area_id)}
              fillOpacity={this.getOpacity(area.properties.area_id)}
              weight={this.getStrokeWeight(area.properties.area_id)}
              positions={area.geometry.coordinates[0]}
            >
              <Tooltip sticky>
                <div>
                  <div>Area Name: {area.properties.name}</div>
                  <div>Area Pincode: {area.properties.pin_code}</div>
                  <div>
                    Area Total Users:{" "}
                    {this.state.usersArr[area.properties.area_id]}
                  </div>
                  <div>
                    Area Pro Users:{" "}
                    {this.state.proUser[area.properties.area_id]}
                  </div>
                  <div>
                    Area Average Age:{" "}
                    {Math.round(this.state.AverageAge[area.properties.area_id])}
                  </div>
                  <div>
                    Male to Female:{" "}
                    {(
                      this.state.male[area.properties.area_id] /
                      this.state.female[area.properties.area_id]
                    ).toFixed(2)}
                  </div>
                </div>
              </Tooltip>
            </Polygon>
          </div>
        ))}
      </MapContainer>

        </div>
      </div>

    );
  }
}

export default Main;
