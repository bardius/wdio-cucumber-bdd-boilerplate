module.exports = {
    getCapability: function(browser, isHeadlessBrowser, maxInstances){
        // Normalise Edge browser name
        browser = browser === 'edge' ? 'MicrosoftEdge' : browser;

        // Normalise Internet Explorer browser name
        browser = browser === 'ie' ? 'internet explorer' : browser;

        // Set the browser options arguments
        let firefoxOptionsArgs = [];
        let chromeOptionsArgs = [
            'disable-extensions',
            'start-maximized'
        ];

        if(isHeadlessBrowser){
            chromeOptionsArgs.push('headless', 'disable-gpu');
            firefoxOptionsArgs.push('-headless');
        }

        // Instantiate the capability object
        let capability = {
            maxInstances: maxInstances,
            browserName: browser,
            version: null,
            maxDuration: 10800,
            idleTimeout: 900,
            commandTimeout: 600,
            screenResolution: '1024x768'
        };

        // Enhance the capability object based on browser selection
        switch(browser) {
            case 'chrome':
                capability['acceptInsecureCerts'] = true;
                capability['version'] = 'latest';
                capability['chromeOptions'] = {
                    prefs: {
                        credentials_enable_service: false,
                        profile: {
                            password_manager_enabled: false
                        }
                    },
                    args: chromeOptionsArgs
                };
                break;
            case 'firefox':
                capability['moz:firefoxOptions'] = {
                    args: firefoxOptionsArgs,
                    log: {
                        level: 'trace'
                    }
                };
                break;
            case 'MicrosoftEdge':
                capability['MicrosoftEdgeOptions'] = {
                    nativeEvents: true,
                    acceptSslCerts: true,
                    javascriptEnabled: true,
                    INTRODUCE_FLAKINESS_BY_IGNORING_SECURITY_DOMAINS: true,
                    cssSelectorsEnabled: true
                };
                break;
            case 'internet explorer':
                capability['InternetExplorerOptions'] = {
                    IntroduceInstabilityByIgnoringProtectedModeSettings: true,
                    ignoreProtectedModeSettings: true,
                    IgnoreProtectedModeSettings: true,
                    EnsureCleanSession: true,
                    IgnoreZoomLevel: true,
                    EnableNativeEvents: false,
                    UnexpectedAlertBehaviour: 'InternetExplorerUnexpectedAlertBehaviour.Accept',
                    EnablePersistentHover: true,
                    'disable-popup-blocking': true
                };
                break;
            case 'phantomjs':
                capability['javascriptEnabled'] = true;
                capability['acceptSslCerts'] = true;
                break;

            default:
        }

        return capability;
    }
};
