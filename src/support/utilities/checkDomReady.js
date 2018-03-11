/**
 * Check if the Content Loaded event has been fired
 */
module.exports = () => {

    const isContentLoaded = browser.execute(function(){
        return window && window.contentLoaded
    });

    expect(isContentLoaded.value, 'Content Load not complete').to.be.true();

    return isContentLoaded && isContentLoaded.value;
};
