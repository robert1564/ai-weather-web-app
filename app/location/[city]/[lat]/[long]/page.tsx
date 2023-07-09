import React from 'react'
import { getClient } from '@/apollo-client'
import fetchWeatherQuery from '@/graphql/queries/fetchWeatherQueries';

type Props = {
    params: {
        city: string;
        lat: string;
        long: string;
    }
}

async function WeatherPage({params: {city, lat, long}}: Props) {
    const client = getClient();

    const { data } = await client.query({
        query: fetchWeatherQuery,
        variables:{
            current_weather: "true",
            longitude: long,
            latitude: lat,
            timezone: "GMT",
        }
    })

    const results: Root = data.myQuery;

    console.log(results);

  return (
    <div>
        {/* <InformationPanel /> */}


        <div>
            <div className='p-5'>
                <div className='pb-5'>
                    <h2 className='text-xl font-bold'>Todays Overview</h2>
                    <p className='text-sm text-gray-400'>Last Updated At: {" "}
                        {new Date(results.current_weather.time).toLocaleString()} ({results.timezone})
                    </p>
                </div>

            <div>

            </div>
            {/* CalloutCard */}
            </div>

        </div>
    </div>
  )
}

export default WeatherPage