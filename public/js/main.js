var Weather = Weather || {};

$(function() {
    (function(page) {
        "use strict";

        page.weatherForm = {};
        page.weatherForm.request = {};

        // Initialize the setup.
        page.weatherForm.init = function() {
            page.weatherForm.setSelectors();
            page.weatherForm.setEvents();
        };

        // Set available selectors at run time.
        page.weatherForm.setSelectors = function() {
            page.weatherForm.button = $('.btn-search');
            page.weatherForm.citySelectorContainer = $('.city-selector-container');
            page.weatherForm.citySelector = $('#city-selector');
            page.weatherForm.selectedCity = page.weatherForm.citySelector.find(':selected').val();
        };

        // Set up events.
        page.weatherForm.setEvents = function() {
            page.weatherForm.button.click(function() {
                var cities = page.weatherForm.updateSelectedCity();

                if (cities != null) {
                    page.weatherForm.showSpinner(true);
                    page.weatherForm.request.getWeatherResults(cities);
                } else {
                    page.weatherForm.setError('Error, you must select a city.');
                }
            });

            page.weatherForm.updateSelectedCity = function() {
                return page.weatherForm.citySelector.val();
            };
        };

        // Show or hide loading spinner.
        page.weatherForm.showSpinner = function(boolean) {
            var spinnerContainer;
            var spinner = '<div class="container spinner"><div class="center-throbber"><div class="throbber">Loading...</div></div></div>';

            if (boolean) {
                $('#main').append(spinner);
            } else if (!boolean && (spinnerContainer = $('.container.spinner'))) {
                spinnerContainer.remove();
            }
        };

        // Set error message.
        page.weatherForm.setError = function(message) {
            page.weatherForm.citySelectorContainer
                .prepend('<div class="alert alert-danger" role="alert">' + message + '</div>');

            setTimeout(function() {
                $('.alert').fadeOut();
            }, 1500);
        };

        // Create the results layout.
        page.weatherForm.createResultsLayout = function(data) {
            var response = JSON.parse(data).query.results.channel;
            var rows = '';
            var counter = 1;

            if (response.length > 1) {
                for (var i = 0; i < response.length; i++) {
                    var titleImage = '<a href="' + response[i].image.link + '" target="_blank"> <img id="yimg" src="' + response[i].image.url + '" alt="' + response[i].image.title + '" height="' + response[i].image.height + '" width="' + response[i].image.width + '" title="' + response[i].image.title + '" /></a>';
                    var metaInfo = '<h3>Meta Info:</h3><b>Language: </b>' + response[i].language + '<br /><b>Last Build Date: </b>' + response[i].lastBuildDate + '<br/><b>TTL: </b>' + response[i].ttl + '<br/><b>Title: </b>' + response[i].item.title + '<br/><b>Lat: </b>' + response[i].item.lat + '<br/><b>Long: </b>' + response[i].item.long + '<br/><b>Guid Is Permalink: </b>' + response[i].item.guid.isPermaLink + '<br/><b>Guid Content: </b>' + response[i].item.guid.content;
                    var titleSection = '<div class="row"><div class="col-lg-6"><h2>' + response[i].title + '</h2>' + response[i].item.description + '</div><div class="col-lg-6">' + titleImage + metaInfo +'</div></div>';
                    var fiveColumnSection = '<div class="row">' + page.weatherForm.createColumnItem(5, 'Location', response[i].location) + page.weatherForm.createColumnItem(5, 'Units', response[i].units) + page.weatherForm.createColumnItem(5, 'Wind', response[i].wind) + page.weatherForm.createColumnItem(5, 'Atmosphere', response[i].atmosphere) + page.weatherForm.createColumnItem(5, 'Astronomy', response[i].astronomy) + '</div>';
                    var background = counter % 2 == 0 ? 'rowbg' : '';
                    rows += "<div class='section " + background + "'>" + titleSection + fiveColumnSection + "</div>";
                    counter++;
                }

                $('body').append('<div id="results" class="container">' + rows + '</div>');

            } else {
                var titleImage = '<a href="' + response.image.link + '" target="_blank"> <img id="yimg" src="' + response.image.url + '" alt="' + response.image.title + '" height="' + response.image.height + '" width="' + response.image.width + '" title="' + response.image.title + '" /></a>';
                var metaInfo = '<h3>Meta Info:</h3><b>Language: </b>' + response.language + '<br /><b>Last Build Date: </b>' + response.lastBuildDate + '<br/><b>TTL: </b>' + response.ttl + '<br/><b>Title: </b>' + response.item.title + '<br/><b>Lat: </b>' + response.item.lat + '<br/><b>Long: </b>' + response.item.long + '<br/><b>Guid Is Permalink: </b>' + response.item.guid.isPermaLink + '<br/><b>Guid Content: </b>' + response.item.guid.content;
                var titleSection = '<div class="row"><div class="col-lg-6"><h2>' + response.title + '</h2>' + response.item.description + '</div><div class="col-lg-6">' + titleImage + metaInfo +'</div></div>';
                var fiveColumnSection = '<div class="row">' + page.weatherForm.createColumnItem(5, 'Location', response.location) + page.weatherForm.createColumnItem(5, 'Units', response.units) + page.weatherForm.createColumnItem(5, 'Wind', response.wind) + page.weatherForm.createColumnItem(5, 'Atmosphere', response.atmosphere) + page.weatherForm.createColumnItem(5, 'Astronomy', response.astronomy) + '</div>';

                $('body').append('<div id="results" class="container">' + titleSection + fiveColumnSection + '</div>');
            }
        };

        // Create a column item.
        page.weatherForm.createColumnItem = function(type, title, items) {
            var list = "";
            var columnClass = type == 5 ? 'col-md-2' : 'col-lg-6';

            for (var key in items) {
                list += "<b>" + key + ":</b> " + items[key] + "<br />";
            }

            return '<div class="' + columnClass + '"><h3>' + title +  '</h3>' + list + '</div>';
        };

        // Make request to get the weather by city.
        page.weatherForm.request.getWeatherResults = function(city) {
            var url = '';

            if (city.length > 1) {
                url = "/weather/cities/" + city;
            } else {
                url = "/weather/" + city;
            }

            $.ajax({
                type: "GET",
                url: url,
                success: function(data) {
                    $('#results').remove();
                    page.weatherForm.createResultsLayout(data);
                    page.weatherForm.showSpinner(false);
                },
                error: function(xhr) {
                    page.weatherForm.setError(JSON.parse(xhr.responseText).message);
                    page.weatherForm.showSpinner(false);
                }
            });
        };

        return(page.weatherForm.init());

    }) (Weather);
});
