import React from 'react';
import styled from 'styled-components';

const Span = styled.span`
    font-size: 22px;
    margin: 5px;
    font-weight: bold;
    display: inline-block;
`;

const WeatherSpan = styled.span`
    font-style: italic;
`;

const borderBottom = {
    borderBottom: '1px solid grey'
}

const NoMarginP = styled.p`
    margin-bottom: 0;
`;

const ForecastContents = (props) => {
    let { data, today } = props;
    return(
        <div style={today ? null : borderBottom} className="row">
            <div className="col">
                <NoMarginP>{today && 'Today'}{!today && `${data.day} ${data.date}`}</NoMarginP>
                <WeatherSpan>{data.text}</WeatherSpan>
            </div>
            <div className="col">
                <Span>High: {data.high}</Span>
                <Span>Low: {data.low}</Span>
            </div>
        </div>
    )
}

export default ForecastContents;