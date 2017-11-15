var App = (function($){
    var currentUnit = "C",
    buttonText = 'Celcius',
    temp,
    weatherIcons;
    
    $.getJSON("scripts/icon.json",
        function (data) {
            weatherIcons = data;
        }
    );

    function run() {
        $('.jumbotron .row').hide();
        if ("geolocation" in navigator) {
            /* geolocation is available */
            // navigator.geolocation.getCurrentPosition()
            navigator.geolocation.getCurrentPosition(getWeather,() => {}, { enableHighAccuracy: true });
        } else {
            /* geolocation IS NOT available */
            alert("Please allow GPS to get weather information.");
        }
    }

    function getWeather(position) {
        $.ajax({
            type: "GET",
            url: "https://fcc-weather-api.glitch.me/api/current?",
            data: {
                lon: position.coords.longitude,
                lat: position.coords.latitude,
            },
            timeout: 10000,
            dataType: "json",
            success: weather,
            error: (xhr, textStatus) =>{
                console.log('error', xhr, textStatus);
            }
        });
    }
    $('.button').click(function (e) {
        e.preventDefault();
        if (currentUnit === "C") {
            currentUnit = "F"
            temp = (temp * 1.8) + 32;
            buttonText = "Celcius";
        } else {
            currentUnit = "C";
            temp = (temp - 32) / 1.8;
            buttonText = "Fahrenheit";
        }
        $('#animate').playKeyframe({
            name: 'flipInX',
            duration: '.5s',
            fillMode: 'both',
            complete: () =>{
                $('#animate').resetKeyframe();
            }
        })
        $('#unit').toggleClass('wi-celsius wi-fahrenheit');
        $('#temp').text(Number(temp).toFixed(1));
        $(this).text(buttonText);
        $(this).playKeyframe({
            name: 'flipInX',
            duration: '.5s',
            fillMode: 'both',
            complete: () =>{
                $(this).resetKeyframe();
            }
        })
    });
    function weather(response){
        console.log(response);
        temp = response.main.temp;
        iconClass = iconBuilder(response);
        $('.main i').attr("class", iconClass);
        $('#temp').text(Number(temp).toFixed(1));
        $('#unit').attr('class', 'wi wi-celsius');
        $('.wi-humidity span').text(" " + response.main.humidity + " %");
        $('.wi-sunrise span').text(" " + getTime(response.sys.sunrise));
        $('.wi-sunset span').text(" " + getTime(response.sys.sunset));
        $("#desc").text(response.weather[0].description);
        $('#location').text(response.name + ", " + response.sys.country);
        $('.jumbotron .row').show();
        $('.loader').hide();
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
    
    $.keyframe.define({
        name: 'flipInX',
        "0%": {
            'transform': 'perspective(400px) rotate3d(1, 0, 0, 90deg)',
            'animation-timing-function': 'ease-in',
            'opacity': '0'
        },
        '40%': {
            'transform': 'perspective(400px) rotate3d(1, 0, 0, -20deg)',
            'animation-timing-function': 'ease-in'
        },
        '60%': {
            'transform': 'perspective(400px) rotate3d(1, 0, 0, 10deg)',
            'opacity': '1'
        },
        '80%': {
            'transform': 'perspective(400px) rotate3d(1, 0, 0, -5deg)'
        },
        '100%': {
            'transform': 'perspective(400px)'
        }
    });
    
    function getTime(timestamp){
        var time = new Date(timestamp * 1000);
        return time.getHours().toString()+ ":" + time.getMinutes().toString();
    }
    return {
        run: run
    };
})(jQuery);
App.run();