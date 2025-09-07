---
title: "Jest Mock AppState TypeError Solution"
date: 2023-09-23 11:18:21
draft: false
lang: en
translationKey: "jest-mock-appstate-typeerror"
---

## Problem Record

**Background**: Using Jest and React Testing Library for automated testing of React Native
**Problem**: Code contains AppState usage

```javascript
import { AppState } from 'react-native';

AppState.removeEventListener('change', handleAppStateChange);
```

**Error**: **TypeError: import_react_native.AppState.removeEventListener is not a function**

jest.config.js configuration uses React Native preset

```javascript
module.exports = {
  preset: 'react-native',
  ...
};
```

## Root Cause Analysis

The issue occurs because:

1. **AppState API Changes** - In newer versions of React Native, `removeEventListener` has been deprecated
2. **Jest Mocking** - The Jest environment doesn't properly mock the updated AppState API
3. **Version Mismatch** - The code uses deprecated API while Jest mocks the old version

## Solution

### 1. **Update AppState Usage (Recommended)**

Replace the deprecated `removeEventListener` with the new `remove` method:

```javascript
// Old way (deprecated)
import { AppState } from 'react-native';

const subscription = AppState.addEventListener('change', handleAppStateChange);
AppState.removeEventListener('change', handleAppStateChange);

// New way (recommended)
import { AppState } from 'react-native';

const subscription = AppState.addEventListener('change', handleAppStateChange);
subscription.remove(); // Use the returned subscription's remove method
```

### 2. **Jest Mock Configuration**

Update your Jest configuration to properly mock AppState:

```javascript
// jest.config.js
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // ... other config
};
```

```javascript
// jest.setup.js
import { AppState } from 'react-native';

// Mock AppState with proper API
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  
  return {
    ...RN,
    AppState: {
      currentState: 'active',
      addEventListener: jest.fn((eventType, listener) => {
        // Return a subscription object with remove method
        return {
          remove: jest.fn(),
        };
      }),
      removeEventListener: jest.fn(), // Keep for backward compatibility
    },
  };
});
```

### 3. **Alternative Mock Implementation**

For more comprehensive testing, create a more detailed mock:

```javascript
// jest.setup.js
import { AppState } from 'react-native';

// Create a mock AppState with full functionality
const mockAppState = {
  currentState: 'active',
  addEventListener: jest.fn((eventType, listener) => {
    // Store the listener for potential testing
    mockAppState._listeners = mockAppState._listeners || [];
    mockAppState._listeners.push({ eventType, listener });
    
    // Return subscription object
    return {
      remove: jest.fn(() => {
        // Remove the listener when subscription is removed
        mockAppState._listeners = mockAppState._listeners.filter(
          l => l.listener !== listener
        );
      }),
    };
  }),
  removeEventListener: jest.fn(), // Deprecated but keep for compatibility
  // Helper methods for testing
  _listeners: [],
  _simulateStateChange: jest.fn((newState) => {
    mockAppState.currentState = newState;
    mockAppState._listeners.forEach(({ eventType, listener }) => {
      if (eventType === 'change') {
        listener(newState);
      }
    });
  }),
};

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  
  return {
    ...RN,
    AppState: mockAppState,
  };
});

// Export for use in tests
export { mockAppState };
```

### 4. **Test Implementation**

Here's how to use the mock in your tests:

```javascript
// AppState.test.js
import { render, fireEvent } from '@testing-library/react-native';
import { AppState } from 'react-native';
import { mockAppState } from '../jest.setup';
import MyComponent from '../MyComponent';

describe('AppState Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle app state changes', () => {
    const { getByText } = render(<MyComponent />);
    
    // Simulate app state change
    mockAppState._simulateStateChange('background');
    
    // Assert the component responds correctly
    expect(getByText('App is in background')).toBeTruthy();
  });

  it('should add and remove event listeners', () => {
    const handleAppStateChange = jest.fn();
    
    // Add listener
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    expect(AppState.addEventListener).toHaveBeenCalledWith('change', handleAppStateChange);
    
    // Remove listener
    subscription.remove();
    
    expect(subscription.remove).toHaveBeenCalled();
  });
});
```

### 5. **Component Implementation**

Update your component to use the new AppState API:

```javascript
// MyComponent.js
import React, { useEffect, useState } from 'react';
import { AppState } from 'react-native';

const MyComponent = () => {
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      setAppState(nextAppState);
    });

    // Cleanup function
    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <div>
      <p>App State: {appState}</p>
    </div>
  );
};

export default MyComponent;
```

## Common Issues and Solutions

### 1. **TypeScript Errors**

If you're using TypeScript, you might encounter type errors:

```typescript
// types/react-native.d.ts
declare module 'react-native' {
  interface AppStateStatic {
    currentState: string;
    addEventListener(
      eventType: 'change',
      listener: (nextAppState: string) => void
    ): { remove: () => void };
    removeEventListener?: (eventType: string, listener: Function) => void;
  }
  
  export const AppState: AppStateStatic;
}
```

### 2. **Legacy Code Migration**

For existing codebases, create a migration helper:

```javascript
// utils/appStateHelper.js
import { AppState } from 'react-native';

// Helper function to handle both old and new APIs
export const addAppStateListener = (listener) => {
  if (AppState.addEventListener) {
    // New API
    return AppState.addEventListener('change', listener);
  } else {
    // Old API (fallback)
    AppState.addEventListener('change', listener);
    return {
      remove: () => AppState.removeEventListener('change', listener)
    };
  }
};

// Usage in components
import { addAppStateListener } from '../utils/appStateHelper';

useEffect(() => {
  const subscription = addAppStateListener(handleAppStateChange);
  return () => subscription.remove();
}, []);
```

### 3. **Testing Different App States**

```javascript
// Test different app states
describe('App State Handling', () => {
  it('should handle active state', () => {
    mockAppState._simulateStateChange('active');
    // Test active state behavior
  });

  it('should handle background state', () => {
    mockAppState._simulateStateChange('background');
    // Test background state behavior
  });

  it('should handle inactive state', () => {
    mockAppState._simulateStateChange('inactive');
    // Test inactive state behavior
  });
});
```

## Best Practices

### 1. **Always Clean Up Listeners**

```javascript
useEffect(() => {
  const subscription = AppState.addEventListener('change', handleAppStateChange);
  
  // Always return cleanup function
  return () => {
    subscription.remove();
  };
}, []);
```

### 2. **Handle State Changes Properly**

```javascript
const handleAppStateChange = (nextAppState) => {
  if (nextAppState === 'active') {
    // App became active
    resumeApp();
  } else if (nextAppState === 'background') {
    // App went to background
    pauseApp();
  }
};
```

### 3. **Test App State Changes**

```javascript
// Test app state transitions
it('should pause when app goes to background', () => {
  const { getByText } = render(<MyComponent />);
  
  mockAppState._simulateStateChange('background');
  
  expect(getByText('App paused')).toBeTruthy();
});
```

## Conclusion

The AppState TypeError in Jest testing is caused by:

1. **API changes** in React Native
2. **Incomplete mocking** in Jest setup
3. **Version mismatches** between code and mocks

### Solutions:

1. **Update code** to use new AppState API
2. **Improve Jest mocks** to handle both old and new APIs
3. **Create comprehensive tests** for app state handling
4. **Use proper cleanup** in components

### Key Takeaways:

- Always use the new `addEventListener` API with subscription removal
- Mock AppState properly in Jest setup
- Test different app states and transitions
- Clean up event listeners to prevent memory leaks
- Handle both active and background states appropriately

By following these practices, you can avoid the AppState TypeError and create robust, testable React Native applications.