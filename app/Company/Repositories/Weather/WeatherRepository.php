<?php
namespace Company\Repositories\Weather;

use Company\Interfaces\Weather\WeatherInterface;

/**
 * Class WeatherRepository
 * @package Company\Repositories\Weather
 */
class WeatherRepository implements WeatherInterface
{
    /**
     * @var string
     */
    const API_URL = "http://query.yahooapis.com/v1/public/yql";

    /**
     * Get the weather by zip code.
     *
     * @param $zip
     * @return bool|mixed
     */
    public function getWeatherByZipCode($zip)
    {
        return $this->makeWeatherRequest($zip);
    }

    /**
     * Create the url to make the weather request.
     *
     * @param $query
     * @return string
     */
    private function createWeatherEndpointUrl($query)
    {
        return static::API_URL . "?q=" . urlencode($query) . "&format=json";
    }

    /**
     * Create the weather url query.
     *
     * @param $zip
     * @return string
     */
    private function createWeatherQuery($zip)
    {
        return '
            SELECT *
            FROM weather.forecast
            WHERE woeid
            IN (
                SELECT woeid
                FROM geo.places(1)
                WHERE text="' . $zip . '"
            )
        ';
    }

    /**
     * Send request to get the weather by zip code.
     *
     * @param $zip
     * @return bool|mixed
     */
    private function makeWeatherRequest($zip)
    {
        $session = curl_init($this->createWeatherEndpointUrl($this->createWeatherQuery($zip)));
        curl_setopt($session, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($session);
        $info = curl_getinfo($session);
        curl_close($session);

        if ($info['http_code'] == 200) {
            return json_decode($response);
        } else {
            return false;
        }
    }
}
