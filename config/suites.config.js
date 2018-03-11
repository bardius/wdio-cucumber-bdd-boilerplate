module.exports = {
    getSuites: function(){
        return {
            sample: [
                'src/features/sample/*.feature'
            ],
            sample1: [
                'src/features/sample/sample.feature'
            ],
            sample2: [
                'src/features/sample/sampleApi.feature'
            ]
        }
    }
};
