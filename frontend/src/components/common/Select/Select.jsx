import React, { forwardRef } from 'react';
import './Select.css';

export const Select = forwardRef(({
  label,
  name,
  options = [],
  placeholder = 'Sélectionner...',
  value,
  onChange,
  onBlur,
  error,
  required = false,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  const classes = [
    'select-wrapper',
    error && 'select-error',
    disabled && 'select-disabled',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {label && (
        <label className="select-label" htmlFor={name}>
          {label}
          {required && <span className="select-required">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className="select-field"
        {...props}
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="select-error-message">{error}</span>}
    </div>
  );
});

Select.displayName = 'Select';