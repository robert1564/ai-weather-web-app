import React from 'react'
import { getClient } from '@/apollo-client'
import fetchWeatherQuery from '@/graphql/queries/fetchWeatherQueries';
import CalloutCard from '@/components/CalloutCard';
import StatCard from '@/components/StatCard';
import InformationPanel from '@/components/InformationPanel';
import TempChart from '@/components/TempChart';
import RainChart from '@/components/RainChart';
import HumidityChart from '@/components/HumidityChart';
import getBasePath from '@/lib/getBasePath';
import cleanData from '@/lib/cleanData';

export const revalidate = 1440;

type Props = {
    params: {
        city: string;
        lat: string;
        long: string;
    }
}

async function WeatherPage({params: {city, lat, long}}: Props) {

    const client = getClient();

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    

    const { data } = await client.query({
        query: fetchWeatherQuery,
        variables:{
            current_weather: "true",
            longitude: long,
            latitude: lat,
            timezone: timezone,
        }
    })

    const results: Root = data.myQuery;

    const dataToSend = cleanData(results, city);

    const res = await fetch(`${getBasePath()}/api/getWeatherSummary`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            weatherData: dataToSend
        }),
    })

    if (res.ok) {
        const GPTdata = await res.json();
        const { content } = GPTdata;

        return (
            <div className='flex flex-col min-h-screen md:flex-row'>
                <InformationPanel 
                city={city}
                lat={lat}
                long={long}
                results={results} 
                />
        
                <div className='flex-1 p-5 lg:p-10'>
                    <div className='p-5'>
                        <div className='pb-5'>
                            <h2 className='text-xl font-bold'>Todays Overview</h2>
                            <p className='text-sm text-gray-400'>Last Updated At: {" "}
                                {new Date(results.current_weather.time).toLocaleString()} ({results.timezone})
                            </p>
                        </div>
        
                    <div className="m-2 mb-10">
                        <CalloutCard message={content} />
                    </div>
        
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 m-2">
                        <StatCard 
                            title="Maximum Temperature"
                            metric={`${results.daily.temperature_2m_max[0].toFixed(1)}°C`}
                            color="yellow"
                        />
                        <StatCard 
                            title="Minimum Temperature"
                            metric={`${results.daily.temperature_2m_min[0].toFixed(1)}°C`}
                            color="green"
                        />
        
                        <div>
                            <StatCard 
                                title="UV Index"
                                metric={results.daily.uv_index_max[0].toFixed(1)}
                                color="rose"
                            />
                            {Number(results.daily.uv_index_max[0].toFixed(1)) > 5 && (
                                <CalloutCard 
                                    message={"The UV is high today, be sure to wear SPF!"}
                                    warning
                                />
                            )}
                        </div>
        
                        <div className='flex space-x-3'>
                            <StatCard 
                                title="Wind Speed"
                                metric={`${results.current_weather.windspeed.toFixed(1)} km/s`}
                                color="cyan"
                            />
        
                            <StatCard 
                                title="Wind Direction"
                                metric={`${results.current_weather.winddirection.toFixed(1)}°`}
                                color="violet"
                            />
                        </div>
                    </div>
                    </div>
        
                    <hr className='mb-5'/>
        
                    <div className="space-y-3">
                        <TempChart 
                        results={results}
                        />
                        <RainChart 
                        results={results}
                        />
                        <HumidityChart 
                        results={results}
                        />
                    </div>
                </div>
            </div>
          )
    } else {
        return (
            <div className='flex flex-col min-h-screen md:flex-row'>
                <InformationPanel 
                city={city}
                lat={lat}
                long={long}
                results={results} 
                />
        
                <div className='flex-1 p-5 lg:p-10'>
                    <div className='p-5'>
                        <div className='pb-5'>
                            <h2 className='text-xl font-bold'>Todays Overview</h2>
                            <p className='text-sm text-gray-400'>Last Updated At: {" "}
                                {new Date(results.current_weather.time).toLocaleString()} ({results.timezone})
                            </p>
                        </div>
                        
                        <CalloutCard message="ChatGPT API is not started or is out of credit." warning/>
        
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 m-2">
                        <StatCard 
                            title="Maximum Temperature"
                            metric={`${results.daily.temperature_2m_max[0].toFixed(1)}°C`}
                            color="yellow"
                        />
                        <StatCard 
                            title="Minimum Temperature"
                            metric={`${results.daily.temperature_2m_min[0].toFixed(1)}°C`}
                            color="green"
                        />
        
                        <div>
                            <StatCard 
                                title="UV Index"
                                metric={results.daily.uv_index_max[0].toFixed(1)}
                                color="rose"
                            />
                            {Number(results.daily.uv_index_max[0].toFixed(1)) > 5 && (
                                <CalloutCard 
                                    message={"The UV is high today, be sure to wear SPF!"}
                                    warning
                                />
                            )}
                        </div>
        
                        <div className='flex space-x-3'>
                            <StatCard 
                                title="Wind Speed"
                                metric={`${results.current_weather.windspeed.toFixed(1)}km/s`}
                                color="cyan"
                            />
        
                            <StatCard 
                                title="Wind Direction"
                                metric={`${results.current_weather.winddirection.toFixed(1)}°`}
                                color="violet"
                            />
                        </div>
                    </div>
                    </div>
        
                    <hr className='mb-5'/>
        
                    <div className="space-y-3">
                        <TempChart 
                        results={results}
                        />
                        <RainChart 
                        results={results}
                        />
                        <HumidityChart 
                        results={results}
                        />
                    </div>
                </div>
            </div>
          )
    }

    
 
}

export default WeatherPage