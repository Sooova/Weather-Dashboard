/* api key: 97d15cbdc27beb934d52282e313116fb */
/*fetch 5 day fetch('https://api.openweathermap.org/data/2.5/forecast?q=Sydney&appid=97d15cbdc27beb934d52282e313116fb') */

// Check if localstorage key exists, if not create one with an empty array, 7, 14, 24


function addNewPrevLocation(locationName) {
  var buttonList = document.createElement('button');
  buttonList.setAttribute('class','searchHistory')
  buttonList.textContent = locationName;
  $('#previousSearch').prepend(buttonList);
}

function renderPrevLocations() {
  let prevLocation = JSON.parse(localStorage.getItem('prevLocation'))
  for(let i = 0; i < prevLocation.length; i++) {
    addNewPrevLocation(prevLocation[i])
  }
}

if (!localStorage.getItem('prevLocation')){
  localStorage.setItem('prevLocation', JSON.stringify([]));
}

renderPrevLocations();

function getWeather(cityChosen) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityChosen}&appid=97d15cbdc27beb934d52282e313116fb`)
  .then(response => response.json())
  .then(data =>  {
    console.log(data);
    document.getElementById('temp').textContent = 'Temp: '+ Math.round(data.main.temp - 273.15)+ '°C';
    document.getElementById('wind').textContent = 'Wind: '+ Math.round(data.wind.speed)+ 'MPH';
    document.getElementById('humidity').textContent = 'Humidity: '+ Math.round(data.main.humidity)+'%';
    document.getElementById('city').textContent = data.name;
    addWeatherIcons('weatherIcon',data.weather[0].icon);

  })
  
}

function createTile(name,value,parentDiv,elementType) {
  var createValues = document.createElement(elementType);
  createValues.setAttribute('class','tileText')
  createValues.textContent=name+ ': '+value;
  parentDiv.appendChild(createValues);
}

function getFiveDayWeather(cityChosen) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityChosen}&appid=97d15cbdc27beb934d52282e313116fb`)
  .then(response=>response.json())
  .then(data=> {
    console.log(data);
    let futureDay = document.getElementById('fiveDays');
    for (let i=3;i<39;i+=8) {
      var createDiv = document.createElement('div');
      createDiv.setAttribute('class','tiles');
      createDiv.setAttribute('id','tiles'+i);
      futureDay.appendChild(createDiv);
      createTile('Date',data.list[i].dt_txt.substring(0,10),createDiv,'h2');
      createTile('Temp',Math.round(data.list[i].main.temp - 273.15)+'°C',createDiv,'h2');
      createTile('Wind',data.list[i].wind.speed+' MPH',createDiv,'h2');
      createTile('Humidity',data.list[i].main.humidity +'%',createDiv,'h2');
      createTile('',addWeatherIcons('tiles'+[i],data.list[i].weather[0].icon),createDiv,'img');
    }
  })
}

var submit = $('#form');

submit.on('submit', function (e) {
  e.preventDefault();
  childRemoval = document.getElementById('fiveDays');
  childRemoval.innerHTML = "";
  document.getElementById('weatherIcon').innerHTML="";
  getWeather(document.getElementById('cityInput').value)
  getFiveDayWeather(document.getElementById('cityInput').value)
  let currentLocation = document.getElementById('cityInput').value.toLowerCase();

  var previousLocation = JSON.parse(localStorage.getItem('prevLocation'));
  if(previousLocation.includes(currentLocation)) {

  }
  else {
    let prevLocation = JSON.parse(localStorage.getItem('prevLocation'));
    if(prevLocation.length>5) {
      console.log('hello');
      previousLocation.length -=1;
      localStorage.setItem('prevLocation',JSON.stringify(prevLocation));
      $('#previousSearch').children().last().remove();
     // childRemoval = document.getElementById('previousSearch');
      //childRemoval[childLength].innerHTML = "";
    }
    if(currentLocation)
    previousLocation.push(currentLocation)
    localStorage.setItem('prevLocation', JSON.stringify(previousLocation))
    addNewPrevLocation(currentLocation)
  }
  document.getElementById('cityInput').value ='';

});

var prevButton = $('#previousSearch');
prevButton.on('click',function(e) {
  e.preventDefault();
  childRemoval = document.getElementById('fiveDays');
  childRemoval.innerHTML = ""
  document.getElementById('weatherIcon').innerHTML="";
  getWeather(e.target.textContent)
  getFiveDayWeather(e.target.textContent);
})

function addWeatherIcons(parentContainer,id) {
  parent = document.getElementById(parentContainer);
  var weatherIcon = document.createElement('img');
  weatherIcon.setAttribute('src',"http://openweathermap.org/img/w/" + id + ".png");
  parent.appendChild(weatherIcon);
}

// 1. Read key in local storage which has an array of locations 
// 2. Render all these locations as a button
// 3. When a button is clicked it triggers getWeather

// Whenver a new location is submitted, we add it to the location storage
// and run the render button function again

