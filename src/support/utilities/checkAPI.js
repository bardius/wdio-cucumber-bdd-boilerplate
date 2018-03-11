const chalk = require('chalk');

/**
 * Helper methods to test API calls for GET, PUT, POST and DELETE reusable functionality
 */

module.exports = {

    /**
     * GET API function
     *
     * @param endpoint
     *
     * @returns {*|Promise<T>}
     */
    getAPI: function (endpoint) {
        let endPoint = (endpoint);

        let options = {
            method: 'GET',
            url: endPoint,
            json: true,
            time: true,
            resolveWithFullResponse: true
        };

        return request(options)
            .then(function (response) {
                console.log(response.timings.response);
                return response;
            })
            .catch(function (err) {
                console.log(chalk.red(`Api error msg: ${err.stack}`));
                return err;
            });
    },

    /**
     * API call for GET, PUT, POST and DELETE functionality
     * @param endPoint
     * @param method
     * @param body
     * @param fileName
     *
     * @returns {*|Promise<T>}
     */
    apiCall: function (endPoint, method, body, fileName) {
        let options = {
            url: endPoint,
            method: method,
            body: body,
            docId: fileName,
            json: true,
            time: true,
            resolveWithFullResponse: true
        };

        return request(options)
            .then(function (res) {
                if (method === 'DELETE' || 'POST'){
                    console.log('this is a Delete or Post ' + (fileName));
                } else {
                    console.log('this is a Create');
                }

                return res
            })
            .catch(function (err) {
                console.log(chalk.red(`Api error msg: ${err.stack}`));
                return err;
            });

    },

    /**
     * Create 'PUT' API function
     * @param url
     * @param body
     *
     * @returns {*|Promise<T>}
     */
    putApi: function (url, body) {
        url = (url);
        body = (body);

        let options = {
            method: 'PUT',
            url: url,
            body: body,
            json: true,
            time: true,
            resolveWithFullResponse: true
        };

        return request(options)
            .then(function (res) {
                console.log('This is the doc_Id:- ', res);
                return res;
            })
            .catch(function (err) {
                console.log(chalk.red(`Api error msg: ${err.stack}`));
                return err;
            });
    },

    /**
     * Edit 'POST' Api function
     *
     * @param url
     * @param body
     *
     * @returns {*|Promise<T>}
     */
    postApi: function (url, body) {
        url = (url);
        body = (body);

        let options = {
            method: 'POST',
            url: url,
            body: body,
            json: true,
            resolveWithFullResponse: true
        };

        return request(options)
            .then(function (res) {
                console.log('this is the status: ', res);
                return res;
            })
            .catch(function (err) {
                console.log(chalk.red(`Api error msg: ${err.stack}`));
                return err;
            });
    },

    /**
     * Delete Api function
     *
     * @param url
     * @param docId
     *
     * @returns {*|Promise<T>}
     */
    deleteApi: function (url, docId) {
        url = (url);
        docId = (docId);

        let options = {
            method: 'DELETE',
            url: url,
            body: {
                docId: docId
            },
            json: true
        };

        return request(options)
            .then(function (res) {
                console.log('Delete Api response: ', res);
                return res;
            })
            .catch(function (err) {
                console.log(chalk.red(`Api error msg: ${err.stack}`));
                return err;
            });
    }
};
