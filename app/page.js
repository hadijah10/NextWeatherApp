"use client"
import Image from "next/image";
import { useState,useEffect } from "react";
import styles from './page.module.css';

function getCurrentDate(){
  const currentDate = new Date();
  const options = { month: "long" };
  const monthName = currentDate.toLocaleString("en-US", options);
  const date = new Date().getDate() + ", " + monthName;
  return date;
}

export default function Home() {
  const date = getCurrentDate()
  const [weatherData,setWeatherData] = useState(null);
  const [city,setCity] = useState('');

  async function fetchData (cityName){
    try{
      const response = await fetch('/api/weather?address='+cityName)
      const jsonData = (await response.json()).data;
      setWeatherData(jsonData)
      setCity('');
    }
    catch(error){
      console.log(error)
    }
  }
  async function fetchDataByCordinates (latitude,longitude){
    try{
      const response = await fetch('/api/weather?lat='+latitude+'&lon='+longitude)
      const jsonData = (await response.json()).data;
      setWeatherData(jsonData)
      setCity('');
    }
    catch(error){
      console.log(error)
    }
  }

  useEffect(()=>{
 //   fetchData('accra');
 if("geolocation" in navigator){
  navigator.geolocation.getCurrentPosition(
    (position) => {
     // const {latitude,longitude} = position.coords;
     const crd = position.coords
      fetchDataByCordinates(crd.latitude,crd.longitude);
    },(err)=> {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }
  )
 
  }},[])
  return (
    <main className={styles.main}>
    <article className={styles.widget}>
      <form
        className={styles.weatherLocation}
        onSubmit={(e) => {
          e.preventDefault();
          fetchData(city);
        }}
      >
        <input
          className={styles.input_field}
          placeholder="Enter city name"
          type="text"
          id="cityName"
          name="cityName"
          onChange={(e) => setCity(e.target.value)}
        />
        <button className={styles.search_button} type="submit">
          Seach
        </button>
      </form>
      {weatherData && weatherData.weather && weatherData.weather[0] ? (
        <>
          <div className={styles.icon_and_weatherInfo}>
            <div className={styles.weatherIcon}>
              {weatherData?.weather[0]?.description === "rain" ||
              weatherData?.weather[0]?.description === "fog" ? (
                <i
                  className={`wi wi-day-${weatherData?.weather[0]?.description}`}
                ></i>
              ) : (
                <i className="wi wi-day-cloudy"></i>
              )}
            </div>
            <div className={styles.weatherInfo}>
              <div className={styles.temperature}>
                <span>
                  {(weatherData?.main?.temp - 273.5).toFixed(2) +
                    String.fromCharCode(176)}
                </span>
              </div>
              <div className={styles.weatherCondition}>
                {weatherData?.weather[0]?.description?.toUpperCase()}
              </div>
            </div>
          </div>
          <div className={styles.place}>{weatherData?.name}</div>
          <div className={styles.date}>{date}</div>
        </>
      ) : (
        <div className={styles.place}>Loading...</div>
      )}
    </article>
  </main>
  );
}
