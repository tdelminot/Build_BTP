import React, { useState } from 'react';
import './SearchBar.css';

export const SearchBar = ({
  placeholder = 'Rechercher...',
  onSearch,
  value = '',
  className = '',
  ...props
}) => {
  const [searchValue, setSearchValue] = useState(value);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchValue);
  };

  const handleChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleClear = () => {
    setSearchValue('');
    onSearch('');
  };

  return (
    <form className={`search-bar ${className}`} onSubmit={handleSubmit} {...props}>
      <div className="search-bar-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchValue}
          onChange={handleChange}
        />
        {searchValue && (
          <button type="button" className="search-clear" onClick={handleClear}>
            ×
          </button>
        )}
      </div>
      <button type="submit" className="search-submit">
        Rechercher
      </button>
    </form>
  );
};