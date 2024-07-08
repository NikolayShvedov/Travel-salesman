import React, { useState } from 'react';
import axios from 'axios';
import './AddressInput.css';

interface Address {
  value: string;
  label: string;
  lat: number;
  lon: number;
}

interface AddressInputProps {
  onAddressSelect: (address: Address) => void;
  isDisabled: boolean;
}

const AddressInput: React.FC<AddressInputProps> = ({ onAddressSelect, isDisabled }) => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Address[]>([]);

  const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);

    if (value.length > 2) {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${value}`);
      const addresses = response.data.map((item: any) => ({
        value: item.display_name,
        label: item.display_name,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
      }));
      setResults(addresses);
    } else {
      setResults([]);
    }
  };

  const handleSelectAddress = (address: Address) => {
    onAddressSelect(address);
    setQuery('');
    setResults([]);
  };

  return (
    <div className="address-input-container">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        disabled={isDisabled}
        placeholder="Введите адрес"
        className="address-input"
      />
      {results.length > 0 && (
        <ul>
          {results.map((address, index) => (
            <li key={index} onClick={() => handleSelectAddress(address)}>
              {address.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressInput;
