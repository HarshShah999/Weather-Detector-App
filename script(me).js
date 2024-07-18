const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");

const grantAccessContainer = document.querySelector(
  ".grant-location-container"
);
const searchContainer = document.querySelector(".search-container");
const loadingScreen = document.querySelector("[data-loading]");
const userInfoContainer = document.querySelector(".user-info-container");

// intiallay Variables
let currentTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab");

function switchTab1() {
  currentTab.classList.remove("current-tab");
  currentTab = userTab;
  currentTab.classList.add("current-tab");
  grantAccessContainer.classList.add("active");
  searchContainer.classList.remove("active");
  userInfoContainer.classList.remove("active");
  //getfromSessionStorage();
}

function switchTab2() {
  currentTab.classList.remove("current-tab");
  currentTab = searchTab;
  currentTab.classList.add("current-tab");
  searchContainer.classList.add("active");
  grantAccessContainer.classList.remove("active");
  userInfoContainer.classList.remove("active");
}

userTab.addEventListener("click", switchTab1);

searchTab.addEventListener("click", switchTab2);

async function fetchUserWeatherInfo(coordinates) {
  const { lat, lon } = coordinates;
  grantAccessContainer.classList.remove("active");
  loadingScreen.classList.add("active");

  //API CALL
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch {
    loadingScreen.classList.add("active");
  }
}

function renderWeatherInfo(weatherInfo) {
  //first we have to fetch all the elements

  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windspeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-cloudiness]");

  //fetch the values from weatherInfo obj & put it in UI elements
  cityName.innerText = weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  desc.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.innerText = weatherInfo?.main?.temp +"°C";
  windspeed.innerText = weatherInfo?.wind?.speed  +" " +"m/s";
  humidity.innerText = weatherInfo?.main?.humidity +" "  +"%";
  cloudiness.innerText = weatherInfo?.clouds?.all +" " +"%";
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation is not Supported");
  }
}

function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };

  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

grantAccessContainer.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchContainer.addEventListener("submit", (e) => {
  e.preventDefault();
  let cityName = searchInput.value;
  if (cityName === "") {
    return;
  } else {
    fetchSearchWeatherInfo(cityName);
  }
});

async function fetchSearchWeatherInfo(city) {
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch {
    loadingScreen.classList.add("active");
    alert("Error 404 page not found");
  }
}
