<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

Route::get('/', function() {
    return View::make('home.index')
        ->with('cities', \Api\Controllers\WeatherController::$citiesZipArray)
        ->with('title', 'Weather App');
});

Route::group(array('prefix' => 'weather'), function() {
    Route::get('/{city}', '\Api\Controllers\WeatherController@index');
});
