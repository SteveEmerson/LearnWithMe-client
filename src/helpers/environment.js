let APIURL = '';

// eslint-disable-next-line default-case
switch (window.location.hostname) {
  case 'localhost' || '127.0.0.1':
    APIURL = 'http://localhost:3000';
    break;
  case 'learn-with-me-client.herokuapp.com':
    APIURL = 'https://sbe-learn-with-me.herokuapp.com'
    break;
}

export default APIURL;