<?php
namespace Company\Interfaces\Weather;

/**
 * Interface WeatherInterface
 * @package Company\Interfaces\Weather
 */
interface WeatherInterface
{
    /**
     * @param $zip
     * @return mixed
     */
    public function getWeatherByZipCode($zip);

    /**
     * @param array $zipCodes
     * @return mixed
     */
    public function getWeatherByArrayOfZipCodes(array $zipCodes);
}
