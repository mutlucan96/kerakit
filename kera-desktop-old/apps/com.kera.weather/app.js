import * as icon from './icons.js';
import {send} from '../../api/js/message.mjs';

document.addEventListener('readystatechange', (event) => {
  if (event.target.readyState === 'complete') {
    initApp();
  }
});

const API_KEY = 'd292e39289ef2bcac439515c3f57630a';
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'];
const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'];
const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Date
const date = new Date();
const month = MONTHS[date.getMonth()];
const day = DAYS[date.getDay()];
const offset = date.getTimezoneOffset() * 60;

const initApp = () => {
  const browserTitle = document.querySelector('title');
  const currentIcon = document.getElementById('current-icon');
  const temp = document.getElementById('temp');
  const tempMin = document.getElementById('tempMin');
  const tempMax = document.getElementById('tempMax');
  const wind = document.getElementById('wind');
  const windDirection = document.getElementById('wind-direction');
  const windSock = document.getElementById('wind-sock');
  const humidity = document.getElementById('humidity');
  const uvi = document.getElementById('uvi');
  const sunrise = document.getElementById('sunrise');
  const sunset = document.getElementById('sunset');
  const aqi = document.getElementById('aqi');

  const getGeolocation = () => {
    const requestOptions = {
      method: 'GET',
    };

    fetch(
        'https://api.geoapify.com/v1/ipinfo?&apiKey=9f8f8893f2724c0ebaa2f9cf6f8da3bd',
        requestOptions).then((response) => response.json()).then((result) => {
      const lat = result.location.latitude;
      const lon = result.location.longitude;
      getData(lat, lon).then(([weatherData, airData, geoReverseData]) => {
        document.getElementById('hourly-weather').innerHTML = '';
        document.getElementById('daily-weather').innerHTML = '';
        populateCurrentData(weatherData, geoReverseData[0].name);
        populateForecastData(weatherData);
        populateAirQualityData(airData);
        document.body.classList.add('ready');
        document.body.classList.remove('loading');
      });
    }).catch((error) => console.log('error', error));

    /* if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            getData(lat, lon).then(([weatherData, airData, geoReverseData]) => {
              document.getElementById('hourly-weather').innerHTML = '';
              document.getElementById('daily-weather').innerHTML = '';
              populateCurrentData(weatherData, geoReverseData[0].name);
              populateForecastData(weatherData);
              populateAirQualityData(airData);
            }).catch((error) => {
              console.log(error);
            });
          },
          (error) => {
            isError(error);
            switch (error.code) {
              case error.PERMISSION_DENIED:
                location.innerText = 'Geolocation request denied.';
                break;
              case error.POSITION_UNAVAILABLE:
                navigator.onLine ?
                    (location.innerText = 'Location unavailable.') :
                    (location.innerText = '📡 No internet.');
                break;
              case error.TIMEOUT:
                location.innerText = 'Timed out request.';
                break;
              case error.UNKNOWN_ERROR:
                location.innerText = 'Unknown error occurred.';
                break;
            }
          },
      );
    } else {
    }*/
  };

  getGeolocation();

  const getData = async (lat, lon) => {
    const weather = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    const air = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const geoReverse = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const [weatherResponse, airResponse, geoReverseResponse] =
        await Promise.all([fetch(weather), fetch(air), fetch(geoReverse)]);

    const weatherData = await weatherResponse.json();
    const airData = await airResponse.json();
    const geoReverseData = await geoReverseResponse.json();

    return [weatherData, airData, geoReverseData];
  };

  const getGeoDirectData = async (city) => {
    try {
      const geoDirect = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_KEY}`;
      const geoDirectResponse = await fetch(geoDirect);
      const geoDirectData = await geoDirectResponse.json();
      const lat = geoDirectData[0].lat;
      const lon = geoDirectData[0].lon;
      getData(lat, lon).then((data) => {
        document.getElementById('hourly-weather').innerHTML = '';
        document.getElementById('daily-weather').innerHTML = '';
        populateCurrentData(data[0], geoDirectData[0].name);
        populateForecastData(data[0]);
        populateAirQualityData(data[1]);
        document.body.classList.add('ready');
        document.body.classList.remove('loading');
      });
      return geoDirectData;
    } catch (error) {
      alert('Unknown location');
      isError(error);
    }
  };

  // Search
  const searchForm = document.getElementById('search-form');
  const searchButton = document.getElementById('search-button');
  const search = document.getElementById('search');
  const runSearch = (e) => {
    e.preventDefault();
    const city = search.value;

    if (city) {
      document.body.classList.remove('ready');
      document.body.classList.add('loading');
      setTimeout(() => {
        getGeoDirectData(city);
        search.value = '';
        search.placeholder = city;
      }, 100);
    }
  };

  searchForm.addEventListener('submit', runSearch);
  searchButton.addEventListener('click', runSearch);

  function populateAirQualityData(data) {
    const index = data.list[0].main.aqi;

    if (index === 1) {
      aqi.innerText = 'Good';
    } else if (index === 2) {
      aqi.innerText = 'Fair';
    } else if (index === 3) {
      aqi.innerText = 'Moderate';
    } else if (index === 4) {
      aqi.innerText = 'Poor';
    } else if (index === 5) {
      aqi.innerText = 'Very Poor';
    }
  }

  function populateCurrentData(data, cityName) {
    // TODO: Add all data to an object so to map through and create string HTML
    // TODO: Remove html tags from index.html
    if (cityName) {
      const dateSunrise = new Date(
          (data.current.sunrise + data.timezone_offset + offset) * 1000);
      const dateSunset = new Date(
          (data.current.sunset + data.timezone_offset + offset) * 1000);

      currentIcon.src = `icons/${data.current.weather[0].icon}.svg`;
      browserTitle.innerText = cityName + ' ' + Math.round(data.current.temp) +
          '°';
      date.innerText = month + ', ' + day + ' ' + date.getDate();
      search.placeholder = cityName;
      currentIcon.title = capitaliseString(
          data.current.weather[0].description);
      temp.innerText = Math.round(data.current.temp) + '°';
      tempMin.innerText = Math.round(data.daily[0].temp.min) + '°';
      tempMax.innerText = Math.round(data.daily[0].temp.max) + '°';
      wind.innerText = Math.round(data.current.wind_speed * 3.6) + ' km/h';
      windDirection.style.transform = `rotate(${data.current.wind_deg}deg)`;

      if (data.current.wind_speed > 5) {
        windSock.src = 'icons/windsock.svg';
      } else {
        windSock.src = 'icons/windsock-weak.svg';
      }

      humidity.innerText = data.current.humidity + '%';

      if (data.current.uvi > 1) {
        uvi.src = 'icons/uv-index-' + Math.round(data.current.uvi) + '.svg';
      } else {
        uvi.src = 'icons/uv-index-1.svg';
      }
      sunrise.innerText = dateSunrise.getHours() + ':' +
          (dateSunrise.getMinutes() < 10 ? '0' : '') + dateSunrise.getMinutes();
      sunset.innerText = dateSunset.getHours() + ':' +
          (dateSunset.getMinutes() < 10 ? '0' : '') + dateSunset.getMinutes();

      if (data.current.weather[0].icon.includes('n')) {
        document.body.classList.add('night');
      } else {
        document.body.classList.remove('night');
      }

      const mdi = populateMdi(data.current.weather[0].id,
          data.current.weather[0].icon);
      send('panelappIconChange', 'mdi-' + mdi);
      send('panelappText', {
        id: 'temp',
        text: Math.round(data.current.temp) + '°',
        top: '2%',
        left: '2%',
        fontSize: '10pt',
        fontWeight: 'bold',
      });
    }
  }

  function populateForecastData(data) {
    data.hourly.slice(0, 25) // This shows only the first 24 hrs
        .map((dataHourly) => {
          const date = new Date(
              (dataHourly.dt + data.timezone_offset + offset) * 1000);
          const hourlyList = document.createElement('div');
          hourlyList.className = 'card';

          hourlyList.innerHTML = `
            <div class="hourly">
              <p class="hour">${date.getHours()}</p>
          ${populateIcon(dataHourly.weather[0].id, dataHourly.weather[0].icon)}
              <p class="temp">${Math.round(dataHourly.temp)}°</p>
            </div>
            `;
          document.getElementById('hourly-weather').appendChild(hourlyList);
        });

    data.daily.slice(1) // This skip the 1st entry which is the current day
        .map((dataDaily) => {
          const date = new Date(dataDaily.dt * 1000);
          const dailyList = document.createElement('div');
          dailyList.classList.add('card');

          dailyList.innerHTML = `
          <div class="day">
            <div class="day-icon" title="${capitaliseString(
              dataDaily.weather[0].description)}">
              <h5>${DAYS_SHORT[date.getDay()]}</h5>
             ${populateIcon(dataDaily.weather[0].id, dataDaily.weather[0].icon)}
            </div>
            <div>
              <h3 class="day-high">${Math.round(dataDaily.temp.max)}°</h3>
            </div>
            <div>
              <h3 class="day-low">${Math.round(dataDaily.temp.min)}°</h3>
            </div>
          </div>
          `;
          document.getElementById('daily-weather').appendChild(dailyList);
        }).join('');
  }

  function populateIcon(id, iconCode) {
    if (id >= 200 && id <= 232) {
      return icon.thunderstorm;
    } else if (id >= 300 && id <= 321) {
      return icon.showerRain;
    } else if (id >= 500 && id <= 504) {
      return icon.rain;
    } else if (id === 511) {
      return icon.snow;
    } else if (id >= 520 && id <= 531) {
      return icon.showerRain;
    } else if (id >= 600 && id <= 622) {
      return icon.snow;
    } else if (id >= 700 && id <= 781) {
      return icon.mist;
    } else if (id === 800) {
      if (iconCode === '01d') {
        return icon.sun;
      } else {
        return icon.moon;
      }
    } else if (id === 801) {
      if (iconCode === '02d') {
        return icon.fewClouds;
      } else {
        return icon.fewCloudsNight;
      }
    } else if (id === 802) {
      if (iconCode === '03d') {
        return icon.scatteredClouds;
      } else {
        return icon.scatteredCloudsNight;
      }
    } else if (id === 803 || id === 804) {
      return icon.brokenClouds;
    }
  }

  function populateMdi(id, iconCode) {
    if (id >= 200 && id <= 232) {
      return 'weather-lightning';
    } else if (id >= 300 && id <= 321) {
      return 'weather-pouring';
    } else if (id >= 500 && id <= 504) {
      return 'weather-rainy';
    } else if (id === 511) {
      return 'weather-snowy-rainy';
    } else if (id >= 520 && id <= 531) {
      return 'weather-pouring';
    } else if (id >= 600 && id <= 622) {
      return 'weather-snowy';
    } else if (id >= 700 && id <= 781) {
      return 'weather-fog';
    } else if (id === 800) {
      if (iconCode === '01d') {
        return 'weather-sunny';
      } else {
        return 'weather-night';
      }
    } else if (id === 801) {
      if (iconCode === '02d') {
        return 'weather-partly-cloudy';
      } else {
        return 'weather-night-partly-cloudy';
      }
    } else if (id === 802) {
      if (iconCode === '03d') {
        return 'weather-partly-cloudy';
      } else {
        return 'weather-night-partly-cloudy';
      }
    } else if (id === 803 || id === 804) {
      return 'weather-cloudy';
    }
  }

  function capitaliseString(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  function isError(error) {
    document.getElementById('hourly-weather').innerHTML = '';
    document.getElementById('daily-weather').innerHTML = '';
    if (error) {
      temp.innerText = '';
      tempMin.innerText = '-';
      tempMax.innerText = '-';
      wind.innerText = '-';
      humidity.innerText = '-';
      uvi.innerText = '-';
      sunrise.innerText = '-';
      sunset.innerText = '-';
      aqi.innerText = '-';
    }
  }
};
