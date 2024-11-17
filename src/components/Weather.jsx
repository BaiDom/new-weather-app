import React, { useEffect, useRef, useState } from "react";
import "./Weather.css";
import search_icon from "../assets/search.png";
import clear_icon from "../assets/clear.png";
import cloud_icon from "../assets/cloud.png";
import drizzle_icon from "../assets/drizzle.png";
import snow_icon from "../assets/snow.png";
import wind_icon from "../assets/wind.png";
import humidity_icon from "../assets/humidity.png";
import rain_icon from "../assets/rain.png";

const Weather = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(false);
  const [forecastData, setForecastData] = useState([]);
  const [showForecast, setShowForecast] = useState(false);
  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04n": drizzle_icon,
    "04d": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  };

  const handleCitySearch = (city) => {
    search(city);
    forecast(city);
  };

  const search = async (city) => {
    if (city === "") {
      alert("Enter a city name");
      return;
    }
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${
        import.meta.env.VITE_APP_ID
      }`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      const icon = allIcons[data.weather[0].icon] || clear_icon;
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        feelsLike: data.main.feels_like,
        maxTemp: data.main.temp_max,
        minTemp: data.main.temp_min,
        location: data.name,
        icon: icon,
        weatherMain: data.weather[0].main,
        weatherDesc: data.weather[0].description,
        date: data.dt,
      });
    } catch (error) {
      console.log(error);
      setWeatherData(false);
      console.error(
        "There was an error whilst trying to find the weather data"
      );
    }
  };

  const forecast = async (city) => {
    if (city === "") {
      alert("Enter a city name");
      return;
    }
    try {
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${
        import.meta.env.VITE_APP_ID
      }`;

      const res = await fetch(url);
      const forecasted = await res.json();

      if (!res.ok) {
        alert(forecasted.message);
        return;
      }

      const forecastedList = forecasted.list;

      const processWeatherData = (forecastedList) => {
        return forecastedList.map((item) => {
          const date = new Date(item.dt * 1000);
          const dateDay = date.toDateString().split(" ").slice(0, 1).join(" ");
          const dateNum = date.toDateString().split(" ").slice(2, 3).join(" ");
          console.log(
            date.toDateString().split(" ").slice(2, 3).join(" "),
            "date string"
          );
          return {
            date: dateDay + " " + dateNum,
            time: date.toTimeString().split(" ")[0],
            temperature: item.main.temp,
            weather: item.weather[0].main,
            description: item.weather[0].description,
            windSpeed: item.wind.speed,
            humidity: item.main.humidity,
          };
        });
      };

      const processedData = processWeatherData(forecasted.list);

      setForecastData(processedData);
    } catch (error) {
      console.log(error);
      setForecastData(false);
      console.error(
        "There was an error whilst trying to find the weather data"
      );
    }
  };

  let dateString = Date(weatherData.date).toLocaleString();
  let trimDate = dateString.split(" ").slice(0, 4).join(" ");

  useEffect(() => {
    handleCitySearch("Liverpool");
  }, []);

  return (
    <div className="weather">
      <p className="date">{trimDate}</p>

      <div className="search-bar">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleCitySearch(inputRef.current.value);
            }
          }}
        ></input>
        <img
          src={search_icon}
          alt=""
          onClick={() => handleCitySearch(inputRef.current.value)}
        />
      </div>
      {weatherData ? (
        <>
          <p className="location">{weatherData.location}</p>
          <p className="temp">{weatherData.temperature}°C</p>
          <img src={weatherData.icon} alt="" className="weather-icon" />
          <p className="weather-main">{weatherData.weatherMain}</p>
          <div
            id="forecast-button"
            onClick={() => setShowForecast(!showForecast)}
          >
            {showForecast && <div>Today</div>}
            {!showForecast && <div>5 day forecast</div>}
          </div>
          {showForecast ? (
            forecastData.length > 0 && (
              <div className="forecast">
                {forecastData.map(
                  (forecast, index) =>
                    forecast.time === "12:00:00" && (
                      <div key={index} className="five-day-div">
                        <p className="forecast-date">{forecast.date}</p>
                        {/* <p>Time: {forecast.time}</p> */}
                        <p>{Math.round(forecast.temperature)}°C</p>
                        <p>{forecast.weather}</p>
                        <p className="five-day-hum">
                          <img
                            className="five-day-hum-img"
                            src="/src/assets/humidity.png"
                            alt=""
                          />
                          {forecast.humidity}%
                        </p>
                        {/* <p className="five-day-wind">
                          <img
                            className="five-day-wind-img"
                            src="/src/assets/wind.png"
                            alt=""
                          />
                          {forecast.windSpeed} Km/h
                        </p> */}
                      </div>
                    )
                )}
              </div>
            )
          ) : (
            <div className="forecast forecast-td">
              <div className="td-item feels-like">
                <p>Feels Like</p> {weatherData.feelsLike}°C
              </div>
              <div className="td-item min-temp">
                <p>Min Temp</p> {weatherData.minTemp}°C
              </div>
              <div className="td-item max-temp">
                <p>Max Temp</p> {weatherData.maxTemp}°C
              </div>
            </div>
          )}

          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="" />
              <div>
                <p>{weatherData.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind_icon} alt="" />
              <div>
                <p>{weatherData.windSpeed} km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Weather;
