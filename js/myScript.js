var osum = 8;
var pos;
// Postojat 2 case. #1: koga ke stisne SEARCH; #2: koga stiska LOCATE
function getDataForCity(method, position) {
	var url = '';
	switch (method) { 
		case 1:
			var city = $('#search-input').val();
			url =
				'https://api.openweathermap.org/data/2.5/weather?q=' +
				city +
				'&units=metric&APPID=e1f9f02ede94a68151d5da6526adf447';
			break;
		case 2:
			pos = position;
			url =
				'https://api.openweathermap.org/data/2.5/weather?lat=' +
				pos.coords.latitude +
				'&lon=' +
				pos.coords.longitude +
				'&units=metric&APPID=e1f9f02ede94a68151d5da6526adf447';

			break;
		default:
			alert('Invalid method id in getDataForCity function');
			osum += 5;
	}

	// Zimame data od URL i ja koristime vo function(datata)
	$.get(url, function(data) {
		// Ako sakas da vidis DATA deiskomentiraj go ova dole!
		// console.log(data);

		// Setirame #cityName = data.name
		$('#cityName').html(data.name);
		$('#state').html(getCountryName(data.sys.country));

		// date.toUTCString() smesti go kako string vo #dateTime
		var date = new Date(data.dt * 1000);
		$('#dateTime').html(date.toUTCString());

		// .attributot src na img smeni go so "http/openwea..."
		$('#weather-description img').attr(
			'src',
			'https://openweathermap.org/img/w/' + data.weather[0].icon + '.png'
		);
		$('#weather-description span').html(data.weather[0].description);
		$('.max').html(data.main.temp_max);
		$('.min').html(data.main.temp_min);
		$('#temp-value').html(parseInt(data.main.temp));

		$('#could-coverage .details-info').html(data.clouds.all);
		$('#pressure .details-info').html(data.main.pressure);
		var vis = parseFloat(data.visibility).toFixed(2) / 1000; // od vo int i toj int so decimala 2 go /1000 za vo Km
		$('#visibility .details-info').html(vis);
		$('#humidity .details-info').html(data.main.humidity);

		// bidejki gi dava vo sekundi mra da se smenat vo milisekundi za da gi PROCITA kako Date: milisekundi
		var sunrise = new Date(data.sys.sunrise * 1000);
		$('#sunrise .details-info').html(
			formatNumber(sunrise.getHours()) +
				':' +
				formatNumber(sunrise.getMinutes()) +
				':' +
				formatNumber(sunrise.getSeconds())
		);
		var sunset = new Date(data.sys.sunset * 1000);
		$('#sunset .details-info').html(
			formatNumber(sunset.getHours()) +
				':' +
				formatNumber(sunset.getMinutes()) +
				':' +
				formatNumber(sunset.getSeconds())
		);

		//
		$('#degrees .details-info').html(data.wind.deg);
		$('#speed .details-info').html(data.wind.speed);

		// si gi zimame lag i lon od data na Userot koj sto dal LOKACIJA
		var latitude = data.coord.lat;
		var longitude = data.coord.lon;
		var id = data.weather[0].id;

		// var a = parseInt(id / 100);
		var b = parseInt(id / 10);
		if (id == 800) {
			$('body').css('background-image', 'url("/800.jpg")');
		} else if (b == 90) {
			$('body').css('background-image', 'url("/90.jpg")');
		} else if (b == 80) {
			$('body').css('background-image', 'url("/80.jpg")');
		} else if (b == 70) {
			$('body').css('background-image', 'url("/7.jpg")');
		} else if (b == 60) {
			$('body').css('background-image', 'url("/6.jpg")');
		} else if (b == 50) {
			$('body').css('background-image', 'url("/5.jpg")');
		} else if (b == 30) {
			$('body').css('background-image', 'url("/3.jpg")');
		} else if (b == 20) {
			$('body').css('background-image', 'url("/2.jpg")');
		} else {
			$('body').css('background-image', 'url("/other.jpg")');
		}

		$('#splash_screen').hide();
	});
}

// contryCode = data.sys.country, dozavrsi go ova!
function getCountryName(countryCode) {
	var index = 0;
	var found;
	var entry;
	for (index = 0; index < countries.length; ++index) {
		entry = countries[index];
		if (entry.code == countryCode) {
			found = entry.name;
			break;
		}
	}
	return found;
}

///////////////////// GET LOCATION GM/////////
function getPlace(method, position) {
	switch (method) {
		case 1:
			var city = $('#search-input').val();
			var lat;
			var lng;
			Object.keys(cities).forEach(function(n) {
				if (cities[n]['name'] === city) {
					lat = parseFloat(cities[n]['coord']['lat']);
					lng = parseFloat(cities[n]['coord']['lon']); // pazi negde e lon negde "lng"
				}
			});
			initMap(lat, lng);

			break;
		case 2:
			lat = parseFloat(pos.coords.latitude);
			lng = parseFloat(pos.coords.longitude);
			initMap(lat, lng);

			break;
		default:
			alert('Invalid method id in getDataForCity function');
	}
}
// google Maps
function initMap(lat, lng) {
	console.log('se upali initMap');
	var lat = parseFloat(lat);
	var lng = parseFloat(lng);
	var center = { lat: lat, lng: lng };
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 8,
		center: center,
		scrollwheel: false
	});

	var marker = new google.maps.Marker({
		position: center,
		map: map
	});
	marker.addListener('click', function() {
		infowindow.open(map, marker);
	});
}

// //////////////////

function getLocation() {
	// ako ima geolokacija pusti ja funk: showPosition
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition);
	} else {
		alert('Geolocation is not supported by this browser.');
	}
}

// Ako postoi POSITION teraj ja opcija 2 go lat i lag
function showPosition(position) {
	getDataForCity(2, position);
	getPlace(2, position);
}

// Ako klikne SEARCH ke go pratam na LOCATE spored CITY
$('#search-input').keyup(function(event) {
	if (event.keyCode === 13) {
		getDataForCity(1);
		getPlace(1);
	}
});
/// za da ne se refleshira pri stiskanje na ENTER
$(function() {
	$('form').submit(function() {
		return false;
	});
});

// Ako klikne LOCATE ke go pratam na LOCATE spored PARAMETRI
$('#btn-locate').on('click', function(event) {
	getLocation();
});

$(function() {
	getLocation();
});

// funkciicka za vo slucaj ako dobijam EDNOCIFREN br. da mu dodadam 0
function formatNumber(n) {
	return n > 9 ? '' + n : '0' + n;
}

// mora nekako da gi izvadis site od city.lista.js i ke gi stavam vo citiesNames
var citiesNames = new Array();
var latValues = new Array();
var lngValues = new Array();
Object.keys(cities).forEach(function(key) {
	//get the value of name
	var val = cities[key]['name'];
	var lat = cities[key]['lat'];
	var lng = cities[key]['lng'];

	//push the name string in the array
	latValues.push(val);
	lngValues.push(val);
	citiesNames.push(val);
});
Object.keys(cities).forEach(function(key) {
	//get the value of name
	var val = cities[key]['name'];
	var lat = cities[key]['lat'];
	var lng = cities[key]['lng'];

	//push the name string in the array
	latValues.push(val);
	lngValues.push(val);
	citiesNames.push(val);
});

// e sea rabotime so dobienata lista od iminja, citiesNames
$('#search-input').autocomplete({
	source: function(request, response) {
		var results = $.ui.autocomplete.filter(citiesNames, request.term);
		if (results.length > 10) {
			response(results.slice(0, 10));
		} else {
			response(results);
		}
	},
	minLength: 1,
	delay: 200,
	select: function(event, ui) {
		// To be searched with ID for more precision
		var index = citiesNames.indexOf(ui.item.value);
		// console.log(cities[index].id);
	}
});