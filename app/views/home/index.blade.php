@extends('layouts.main')

@section('content')
    <div class="jumbotron">
        <h1>{{ $title }}</h1>
        <p class="lead">Find the latest weather forecast for each city by selecting a city from the drop down menu and clicking search. Hold down the Ctrl (windows) / Command (Mac) button to select multiple options.</p>
        <div class="city-selector-container">
            <select multiple id="city-selector" class="form-control input-lg">
                @foreach ($cities as $key => $city)
                <option value="{{ $key }}">{{ ucfirst($key) }}</option>
                @endforeach
            </select>
        </div>
        <br />

        <div class="btn-group">
            <button type="button" class="btn btn-lg btn-success btn-search">Search</button>
        </div>
    </div>
@stop
