var currentUnit = "C";
var temp;
var weatherIcons;
$.getJSON("scripts/icon.json",
    function (data) {
        weatherIcons = data;
        // console.log(weatherIcons);
    }
);
(function verify() {
    if ("geolocation" in navigator) {
        /* geolocation is available */
        // navigator.geolocation.getCurrentPosition()
        navigator.geolocation.getCurrentPosition(getWeather, function () { }, { enableHighAccuracy: true });
    } else {
        /* geolocation IS NOT available */
        alert("Please allow GPS to get weather information.");
    }
})();
function getWeather(position) {
    $.ajax({
        type: "GET",
        url: "https://fcc-weather-api.glitch.me/api/current?",
        data: {
            lon: position.coords.longitude,
            lat: position.coords.latitude,
        },
        dataType: "json",
        success: changeWeather,
        error: () =>{
            alert('Error fetching data. Please check your Internet connection.');
        }
    });
}
//change units wala func
$('button').click(function (e) {
    e.preventDefault();
    if (currentUnit === "C") {
        currentUnit = "F"
        temp = (temp * 1.8) + 32;
        e.target.innerText = "Celcius";
    } else {
        currentUnit = "C";
        temp = (temp - 32) / 1.8;
        e.target.innerText = "Fahrenheit";
    }
    $('#unit').toggleClass('wi-celsius wi-fahrenheit');
    $('#temp').text(Number(temp).toFixed(1));
});
function changeWeather(response){
    temp = response.main.temp;
    iconClass = iconBuilder(response);
    $('.main i').attr("class", iconClass);
    $('#temp').text(Number(temp).toFixed(1));
    $('#unit').attr('class', 'wi wi-celsius')
    $('.wi-humidity span').text(" " + response.main.humidity + " %");
    $('.wi-sunrise span').text(" " + getTime(response.sys.sunrise));
    $('.wi-sunset span').text(" " + getTime(response.sys.sunset));
    $("#desc").text(response.weather[0].description);
    $('#location').text(response.name + ", " + response.sys.country);
}
function iconBuilder(rsp) {
    var dorn = "";
    var prefix = "wi wi-";

    var hour = new Date().getHours();

    if (hour > 6 && hour < 19) {
        //Day time
        dorn = "day-";

    } else {
        //Night time
        dorn = "night-";
    }
    //    console.log(dorn);
    var code = rsp.weather[0].id;
    return prefix + dorn + weatherIcons[code].icon;
}

function getTime(timestamp){
    var time = new Date(timestamp * 1000);
    return time.getHours().toString()+ ":" + time.getMinutes().toString();
}