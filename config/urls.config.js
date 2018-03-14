const localUrls = {
    landing_page: 'https://www.google.co.uk/',
    login_page: 'https://accounts.google.com/ServiceLogin',
    authenticated_page: 'https://accounts.google.com',
    non_authenticated_page: 'https://accounts.google.com/ServiceLogin',
    httpbin_api: 'http://httpbin.org'
};

const devUrls = {
    landing_page: 'https://www.google.co.uk/',
    login_page: 'https://accounts.google.com/ServiceLogin',
    authenticated_page: 'https://accounts.google.com',
    non_authenticated_page: 'https://accounts.google.com/ServiceLogin',
    httpbin_api: 'http://httpbin.org'
};

const prodUrls = {
    landing_page: 'https://www.google.co.uk/',
    login_page: 'https://accounts.google.com/ServiceLogin',
    authenticated_page: 'https://accounts.google.com',
    non_authenticated_page: 'https://accounts.google.com/ServiceLogin',
    httpbin_api: 'http://httpbin.org'
};

module.exports = {
    getURL: function(environment){
        switch(environment) {
            case 'local':
                return localUrls;
                break;
            case 'dev':
                return devUrls;
                break;
            case 'prod':
                return prodUrls;
                break;
            default:
                return localUrls;
                break;
        }
    }
};
