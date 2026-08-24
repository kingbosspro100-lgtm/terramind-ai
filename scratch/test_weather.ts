async function testWeatherApi() {
  const lat = 6.37;
  const lon = 2.43;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,rain,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,rain_sum,wind_speed_10m_max&timezone=auto`;

  console.log("Fetching weather from:", url);
  const res = await fetch(url);
  const data = await res.json();

  console.log("Current Weather:", data.current);
  console.log("7-day Forecast Days:", data.daily.time);
  console.log("7-day Max Temp:", data.daily.temperature_2m_max);
}

testWeatherApi();
