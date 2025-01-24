import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, Image, SafeAreaView, StatusBar, TextInput, TouchableOpacity, ScrollView} from 'react-native';
import {MagnifyingGlassIcon,XMarkIcon,MapPinIcon,CalendarDaysIcon} from "react-native-heroicons/outline";
import {debounce} from 'lodash';
import {locationApiCall} from "../api/weather";
import {forecastApiCall} from "../api/weather";
import {weatherImages} from "@/constants";
import * as Progress from 'react-native-progress';
import {getData, storeData} from "@/utils/asyncStorage";

export default function App() {

    const [showSearch, setShowSearch] = useState(false);
    const [locations, setLocations] = useState([]);
    const [weather,setWeather] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyWeatherData();
    },[]);

    const fetchMyWeatherData = async () => {
        const myCity = await getData('city');
        let cityName = '';
        if (!myCity) {
            cityName = 'Karachi'
        }
        else
        {
            cityName = myCity;
        }
        forecastApiCall(cityName,7).then(response => {
            setWeather(response);
            setLoading(false);
        });
    }

    const handleLocation = (location) => {
        setLocations([]);
        setShowSearch(false);
        setLoading(true);
        forecastApiCall(location,7).then(response => {
            setWeather(response);
            setLoading(false);
        });
        storeData('city', location);
    }

    const handleSearch = value => {
        if (value.length > 2){
            locationApiCall(value).then(response => {
                setLocations(response);
            })
        }
    }

    const handleTextDebounce = useCallback(debounce(handleSearch,1200),[]);
    const {location,current} = weather;

    return (
        <View style={{flex: 1}}>
            <StatusBar style="light"/>
            <Image
                style={{height: '100%', width: '100%', position: 'absolute'}}
                blurRadius={70}
                source={require('../assets/images/bg.png')}
            />
            {loading ? (
                <View style={{flex:1, justifyContent:'center', alignItems: 'center'}}>
                    <Progress.CircleSnail thickness={10} color="#0bb3b2" size={150} />
                </View>
            ) : (
                <SafeAreaView style={{display: 'flex', flex: 1}}>
                    <View style={{height: '7%', margin: 30}}>
                        <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: showSearch ? 'rgba(255, 255, 255,1)' : 'transparent',
                            opacity: 0.2,
                            borderRadius: 20,
                            padding: 5
                        }}>
                            {showSearch ? (
                                <TextInput onChangeText={handleTextDebounce} style={{color:'black',paddingLeft: 10, fontSize: 16}} placeholder={'Search city'}
                                           placeholderTextColor={'black'}/>
                            ) : null}
                            <TouchableOpacity onPress={() => setShowSearch(!showSearch)}
                                              style={{backgroundColor: 'white', padding: 10, borderRadius: '100%'}}>
                                {showSearch ? (<XMarkIcon size={25} color={'black'}/>) : (<MagnifyingGlassIcon size={25} color={'black'}/>)}
                            </TouchableOpacity>
                        </View>
                        {showSearch ? (
                            <View style={{backgroundColor: 'rgba(255, 255, 255,1)',borderRadius:20,marginTop:10,zIndex:40}}>
                                {
                                    locations.map((loc, index) => {
                                        const isLastElement = index === locations.length - 1;
                                        return (
                                            <TouchableOpacity onPress={()=> handleLocation(loc.name)} style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                borderBottomWidth: isLastElement ? 0 : 1,
                                                borderBottomColor: 'black',
                                                padding: 8
                                            }} key={index}>
                                                <MapPinIcon size={25} color={'black'}/>
                                                <Text style={{fontSize:18,marginLeft:5,color:'black'}}>{loc.name},{loc.country}</Text>
                                            </TouchableOpacity>
                                        )})}
                            </View>
                        ): null}

                    </View>
                    {/*Forecast Section*/}
                    <View style={{flex:1,flexDirection:'column',justifyContent:'space-evenly'}}>
                        <View style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                            <Text style={{color:'white',fontSize:30}}>{location?.name + ", "}<Text style={{fontSize:25,fontWeight:'bold'}}>{location?.country}</Text></Text>
                            <Image style={{height:200,width:200,marginTop:30}} source={weatherImages[current?.condition?.text]}/>
                        </View>
                        <View style={{display:'flex',alignItems:'center'}}>
                            <Text style={{color:'white',fontSize:70,marginBottom:10}}>{current?.temp_c}&#176;</Text>
                            <Text style={{color:'white',fontSize:25,fontWeight:'bold'}}>{current?.condition.text}</Text>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                            <View style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                                <Image style={{height:20,width:20,marginHorizontal:5}} source={require('../assets/icons/wind.png')}/>
                                <Text style={{color:'white',fontSize:18}}>{current?.wind_kph}Km</Text>
                            </View>
                            <View style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                                <Image style={{height:20,width:20,marginHorizontal:5}} source={require('../assets/icons/drop.png')}/>
                                <Text style={{color:'white',fontSize:18}}>{current?.humidity}%</Text>
                            </View>
                            <View style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                                <Image style={{height:20,width:20,marginHorizontal:5}} source={require('../assets/icons/sun.png')}/>
                                <Text style={{color:'white',fontSize:18}}>{weather?.forecast?.forecastday[0]?.astro?.sunrise}</Text>
                            </View>
                        </View>
                        <View style={{display:'flex',flexDirection:'column',marginHorizontal:10}}>
                            <View style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                                <CalendarDaysIcon size={25} color={'white'}/>
                                <Text style={{marginLeft:10,color:'white',fontSize:16}}>Daily Forecast</Text>
                            </View>

                            <View style={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:10}}>
                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                    {weather?.forecast?.forecastday.map((item,index) => {
                                        let date = new Date(item.date);
                                        let options = {weekday:'long'}
                                        let day = date.toLocaleDateString('en-US',options);
                                        return (
                                            <View key={index} style={{display:'flex',flexDirection:'column',alignItems:'center',backgroundColor: 'rgba(255, 255, 255, 0.2)',borderRadius:20,padding:15,marginHorizontal:10}}>
                                                <Image style={{height:40,width:40}} source={weatherImages[item?.day?.condition?.text]}/>
                                                <Text style={{color:'white'}}>{day}</Text>
                                                <Text style={{color:'white',fontWeight:'bold',fontSize:18,marginTop:5}}>{item?.day?.avgtemp_c}&#176;</Text>
                                            </View>
                                        )
                                    })}
                                </ScrollView>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            )}
        </View>
    );
}
