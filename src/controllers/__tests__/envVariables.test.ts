describe('Environment Variables', () => {
    // Saving the original environment variables
    const originalEnv = process.env;
  
    beforeEach(() => {
      // Creating a copy of the environment variables
      process.env = { ...originalEnv };
    });
  
    afterEach(() => {
      // Restoring the original environment variables after each test
      process.env = originalEnv;
    });
  
    it('should throw an error if API_KEY is not defined', () => {
      delete process.env.API_KEY;
    expect(() => {
        require('../tripsController');
      }).toThrow('API_KEY or API_URL are not defined in environment variables');
    });
  
    it('should throw an error if API_URL is not defined', () => {
      delete process.env.API_URL;
      expect(() => {
        require('../tripsController'); 
      }).toThrow('API_KEY or API_URL are not defined in environment variables');
    });
  
    it('should not throw an error if both API_KEY and API_URL are defined', () => {
      process.env.API_KEY = 'test_api_key';
      process.env.API_URL = 'https://example.com/api';
      expect(() => {
        require('../tripsController');
      }).not.toThrow();
    });
  });
  