import React from 'react';

interface Address {
  value: string;
  label: string;
  lat: number;
  lon: number;
}

const AddressList: React.FC<{ addresses: Address[], onRemove: (index: number) => void }> = ({ addresses, onRemove }) => {
  return (
    <div>
      <ul>
        {addresses.map((address, index) => (
          <li key={index}>
            {address.label} <button onClick={() => onRemove(index)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddressList;