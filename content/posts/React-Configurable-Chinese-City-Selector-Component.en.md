---
title: "React Configurable Chinese City Selector Component"
date: 2018-08-05T16:22:12+08:00
draft: false
description: "Configurable city list selector component based on React, supporting Chinese city data"
tags: ["React", "Component", "City Selection", "Frontend"]
categories: ["Frontend Development"]
featured: true
featuredImage: "cover-react.svg"
toc: true
translationKey: "react-city-selector-component"
---

### [react-city-select](https://github.com/w3cay/react-city-select)

A configurable city list selector component based on React

![](https://tva1.sinaimg.cn/large/008i3skNgy1gz8ur1zrpvj30hh0vbabp.jpg)

## Installation
```
npm i react-city-select or yarn add react-city-select
```

## Usage

### Basic Usage
```jsx
import React, { useState } from 'react';
import CitySelect from 'react-city-select';

function App() {
  const [selectedCity, setSelectedCity] = useState(null);

  const handleCityChange = (city) => {
    setSelectedCity(city);
    console.log('Selected city:', city);
  };

  return (
    <div>
      <CitySelect
        onCityChange={handleCityChange}
        placeholder="Please select a city"
      />
      {selectedCity && (
        <p>Selected: {selectedCity.province} - {selectedCity.city}</p>
      )}
    </div>
  );
}
```

### Advanced Configuration
```jsx
import React, { useState } from 'react';
import CitySelect from 'react-city-select';

function App() {
  const [selectedCity, setSelectedCity] = useState(null);

  const handleCityChange = (city) => {
    setSelectedCity(city);
  };

  return (
    <CitySelect
      onCityChange={handleCityChange}
      placeholder="Select your city"
      showSearch={true}
      showHotCities={true}
      hotCities={['北京', '上海', '广州', '深圳', '杭州', '南京']}
      maxHeight={300}
      className="custom-city-selector"
      style={{ width: '300px' }}
    />
  );
}
```

## API Documentation

### Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `onCityChange` | `function` | - | Callback function when city selection changes |
| `placeholder` | `string` | `'Please select a city'` | Placeholder text |
| `showSearch` | `boolean` | `false` | Whether to show search functionality |
| `showHotCities` | `boolean` | `false` | Whether to show hot cities section |
| `hotCities` | `array` | `[]` | Array of hot city names |
| `maxHeight` | `number` | `200` | Maximum height of the dropdown |
| `className` | `string` | `''` | Custom CSS class name |
| `style` | `object` | `{}` | Custom inline styles |
| `disabled` | `boolean` | `false` | Whether the component is disabled |
| `defaultValue` | `object` | `null` | Default selected city object |

### City Object Structure
```javascript
{
  province: '广东省',
  city: '深圳市',
  district: '南山区',
  code: '440305'
}
```

### Callback Function
```javascript
function onCityChange(city) {
  // city object contains:
  // - province: Province name
  // - city: City name  
  // - district: District name (if available)
  // - code: City code
}
```

## Features

### 1. **Comprehensive City Data**
- **Complete coverage** - All provinces, cities, and districts in China
- **Accurate data** - Up-to-date administrative divisions
- **Hierarchical structure** - Province → City → District
- **Search functionality** - Find cities quickly

### 2. **Flexible Configuration**
- **Customizable appearance** - CSS classes and inline styles
- **Configurable behavior** - Show/hide features as needed
- **Hot cities support** - Highlight frequently used cities
- **Search integration** - Built-in search functionality

### 3. **User Experience**
- **Responsive design** - Works on all screen sizes
- **Keyboard navigation** - Full keyboard support
- **Accessibility** - ARIA labels and screen reader support
- **Smooth animations** - Polished interactions

### 4. **Developer Friendly**
- **TypeScript support** - Full type definitions
- **Easy integration** - Simple API and props
- **Customizable styling** - CSS-in-JS or external stylesheets
- **Event handling** - Comprehensive callback system

## Implementation Details

### 1. **Data Structure**
```javascript
// City data structure
const cityData = {
  '广东省': {
    '深圳市': {
      '南山区': '440305',
      '福田区': '440304',
      '罗湖区': '440303'
    },
    '广州市': {
      '天河区': '440106',
      '越秀区': '440104',
      '荔湾区': '440103'
    }
  }
};
```

### 2. **Component Architecture**
```jsx
// Main component structure
const CitySelect = ({
  onCityChange,
  placeholder,
  showSearch,
  showHotCities,
  hotCities,
  maxHeight,
  className,
  style,
  disabled,
  defaultValue
}) => {
  // Component logic
  return (
    <div className={`city-select ${className}`} style={style}>
      {/* Component JSX */}
    </div>
  );
};
```

### 3. **Search Functionality**
```javascript
// Search implementation
const searchCities = (query, cityData) => {
  const results = [];
  
  Object.keys(cityData).forEach(province => {
    Object.keys(cityData[province]).forEach(city => {
      if (city.includes(query) || province.includes(query)) {
        results.push({
          province,
          city,
          districts: cityData[province][city]
        });
      }
    });
  });
  
  return results;
};
```

## Styling and Customization

### 1. **CSS Classes**
```css
.city-select {
  position: relative;
  display: inline-block;
  width: 100%;
}

.city-select__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
}

.city-select__dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.city-select__search {
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;
}

.city-select__search-input {
  width: 100%;
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  outline: none;
}

.city-select__hot-cities {
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;
}

.city-select__hot-city {
  display: inline-block;
  margin: 2px 4px;
  padding: 4px 8px;
  background: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.city-select__list {
  max-height: 200px;
  overflow-y: auto;
}

.city-select__item {
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
}

.city-select__item:hover {
  background: #f5f5f5;
}

.city-select__item--selected {
  background: #e6f7ff;
  color: #1890ff;
}
```

### 2. **Custom Styling**
```jsx
// Using CSS modules
import styles from './CitySelect.module.css';

<CitySelect
  className={styles.customCitySelect}
  style={{ width: '400px' }}
  onCityChange={handleCityChange}
/>

// Using styled-components
import styled from 'styled-components';

const StyledCitySelect = styled(CitySelect)`
  .city-select__trigger {
    border-color: #1890ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }
  
  .city-select__item--selected {
    background: #1890ff;
    color: white;
  }
`;
```

## Usage Examples

### 1. **Basic City Selection**
```jsx
import React, { useState } from 'react';
import CitySelect from 'react-city-select';

function BasicExample() {
  const [city, setCity] = useState(null);

  return (
    <div>
      <h3>Select Your City</h3>
      <CitySelect
        onCityChange={setCity}
        placeholder="Choose a city"
      />
      {city && (
        <div>
          <p>Province: {city.province}</p>
          <p>City: {city.city}</p>
          {city.district && <p>District: {city.district}</p>}
        </div>
      )}
    </div>
  );
}
```

### 2. **With Search and Hot Cities**
```jsx
import React, { useState } from 'react';
import CitySelect from 'react-city-select';

function AdvancedExample() {
  const [city, setCity] = useState(null);

  const hotCities = [
    '北京', '上海', '广州', '深圳', 
    '杭州', '南京', '成都', '武汉'
  ];

  return (
    <CitySelect
      onCityChange={setCity}
      placeholder="Search or select a city"
      showSearch={true}
      showHotCities={true}
      hotCities={hotCities}
      maxHeight={400}
    />
  );
}
```

### 3. **Form Integration**
```jsx
import React, { useState } from 'react';
import CitySelect from 'react-city-select';

function FormExample() {
  const [formData, setFormData] = useState({
    name: '',
    city: null,
    email: ''
  });

  const handleCityChange = (city) => {
    setFormData(prev => ({
      ...prev,
      city
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            name: e.target.value
          }))}
        />
      </div>
      
      <div>
        <label>City:</label>
        <CitySelect
          onCityChange={handleCityChange}
          placeholder="Select your city"
        />
      </div>
      
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            email: e.target.value
          }))}
        />
      </div>
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Performance Considerations

### 1. **Data Loading**
- **Lazy loading** - Load city data only when needed
- **Caching** - Cache loaded data to avoid repeated requests
- **Pagination** - Load large datasets in chunks
- **Virtualization** - Use virtual scrolling for large lists

### 2. **Search Optimization**
- **Debouncing** - Delay search requests to avoid excessive calls
- **Indexing** - Pre-index city data for faster searches
- **Filtering** - Filter results on the client side when possible
- **Caching** - Cache search results for repeated queries

### 3. **Memory Management**
- **Cleanup** - Properly clean up event listeners and timers
- **Unmounting** - Handle component unmounting gracefully
- **State management** - Minimize unnecessary re-renders
- **Event handling** - Use efficient event handling patterns

## Testing

### 1. **Unit Tests**
```javascript
import { render, fireEvent, screen } from '@testing-library/react';
import CitySelect from './CitySelect';

describe('CitySelect', () => {
  it('renders with placeholder', () => {
    render(<CitySelect placeholder="Select city" />);
    expect(screen.getByText('Select city')).toBeInTheDocument();
  });

  it('calls onCityChange when city is selected', () => {
    const mockOnChange = jest.fn();
    render(<CitySelect onCityChange={mockOnChange} />);
    
    // Simulate city selection
    fireEvent.click(screen.getByText('北京'));
    
    expect(mockOnChange).toHaveBeenCalledWith({
      province: '北京市',
      city: '北京市',
      code: '110000'
    });
  });
});
```

### 2. **Integration Tests**
```javascript
import { render, fireEvent, waitFor } from '@testing-library/react';
import CitySelect from './CitySelect';

describe('CitySelect Integration', () => {
  it('searches cities correctly', async () => {
    render(<CitySelect showSearch={true} />);
    
    const searchInput = screen.getByPlaceholderText('Search cities');
    fireEvent.change(searchInput, { target: { value: '北京' } });
    
    await waitFor(() => {
      expect(screen.getByText('北京市')).toBeInTheDocument();
    });
  });
});
```

## Conclusion

The React City Select component provides a comprehensive solution for city selection in Chinese applications:

### **Key Features:**
1. **Complete city data** - All Chinese cities and districts
2. **Flexible configuration** - Customizable appearance and behavior
3. **Search functionality** - Quick city finding
4. **Hot cities support** - Highlight frequently used cities
5. **Responsive design** - Works on all devices
6. **Accessibility** - Screen reader and keyboard support

### **Use Cases:**
1. **User registration** - Location selection during signup
2. **Address forms** - City selection in address forms
3. **Location-based services** - City selection for local services
4. **Data collection** - User location data collection
5. **E-commerce** - Shipping address selection

### **Benefits:**
1. **Easy integration** - Simple API and props
2. **Customizable** - Flexible styling and behavior
3. **Performance** - Optimized for large datasets
4. **User-friendly** - Intuitive interface and interactions
5. **Maintainable** - Clean code and good documentation

This component is particularly useful for applications targeting Chinese users, providing a familiar and efficient way to select cities and districts. The configurable nature makes it suitable for various use cases and design requirements.