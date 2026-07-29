import React, { forwardRef } from 'react';
import './DatePicker.css';

export const DatePicker = forwardRef(({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  disabled = false,
  className = '',
  minDate = '',
  maxDate = '',
  ...props
}, ref) => {
  const classes = [
    'datepicker-wrapper',
    error && 'datepicker-error',
    disabled && 'datepicker-disabled',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {label && (
        <label className="datepicker-label" htmlFor={name}>
          {label}
          {required && <span className="datepicker-required">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={name}
        name={name}
        type="date"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        min={minDate}
        max={maxDate}
        className="datepicker-field"
        {...props}
      />
      {error && <span className="datepicker-error-message">{error}</span>}
    </div>
  );
});

DatePicker.displayName = 'DatePicker';