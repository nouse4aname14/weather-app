<?php
namespace Api\Controllers;

use Company\Interfaces\Weather\WeatherInterface;
use Illuminate\Support\Facades\Response;

/**
 * Class WeatherController
 * @package Api\Controllers
 */
class WeatherController extends BaseController
{
    /**
     * @var array
     */
    public static $citiesZipArray = [
        'irvine' => '92604',
        'corona' => '92879',
        'riverside' => '92504'
    ];

    /**
     * @var \Company\Interfaces\Weather\WeatherInterface
     */
    protected $weather;

    /**
     * @param WeatherInterface $weather
     */
    public function __construct(WeatherInterface $weather)
    {
        $this->weather = $weather;
    }

    /**
     * Display weather information by city.
     * GET /weather/{city}
     *
     * @param $city
     * @return \Illuminate\Http\Response|string
     */
    public function index($city)
    {
        if ($this->isValidCity($city)) {
            $weatherInformation = $this->weather->getWeatherByZipCode(static::$citiesZipArray[$city]);
            if ($weatherInformation !== false) {
                return Response::make(json_encode($weatherInformation), 200);
            } else {
                return $this->resourceNotFound();
            }
        } else {
            return Response::make(json_encode(['message' => 'This city is not available in this application.']), 404);
        }
    }

    /**
     * Verify that the submitted city is in our list.
     *
     * @param $city
     * @return bool
     */
    public static function isValidCity($city)
    {
        return array_key_exists($city, static::$citiesZipArray);
    }

    /**
     * Create a resource not found message.
     *
     * @return Response
     */
    public function resourceNotFound()
    {
        return Response::make(json_encode(['message' => 'Resource not found.']), 404);
    }
}
