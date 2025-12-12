// Cookie debugging utilities

export const debugCookieIssues = () => {
  console.log('🔍 === COOKIE DEBUG REPORT ===');
  
  // 1. Check current cookies
  console.log('🍪 Current cookies:', document.cookie);
  
  // 2. Parse cookies
  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      acc[name] = value;
    }
    return acc;
  }, {});
  
  console.log('🍪 Parsed cookies:', cookies);
  
  // 3. Check for auth cookies
  const authCookies = Object.keys(cookies).filter(key => 
    key.includes('token') || key.includes('auth') || key.includes('session')
  );
  
  console.log('🔐 Auth-related cookies found:', authCookies);
  
  // 4. Check domain info
  console.log('🌐 Current domain:', window.location.hostname);
  console.log('🌐 Current origin:', window.location.origin);
  
  // 5. Check if we're on HTTPS
  console.log('🔒 HTTPS:', window.location.protocol === 'https:');
  
  // 6. Check cookie support
  const cookieSupport = document.cookie !== undefined;
  console.log('🍪 Cookie support:', cookieSupport);
  
  // 7. Test cookie setting
  try {
    document.cookie = 'test_cookie=1; path=/';
    const testSet = document.cookie.includes('test_cookie=1');
    document.cookie = 'test_cookie=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    console.log('🍪 Cookie setting test:', testSet);
  } catch (error) {
    console.error('🍪 Cookie setting failed:', error);
  }
  
  console.log('🔍 === END DEBUG REPORT ===');
  
  return {
    cookies,
    authCookies,
    domain: window.location.hostname,
    origin: window.location.origin,
    https: window.location.protocol === 'https:',
    cookieSupport
  };
};

export const checkCORS = async () => {
  console.log('🌐 Testing CORS...');
  
  try {
    // Test preflight request
    const response = await fetch('https://nodejs-express-english-api.onrender.com/api/auth/logout', {
      method: 'OPTIONS',
      headers: {
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type',
      }
    });
    
    console.log('✅ OPTIONS request successful:', {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    // Check CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Credentials': response.headers.get('Access-Control-Allow-Credentials'),
      'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers'),
    };
    
    console.log('🌐 CORS headers:', corsHeaders);
    
    return corsHeaders;
  } catch (error) {
    console.error('❌ CORS test failed:', error);
    return null;
  }
};
