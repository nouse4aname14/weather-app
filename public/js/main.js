var Weather = Weather || {};

$(function() {
    (function(weatherForm) {
        "use strict";

        weatherForm = {};
        weatherForm.request = {};

        // Initialize the setup.
        weatherForm.init = function() {
            weatherForm.setSelectors();
            weatherForm.setEvents();
        };

        // Set available selectors at run time.
        weatherForm.setSelectors = function() {
            weatherForm.button = $('.btn-search');
            weatherForm.citySelectorContainer = $('.city-selector-container');
            weatherForm.citySelector = $('#city-selector');
            weatherForm.selectedCity = weatherForm.citySelector.find(':selected').val();
        };

        // Set up events.
        weatherForm.setEvents = function() {
            weatherForm.button.click(function() {
                var city = weatherForm.updateSelectedCity();

                if (city != '' && city != 'Select a city') {
                    weatherForm.showSpinner(true);
                    weatherForm.request.getWeatherByCity(city);
                } else {
                    weatherForm.setError('Error, you must select a city.');
                }
            });

            weatherForm.updateSelectedCity = function() {
                return weatherForm.citySelector.find(':selected').val();
            };
        };

        // Show or hide loading spinner.
        weatherForm.showSpinner = function(boolean) {
            var spinner;

            if (boolean) {
                $('body').append('<div class="container spinner"><div class="center-throbber"><div class="throbber">Loading...</div></div></div>');
            } else if (!boolean && (spinner = $('.container.spinner'))) {
                spinner.remove();
            }
        };

        // Set error message.
        weatherForm.setError = function(message) {
            weatherForm.citySelectorContainer
                .prepend('<div class="alert alert-danger" role="alert">' + message + '</div>');

            setTimeout(function() {
                $('.alert').fadeOut();
            }, 1500);
        };

        // Create the results layout.
        weatherForm.createResultsLayout = function(data) {
            var response = JSON.parse(data).query.results.channel;
            var titleImage = '<a href="' + response.image.link + '" target="_blank"> <img src="' + response.image.url + '" alt="' + response.image.title + '" height="' + response.image.height + '" width="' + response.image.width + '" title="' + response.image.title + '" /></a>';
            var metaInfo = '<h3>Meta Info:</h3><b>Language: </b>' + response.language + '<br /><b>Last Build Date: </b>' + response.lastBuildDate + '<br/><b>TTL: </b>' + response.ttl + '<br/><b>Title: </b>' + response.item.title + '<br/><b>Lat: </b>' + response.item.lat + '<br/><b>Long: </b>' + response.item.long + '<br/><b>Guid Is Permalink: </b>' + response.item.guid.isPermaLink + '<br/><b>Guid Content: </b>' + response.item.guid.content;
            var titleSection = '<div class="row"><div class="col-lg-6"><h2>' + response.title + '</h2>' + response.item.description + '</div><div class="col-lg-6">' + titleImage + metaInfo +'</div></div>';
            var fiveColumnSection = '<div class="row">' + weatherForm.createColumnItem(5, 'Location', response.location) + weatherForm.createColumnItem(5, 'Units', response.units) + weatherForm.createColumnItem(5, 'Wind', response.wind) + weatherForm.createColumnItem(5, 'Atmosphere', response.atmosphere) + weatherForm.createColumnItem(5, 'Astronomy', response.astronomy) + '</div>';
            var container = '<div id="results" class="container">' + titleSection + fiveColumnSection + '</div>';

            $('body').append(container);
            console.log(response);
        };

        // Create a column item.
        weatherForm.createColumnItem = function(type, title, items) {
            var list = "";
            var columnClass = type == 5 ? 'col-md-2' : 'col-lg-6';

            for (var key in items) {
                list += "<b>" + key + ":</b> " + items[key] + "<br />";
            }

            return '<div class="' + columnClass + '"><h3>' + title +  '</h3>' + list + '</div>';
        };

        // Make request to get the weather by city.
        weatherForm.request.getWeatherByCity = function(city) {
            $.ajax({
                type: "GET",
                url: "/weather/" + city,
                success: function(data) {
                    $('#results').remove();
                    weatherForm.createResultsLayout(data);
                    weatherForm.showSpinner(false);
                },
                error: function() {
                    weatherForm.setError('An error occurred while processing the request.');
                }
            });
        };

        return(weatherForm.init());

    }) (Weather);
});
