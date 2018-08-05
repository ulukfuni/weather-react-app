import React from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';
import styled from 'styled-components';

const AutoCompleteContainer = styled.div`
  border: 1px solid black;
  z-index: 10000;
  position: absolute;
  background-color: #ffffff;
`;

const LocationSearchInput = (props) => {
  const { value, onChange, onSelect } = props;

  return (
    <div className="d-inline-block">
      <label htmlFor="places-autocomplete">Enter City Name:</label>
      <PlacesAutocomplete
        id="places-autocomplete"
        onChange={onChange}
        value={value}
        onSelect={onSelect}
        shouldFetchSuggestions={value.length > 2}>
        {({ getInputProps, suggestions, getSuggestionItemProps }) => {
          return (
            <div className="search-bar-container">
              <div className="search-input-container">
                <input
                  {...getInputProps({
                    placeholder: 'Search Cities',
                    className: 'search-input',
                  })}
                />
              </div>
              {suggestions.length > 0 && (
                <AutoCompleteContainer>
                  {suggestions.map(suggestion => {
                    return (
                      <div {...getSuggestionItemProps(suggestion)}>
                        <strong>{suggestion.formattedSuggestion.mainText}</strong>
                        {' '}
                        <small>{suggestion.formattedSuggestion.secondaryText}</small>
                      </div>
                    );
                  })}
                </AutoCompleteContainer>
              )}
            </div>
          );
        }}
      </PlacesAutocomplete>
    </div>
  );
}

export default LocationSearchInput;