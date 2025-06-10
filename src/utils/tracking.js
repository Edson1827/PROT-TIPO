// Tracking utilities for AI.GROWTH
export const trackingUtils = {
  // Google Analytics 4 Events
  trackGA4Event: (eventName, parameters = {}) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'AI.GROWTH',
        event_label: parameters.label || '',
        value: parameters.value || 0,
        user_type: parameters.userType || 'unknown',
        plan_type: parameters.planType || 'unknown',
        ...parameters
      });
    }
  },

  // Facebook Pixel Events
  trackFBEvent: (eventName, parameters = {}) => {
    if (typeof fbq !== 'undefined') {
      fbq('track', eventName, {
        content_name: 'AI.GROWTH',
        content_category: parameters.category || 'saas',
        value: parameters.value || 0,
        currency: 'BRL',
        ...parameters
      });
    }
  },

  // LinkedIn Insight Tag Events
  trackLinkedInEvent: (eventName, parameters = {}) => {
    if (typeof lintrk !== 'undefined') {
      lintrk('track', { conversion_id: eventName });
    }
  },

  // Microsoft Clarity Events
  trackClarityEvent: (eventName, parameters = {}) => {
    if (typeof clarity !== 'undefined') {
      clarity('set', eventName, JSON.stringify(parameters));
    }
  },

  // Hotjar Events
  trackHotjarEvent: (eventName, parameters = {}) => {
    if (typeof hj !== 'undefined') {
      hj('event', eventName);
    }
  },

  // Combined tracking for important events
  trackConversion: (conversionType, value = 0, planType = 'unknown') => {
    const params = {
      value: value,
      planType: planType,
      category: 'conversion',
      label: conversionType
    };

    // Track in all platforms
    trackingUtils.trackGA4Event('conversion', params);
    trackingUtils.trackFBEvent('Purchase', params);
    trackingUtils.trackLinkedInEvent('conversion');
    trackingUtils.trackClarityEvent('conversion', params);
    trackingUtils.trackHotjarEvent('conversion');
  },

  // Track user registration
  trackSignUp: (userType = 'client', planType = 'starter') => {
    const params = {
      userType: userType,
      planType: planType,
      category: 'engagement',
      label: 'sign_up'
    };

    trackingUtils.trackGA4Event('sign_up', params);
    trackingUtils.trackFBEvent('CompleteRegistration', params);
    trackingUtils.trackLinkedInEvent('sign_up');
    trackingUtils.trackClarityEvent('sign_up', params);
    trackingUtils.trackHotjarEvent('sign_up');
  },

  // Track login
  trackLogin: (userType = 'client', planType = 'unknown') => {
    const params = {
      userType: userType,
      planType: planType,
      category: 'engagement',
      label: 'login'
    };

    trackingUtils.trackGA4Event('login', params);
    trackingUtils.trackFBEvent('Login', params);
    trackingUtils.trackClarityEvent('login', params);
    trackingUtils.trackHotjarEvent('login');
  },

  // Track plan selection
  trackPlanSelection: (planType, value = 0) => {
    const params = {
      planType: planType,
      value: value,
      category: 'ecommerce',
      label: 'plan_selection'
    };

    trackingUtils.trackGA4Event('select_item', params);
    trackingUtils.trackFBEvent('AddToCart', params);
    trackingUtils.trackClarityEvent('plan_selection', params);
    trackingUtils.trackHotjarEvent('plan_selection');
  },

  // Track dashboard views
  trackDashboardView: (dashboardType, userType = 'client') => {
    const params = {
      userType: userType,
      dashboardType: dashboardType,
      category: 'engagement',
      label: 'dashboard_view'
    };

    trackingUtils.trackGA4Event('page_view', params);
    trackingUtils.trackFBEvent('ViewContent', params);
    trackingUtils.trackClarityEvent('dashboard_view', params);
  },

  // Track feature usage
  trackFeatureUsage: (featureName, userType = 'client', planType = 'unknown') => {
    const params = {
      userType: userType,
      planType: planType,
      featureName: featureName,
      category: 'engagement',
      label: 'feature_usage'
    };

    trackingUtils.trackGA4Event('feature_usage', params);
    trackingUtils.trackClarityEvent('feature_usage', params);
    trackingUtils.trackHotjarEvent('feature_usage');
  },

  // Track errors
  trackError: (errorType, errorMessage = '') => {
    const params = {
      errorType: errorType,
      errorMessage: errorMessage,
      category: 'error',
      label: 'application_error'
    };

    trackingUtils.trackGA4Event('exception', params);
    trackingUtils.trackClarityEvent('error', params);
  },

  // Track page views with custom parameters
  trackPageView: (pageName, userType = 'unknown', planType = 'unknown') => {
    const params = {
      page_title: `AI.GROWTH - ${pageName}`,
      page_location: window.location.href,
      userType: userType,
      planType: planType
    };

    trackingUtils.trackGA4Event('page_view', params);
    trackingUtils.trackFBEvent('PageView', params);
    trackingUtils.trackClarityEvent('page_view', params);
  },

  // Track button clicks
  trackButtonClick: (buttonName, location = 'unknown', userType = 'unknown') => {
    const params = {
      buttonName: buttonName,
      location: location,
      userType: userType,
      category: 'engagement',
      label: 'button_click'
    };

    trackingUtils.trackGA4Event('click', params);
    trackingUtils.trackClarityEvent('button_click', params);
  },

  // Track form submissions
  trackFormSubmission: (formName, success = true, userType = 'unknown') => {
    const params = {
      formName: formName,
      success: success,
      userType: userType,
      category: 'engagement',
      label: 'form_submission'
    };

    trackingUtils.trackGA4Event('form_submit', params);
    trackingUtils.trackClarityEvent('form_submission', params);
  }
};

// Auto-track page views on route changes
export const setupAutoTracking = () => {
  // Track initial page load
  trackingUtils.trackPageView('Initial Load');

  // Track route changes (for SPAs)
  let currentPath = window.location.pathname;
  const observer = new MutationObserver(() => {
    if (window.location.pathname !== currentPath) {
      currentPath = window.location.pathname;
      const pageName = currentPath.replace('/', '') || 'Home';
      trackingUtils.trackPageView(pageName);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
};

export default trackingUtils;

