import React from 'react';
import './AddressList.css';

interface Address {
  value: string;
  label: string;
  lat: number;
  lon: number;
}

interface AddressListProps {
  addresses: Address[];
  onRemove: (index: number) => void;
}

const AddressList: React.FC<AddressListProps> = ({ addresses, onRemove }) => {
  return (
    <div className="address-list">
      {addresses.map((address, index) => (
        <div key={index} className="address-item">
          <span className="address-number">{index + 1}.</span>
          <span className="address-label">{address.label}</span>
          {index === 0 && <span className="start-end-label">(Старт/Финиш)</span>}
          <button onClick={() => onRemove(index)}>Удалить</button>
        </div>
      ))}
    </div>
  );
};

export default AddressList;