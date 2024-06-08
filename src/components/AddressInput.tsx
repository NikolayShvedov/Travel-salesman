import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';
import axios from 'axios';

interface Address {
  value: string;
  label: string;
  lat: number;
  lon: number;
}

const AddressInput: React.FC<{ onAddressSelect: (address: Address) => void; isDisabled: boolean }> = ({ onAddressSelect, isDisabled }) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState<Address | null>(null);

  const loadOptions = (inputValue: string, callback: (options: Address[]) => void) => {
    if (inputValue.length < 3) return;
    axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${inputValue}`)
      .then(response => {
        const options = response.data.map((item: any) => ({
          value: item.display_name,
          label: item.display_name,
          lat: item.lat,
          lon: item.lon,
        }));
        callback(options);
      });
  };

  const handleSelectChange = (value: Address | null) => {
    if (value) {
      onAddressSelect(value);
      setSelectedOption(null); // Clear the selected option
    }
  };

  return (
    <AsyncSelect
      cacheOptions
      loadOptions={loadOptions}
      onInputChange={(value) => setInputValue(value)}
      onChange={handleSelectChange}
      value={selectedOption}
      isDisabled={isDisabled}
    />
  );
};

export default AddressInput;
