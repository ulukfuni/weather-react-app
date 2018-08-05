import React, { Component } from 'react';
import Forecast from './components/forecast';
import Map from './components/map';
import LocationSearchInput from './components/locationSearch';
import Btn from './components/Btn';
import ForecastContents from './components/ForecastContents';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import styled from 'styled-components';

const WeatherBox = styled.div`
  margin: 10px;
  margin-bottom: 30px;
  background-color: #ffffff;
  padding: 15px;
`;

const AppContainer = styled.div`
  background-color: #f3f3f3;
  color: #173946;
  height: 100%;
`;

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      weatherData: [],
      currentLocation: {},
      cityList: [],
      latitude: '',
      longitude: '',
      selectedCity: ''
    }
  }
  componentDidMount() {
    if (localStorage.getItem('weatherData') && localStorage.getItem('weatherData') !== '[]') {
      this.setState({weatherData: this.getFromLocationStorage()});
    } else {
      //get currentlocation and call retrieveWEather
      this.getCurrentLocation().then(()=>{
        this.retrieveCityFromLatLng()
      });
    }
  }

  addCityToList(city) {
    let quotedCity = `"${city}"`;
    this.setState({cityList: [...this.state.cityList, quotedCity]}, () => {
      this.retrieveWeather(quotedCity);
    });
  }
  createWeatherUrl(city) {
    if (city === '' || city === undefined) {
      //reached the daily limit for the google api so it errors out
      city = '"orlando, fl"';
      this.addCityToList("orlando fl");
    }
    return `https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D${encodeURI(city)})&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`;
  }
  createReverseGeoCodeUrl(obj) {
    return `https://maps.googleapis.com/maps/api/geocode/json?latlng=${obj.latitude},${obj.longitude}`;
  }
  retrieveCityFromLatLng() {
    return fetch(this.createReverseGeoCodeUrl(this.state.currentLocation))
      .then(res => res.json())
      .then((res) => {
        if (res && res.results && res.results.length === 0) {
          //google geocode did not return anything
          this.setState({errMsg: res.error_message})
        }
        //add city here
        let geocodedCity = res.results.filter((loc) => {
          return loc.types.includes('locality')
        })
        this.addCityToList(geocodedCity && geocodedCity[0] && geocodedCity[0].formatted_address)
      })
      .catch((err) => {
        console.log('ERR:', err)
      })
  }
  retrieveWeather(city) {
    return fetch(this.createWeatherUrl(city))
    .then(res => res.json())
    .then((res) => {
      let newWeatherData = res && res.query && res.query.results && {...res.query.results.channel, latitude: this.state.latitude, longitude: this.state.longitude};
      this.setState({weatherData: [...this.state.weatherData, newWeatherData]}, () => {
        this.storeInLocalStorage(this.state.weatherData);
      });
    })
  }
  storeInLocalStorage(obj) {
    localStorage.setItem('weatherData', JSON.stringify(obj));
  }
  getFromLocationStorage() {
    return JSON.parse(localStorage.getItem('weatherData'));
  }
  getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
         let { latitude, longitude } = position.coords;
         resolve(this.setState({
           currentLocation: position.coords,
           latitude: latitude,
           longitude: longitude
          }))
       },(err)=>{
         console.log(err)
         reject(err)
       })
     }
    })
    
  }
  addCity = () => {
    this.addCityToList(this.state.selectedCity)
    this.setState({selectedCity: ''})
  }

  removeCity = (index) => {
    let cityListCopy = [...this.state.cityList];
    let weatherDataCopy = [...this.state.weatherData];
    cityListCopy.splice(index, 1);
    weatherDataCopy.splice(index, 1);
    this.setState({
      cityList: cityListCopy,
      weatherData: weatherDataCopy
    }, () => {
      this.storeInLocalStorage(this.state.weatherData);
    });
  }

  handleSelect = (selected) => {
    this.setState({selectedCity: selected});
    geocodeByAddress(selected)
      .then(res => getLatLng(res[0]))
      .then(({ lat, lng }) => {
        this.setState({
          latitude: lat,
          longitude: lng
        });
      })
  }

  handleChange = address => {
    this.setState({selectedCity: address});
  };

  render() {
    const { selectedCity, weatherData } = this.state;
    return (
      <AppContainer className="container">
        <LocationSearchInput 
          onChange={this.handleChange}
          value={selectedCity}
          onSelect={this.handleSelect}
        />
        <Btn onClick={this.addCity}>Add City</Btn>
        {weatherData.length === 0 && <p>Loading Current Location... might take a while or you removed all the cities....Yippie!</p>}
        {weatherData.length !== 0 && weatherData[0] !== undefined && weatherData.map((data, i) => {
          let {forecast} = data.item;
          let first = [...forecast].splice(0,1)[0];
          return (
            <WeatherBox key={i}>
              <div className="row">
                <div className="col">
                  <h2 className="d-inline-block">{data.location.city},{data.location.region}</h2>
                  <Btn onClick={this.removeCity} index={i}>Remove</Btn>
                </div>
                <div className="col">
                  <ForecastContents data={first} today/>
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-md-6">
                  <Forecast forecast={forecast}/>
                </div>
                <div className="col-12 col-md-6">
                  {data.longitude && data.latitude &&
                    <Map
                      loadingElement={<div style={{ height: `100%` }} />}
                      containerElement={<div style={{ minHeight: `400px`, width: `100%`, height: `100%` }} />}
                      mapElement={<div style={{ height: `100%` }} />}
                      coordinates={{lat: data.latitude, lng: data.longitude}}
                      zoom={12}
                    />
                  }
                </div>
              </div>
            </WeatherBox>
          )
        })}
      </AppContainer>
    );
  }
}

export default App;
