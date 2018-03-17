function FindProxyForURL(url, host) {
    if(shExpMatch(host, 'localhost') ||
        shExpMatch(host, '12.7.0.0.1') ||
        shExpMatch(host, '*')
    ) {
        return 'DIRECT';
    }

    // Route HTTP traffic through local or BrowserMob proxy
    return "PROXY xx.xxx.xx.x:xxxx";
}
