---
title: "Web Frontend Testing and Monitoring Exploration and Practice"
date: 2016-11-08 15:52:29
draft: false
translationKey: "web-frontend-testing-monitoring"
---

## Introduction

Every morning when I arrive at the company, I first browse through the technical articles I subscribe to on RSS. A few days ago, while reading articles, I suddenly noticed this sentence:

> The three axes of program development: functionality, testing, and monitoring.

I paused here and pondered carefully, finding this sentence very accurate and insightful. As programmers, most people might only focus on developing functional requirements, but don't care about testing and monitoring aspects of programs. Often, easily overlooked problems are sometimes very important. After reading the article, I started researching frontend testing and monitoring. The following is my research summary:

## Frontend Testing

The frontend testing I understand is mainly divided into unit testing, UI testing, and performance testing.

**Unit testing** is mainly testing methods and libraries. The two most commonly used libraries for unit testing are [Mocha](https://mochajs.org/) and [Jasmine](https://jasmine.github.io/). By writing test scripts to test small module code, for specific tutorials, please refer to [Testing Framework Mocha Example Tutorial - Ruan Yifeng](http://www.ruanyifeng.com/blog/2015/12/a-mocha-tutorial-of-examples.html). Unit testing has a disadvantage: you need to write a lot of scripts to run test cases, and if requirements change, your code logic will change, so your test scripts also need corresponding maintenance. If it's a large company with sufficient manpower and dedicated testers, the above problems should not be problems, but like most people in small companies, sometimes business development might not even be completed, let alone have time to maintain test scripts. So doing unit testing requires consuming certain energy, do it within your means.

**UI testing** includes testing page styles, such as whether display effects in various browsers have abnormalities, and also includes interaction testing, such as whether clicking buttons has corresponding feedback. **Performance testing** is mainly detecting webpage loading speed, including testing loading conditions under different network environments and different devices. For the above two aspects of testing, I recommend the famous testing tool [Phantomjs](http://phantomjs.org/). This tool is a headless browser, very powerful for web testing, interfaces, network capture, page automation access, etc. Based on Phantomjs, there are related [PhantomCSS](https://github.com/Huddle/PhantomCSS) to help with pixel comparison testing, and [PhantomFlow](https://github.com/Huddle/PhantomFlow) for operation comparison testing. Due to lack of much practice, I'll skip this here.

In frontend testing, some companies have dedicated departments for testing, but like the startup company I'm in, there are rarely dedicated testers. In testing, I have less practical experience, mainly continuously conducting manual testing during development to ensure product quality. But sometimes developers' manual testing cannot catch all BUGs, and even if users discover BUGs, how many are willing to report them? So for a stable system, monitoring is very important.

## Frontend Monitoring

Monitoring plays a very important role in improving product stability and quality. Regarding the importance of frontend monitoring, you can first read this article [Frontend Monitoring That Cannot Be Ignored - Zhang Xin](https://zhuanlan.zhihu.com/p/23310438)

In frontend monitoring, I experimentally deployed [Sentry](https://github.com/getsentry/sentry) on the company's project. This is a cross-platform error log collection system, not only for Web frontend, but other development can also use it. After introducing it into the project, it can monitor JavaScript errors on Web pages and notify developers in time through email for Bug tracking. This project is an open-source project, you can build your own company's log management system, or use Sentry's service.

### Installation Method

```bash
# Install Sentry
npm install @sentry/browser @sentry/integrations

# Or using yarn
yarn add @sentry/browser @sentry/integrations
```

### Basic Configuration

```javascript
// sentry.js
import * as Sentry from '@sentry/browser';
import { Integrations } from '@sentry/integrations';

Sentry.init({
  dsn: 'YOUR_DSN_HERE',
  integrations: [
    new Integrations.Breadcrumbs({
      console: true,
      dom: true,
      fetch: true,
      history: true,
      sentry: true,
      xhr: true,
    }),
  ],
  environment: process.env.NODE_ENV,
  release: process.env.RELEASE_VERSION,
});
```

### Advanced Configuration

```javascript
// Advanced Sentry configuration
import * as Sentry from '@sentry/browser';
import { Integrations } from '@sentry/integrations';

Sentry.init({
  dsn: 'YOUR_DSN_HERE',
  integrations: [
    new Integrations.Breadcrumbs({
      console: true,
      dom: true,
      fetch: true,
      history: true,
      sentry: true,
      xhr: true,
    }),
    new Integrations.GlobalHandlers({
      onunhandledrejection: true,
      onerror: true,
    }),
  ],
  environment: process.env.NODE_ENV,
  release: process.env.RELEASE_VERSION,
  beforeSend(event) {
    // Filter out sensitive information
    if (event.exception) {
      const error = event.exception.values[0];
      if (error.type === 'ChunkLoadError') {
        return null; // Ignore chunk load errors
      }
    }
    return event;
  },
  beforeBreadcrumb(breadcrumb) {
    // Filter out sensitive breadcrumbs
    if (breadcrumb.category === 'console' && breadcrumb.level === 'log') {
      return null;
    }
    return breadcrumb;
  },
});
```

## Testing Strategies

### 1. **Unit Testing**

```javascript
// Example unit test with Jest
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });
});
```

### 2. **Integration Testing**

```javascript
// Example integration test
import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import UserProfile from './UserProfile';

const server = setupServer(
  rest.get('/api/user', (req, res, ctx) => {
    return res(ctx.json({ name: 'John Doe', email: 'john@example.com' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('UserProfile Integration', () => {
  it('loads and displays user data', async () => {
    render(<UserProfile />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });
});
```

### 3. **End-to-End Testing**

```javascript
// Example E2E test with Cypress
describe('User Registration Flow', () => {
  it('allows user to register successfully', () => {
    cy.visit('/register');
    
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="confirm-password-input"]').type('password123');
    
    cy.get('[data-testid="register-button"]').click();
    
    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="welcome-message"]').should('contain', 'Welcome');
  });
});
```

## Monitoring Implementation

### 1. **Error Monitoring**

```javascript
// Custom error boundary
import React from 'react';
import * as Sentry from '@sentry/react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### 2. **Performance Monitoring**

```javascript
// Performance monitoring
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to your analytics service
  console.log(metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### 3. **User Behavior Monitoring**

```javascript
// User behavior tracking
import * as Sentry from '@sentry/browser';

// Track user actions
function trackUserAction(action, data) {
  Sentry.addBreadcrumb({
    message: action,
    category: 'user-action',
    data: data,
    level: 'info',
  });
}

// Track page views
function trackPageView(page) {
  Sentry.addBreadcrumb({
    message: 'Page view',
    category: 'navigation',
    data: { page },
    level: 'info',
  });
}
```

## Best Practices

### 1. **Testing Best Practices**

```javascript
// Test structure
describe('Component Name', () => {
  // Setup
  beforeEach(() => {
    // Setup code
  });

  // Teardown
  afterEach(() => {
    // Cleanup code
  });

  // Tests
  it('should do something', () => {
    // Test implementation
  });
});
```

### 2. **Monitoring Best Practices**

```javascript
// Error handling
try {
  // Risky operation
  riskyOperation();
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      section: 'user-registration',
    },
    extra: {
      userId: currentUser.id,
    },
  });
  
  // Handle error gracefully
  showErrorMessage('Something went wrong. Please try again.');
}
```

### 3. **Performance Best Practices**

```javascript
// Lazy loading
const LazyComponent = React.lazy(() => import('./LazyComponent'));

// Code splitting
const routes = [
  {
    path: '/dashboard',
    component: React.lazy(() => import('./Dashboard')),
  },
  {
    path: '/profile',
    component: React.lazy(() => import('./Profile')),
  },
];
```

## Tools and Technologies

### 1. **Testing Tools**
- **Jest** - JavaScript testing framework
- **React Testing Library** - React component testing
- **Cypress** - End-to-end testing
- **Playwright** - Cross-browser testing
- **Storybook** - Component development and testing

### 2. **Monitoring Tools**
- **Sentry** - Error tracking and performance monitoring
- **LogRocket** - Session replay and error tracking
- **New Relic** - Application performance monitoring
- **Google Analytics** - User behavior analytics
- **Hotjar** - User experience analytics

### 3. **Performance Tools**
- **Lighthouse** - Performance auditing
- **WebPageTest** - Performance testing
- **Chrome DevTools** - Browser-based debugging
- **Bundle Analyzer** - Bundle size analysis

## Implementation Strategy

### 1. **Phased Approach**
- **Phase 1**: Implement basic error monitoring
- **Phase 2**: Add performance monitoring
- **Phase 3**: Implement comprehensive testing
- **Phase 4**: Add user behavior tracking

### 2. **Team Training**
- **Testing workshops** - Teach team testing best practices
- **Monitoring setup** - Train team on monitoring tools
- **Performance optimization** - Share performance techniques
- **Code reviews** - Include testing and monitoring in reviews

### 3. **Continuous Improvement**
- **Regular reviews** - Analyze monitoring data
- **Test coverage** - Monitor test coverage metrics
- **Performance budgets** - Set and monitor performance limits
- **User feedback** - Incorporate user feedback into improvements

## Conclusion

Frontend testing and monitoring are essential for building stable, high-quality web applications:

### **Key Benefits:**
1. **Early bug detection** - Catch issues before users do
2. **Performance optimization** - Identify and fix performance bottlenecks
3. **User experience** - Ensure smooth user interactions
4. **Data-driven decisions** - Make informed improvements based on data
5. **Team confidence** - Deploy with confidence knowing issues are monitored

### **Implementation Tips:**
1. **Start small** - Begin with basic error monitoring
2. **Gradual adoption** - Add testing and monitoring incrementally
3. **Team buy-in** - Get team support for testing and monitoring
4. **Regular reviews** - Analyze data and make improvements
5. **Continuous learning** - Stay updated with best practices

### **Final Thoughts:**
As the saying goes, "The three axes of program development: functionality, testing, and monitoring." While functionality gets most attention, testing and monitoring are equally important for building successful applications. By implementing proper testing and monitoring strategies, teams can deliver more reliable, performant, and user-friendly applications.

Remember: Testing and monitoring are not one-time activities but ongoing processes that require commitment and continuous improvement. The investment in these areas pays off in terms of reduced bugs, better performance, and improved user satisfaction.