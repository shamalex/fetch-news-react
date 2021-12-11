
import React from 'react';

export default function Input({ value, label, placeholder, type, onChange }) {
  const handleChange = (e) => {
    const { value } = e.target;
    onChange(value);
  };
  return (
    <div className="form-group">
      {label && <label htmlFor="input-field">{label}</label>}
      <input
        type={type}
        value={value}
        className="form-control"
        placeholder={placeholder}
        onChange={handleChange}
      />
    </div>
  );
};