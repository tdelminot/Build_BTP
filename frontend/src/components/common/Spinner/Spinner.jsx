import React from 'react';
import './Spinner.css';

export const Spinner = ({ size = 'md', color = 'primary', className = '' }) => {
  const classes = [
    'spinner',
    `spinner-${size}`,
    `spinner-${color}`,
    className
  ].filter(Boolean).join(' ');

  return <div className={classes}></div>;
};