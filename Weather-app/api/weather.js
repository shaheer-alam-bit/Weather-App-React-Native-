import axios from 'axios';
import {apiKey} from "../constants";

// const forecastEndpoint = params => `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.cityName}&days=${params.days}&aqi=no&alerts=no`;
// const locationsEndpoint = params => `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${params.cityName}`;

export const forecastApiCall = async(cityName,days) => {
    try {
        const forecastData = await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityName}&days=${days}&aqi=no&alerts=no`)
        return forecastData.data;
    } catch (e) {
        console.log("error in fetching data ", e);
        return null;
    }
}

export const locationApiCall = async(cityName) => {
    try {
        const locationData = await axios.get(`https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${cityName}`)
        return locationData.data;
    } catch (e) {
        console.log("error in fetching data ", e);
        return null;
    }
}