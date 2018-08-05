import React from 'react';
import ForecastContents from './ForecastContents';

const Forecast = (props) => {
    let forecast = [...props.forecast];
    forecast.splice(0,1);
    return forecast.map((f, i) => {
        if (i < 6) {
            return(
                <div key={i}>
                    <ForecastContents data={f}/>
                </div>
            )
        }
    })
}

export default Forecast;