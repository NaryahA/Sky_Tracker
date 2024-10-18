const modalHeader = document.querySelector(".modalHeader");
const modal2 = document.querySelector("#modal2");
const weather1 = document.createElement("h3");
$(document).ready(function () {
    $('.modal').modal();
});

const apikey = "8f0fa8364b82a56ff6b29b97a2963b6e"
const conditionEl = document.querySelector(".conditions")
function geo(city) {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=3&appid=${apikey}`)
        .then(response => response.json())
        .then(potato => {
            console.log(potato)
            weather(potato[0].lat, potato[0].lon)
        })
}

function weather(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            const condition = data.weather[0].description
            const raincondition = ["shower rain", "rain", "light rain", "thunderstorm", "heavy intensity rain", "maderate rain", "thunderstorm with heavy rain"]
            modal2.append(weather1)


            if (raincondition.includes(condition)) {
                weather1.textContent = "there should be rain, wear a raincoat"
            } else if (condition === "snow ") {
                weather1.textContent = "dress for snow";
            } else {


                weather1.textContent = "it will be dry";
            }



            console.log(condition)// }
        })
}

// console.log(`the weather is ${condition}`)

geo("miami")