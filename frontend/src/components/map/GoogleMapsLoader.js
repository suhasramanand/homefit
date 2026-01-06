// src/components/map/GoogleMapsLoader.js

// Create a cache object in window to maintain state between calls
if (!window._googleMapsApiCache) {
    window._googleMapsApiCache = {
      loading: false,
      loaded: false,
      promise: null
    };
  }
  
  /**
   * Loads the Google Maps API with specified libraries
   * @param {string} apiKey - Google Maps API key
   * @param {Array<string>} libraries - Array of library names to load
   * @returns {Promise} - Promise that resolves when the API is loaded
   */
  export const loadGoogleMapsApi = (apiKey, libraries = ['places', 'marker']) => {
    // Check if API key is provided
    if (!apiKey || apiKey.trim() === '') {
      console.warn('Google Maps API key is missing. Maps functionality will be limited.');
      return Promise.reject(new Error('Google Maps API key is required but not provided. Please set REACT_APP_GOOGLE_MAPS_API_KEY in your .env file.'));
    }

    // If already loaded, return resolved promise
    if (window._googleMapsApiCache.loaded && window.google && window.google.maps) {
      return Promise.resolve();
    }
    
    // If currently loading, return the existing promise
    if (window._googleMapsApiCache.loading && window._googleMapsApiCache.promise) {
      return window._googleMapsApiCache.promise;
    }
    
    // Start loading
    window._googleMapsApiCache.loading = true;
    window._googleMapsApiCache.promise = new Promise((resolve, reject) => {
      // Create unique callback name to avoid collisions
      const callbackName = `googleMapsCallback_${Date.now()}`;
      
      // Set unique callback to avoid conflicts
      window[callbackName] = () => {
        // Check if Google Maps API loaded successfully
        if (!window.google || !window.google.maps) {
          window._googleMapsApiCache.loading = false;
          delete window[callbackName];
          reject(new Error('Google Maps API failed to load. Please check your API key.'));
          return;
        }
        
        // Wait a bit to check for errors that might appear after callback
        // Google Maps sometimes throws errors after the callback fires
        setTimeout(() => {
          // Check if there are any errors in the console
          // This is a workaround since Google Maps errors appear asynchronously
          window._googleMapsApiCache.loaded = true;
          window._googleMapsApiCache.loading = false;
          delete window[callbackName];
          resolve();
        }, 500);
      };
      
      // Listen for global Google Maps errors
      const originalErrorHandler = window.onerror;
      window.onerror = (message, source, lineno, colno, error) => {
        const errorMsg = message?.toString() || '';
        if (errorMsg.includes('DeletedApiProjectMapError') || errorMsg.includes('deleted')) {
          window._googleMapsApiCache.loading = false;
          window._googleMapsApiCache.loaded = false;
          delete window[callbackName];
          reject(new Error('The Google Cloud project associated with this API key has been deleted. Please create a new project and generate a new API key in Google Cloud Console.'));
          return true;
        }
        if (errorMsg.includes('ExpiredKeyMapError') || errorMsg.includes('expired')) {
          window._googleMapsApiCache.loading = false;
          window._googleMapsApiCache.loaded = false;
          delete window[callbackName];
          reject(new Error('This API key has expired. Please generate a new API key in Google Cloud Console and update your .env file.'));
          return true;
        }
        if (originalErrorHandler) {
          return originalErrorHandler(message, source, lineno, colno, error);
        }
        return false;
      };
      
      // Create script element
      const script = document.createElement('script');
      const librariesParam = libraries.join(',');
      // Add loading=async parameter as recommended by Google Maps API
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${librariesParam}&callback=${callbackName}&loading=async`;
      script.async = true;
      script.defer = true;
      
      // Set timeout to reject promise if loading takes too long
      const timeoutId = setTimeout(() => {
        if (!window._googleMapsApiCache.loaded) {
          window._googleMapsApiCache.loading = false;
          delete window[callbackName];
          reject(new Error('Timeout loading Google Maps API. Please check your internet connection and API key.'));
        }
      }, 20000); // 20 second timeout
      
      // Handle script load errors
      script.onerror = (error) => {
        clearTimeout(timeoutId);
        window._googleMapsApiCache.loading = false;
        delete window[callbackName];
        reject(new Error('Failed to load Google Maps API script. Please check your API key, ensure the Maps JavaScript API and Places API are enabled in Google Cloud Console, and verify there are no domain/IP restrictions blocking localhost.'));
      };
      
      // Add cleanup for successful load
      script.onload = () => {
        clearTimeout(timeoutId);
        // Note: We don't resolve here - we wait for the callback
      };
      
      // Add to document
      document.head.appendChild(script);
    });
    
    return window._googleMapsApiCache.promise;
  };
  
  /**
   * Creates a geocoder instance and geocodes an address
   * @param {string} address - Address to geocode
   * @returns {Promise} - Promise that resolves with geocoding results
   */
  export const geocodeAddress = (address) => {
    return new Promise((resolve, reject) => {
      if (!window.google || !window.google.maps) {
        reject(new Error('Google Maps API not loaded'));
        return;
      }
      
      try {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            resolve(results);
          } else {
            reject(new Error(`Geocoding failed with status: ${status}`));
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  };
  
  /**
   * Reverse geocodes coordinates to get an address
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {Promise} - Promise that resolves with reverse geocoding results
   */
  export const reverseGeocode = (lat, lng) => {
    return new Promise((resolve, reject) => {
      if (!window.google || !window.google.maps) {
        reject(new Error('Google Maps API not loaded'));
        return;
      }
      
      try {
        // Validate coordinates
        if (typeof lat !== 'number' || isNaN(lat) || typeof lng !== 'number' || isNaN(lng)) {
          reject(new Error('Invalid coordinates: lat and lng must be numbers'));
          return;
        }
        
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            resolve(results);
          } else {
            reject(new Error(`Reverse geocoding failed with status: ${status}`));
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  };
  
  const googleMapsLoader = {
    loadGoogleMapsApi,
    geocodeAddress,
    reverseGeocode
  };
  
  export default googleMapsLoader;