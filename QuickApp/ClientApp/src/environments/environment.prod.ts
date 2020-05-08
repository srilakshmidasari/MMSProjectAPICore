// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

export const environment = {
  production: true,
  baseUrl: 'http://183.82.111.111/MMSAPI', 
  //baseUrl: 'http://183.82.111.111/MMSTestAPI', 
 // baseUrl: 'http://localhost/MMSAPI',// Change this to the address of your backend API if different from frontend address
  tokenUrl: null, // For IdentityServer/Authorization Server API. You can set to null if same as baseUrl
  loginUrl: '/login'
};
