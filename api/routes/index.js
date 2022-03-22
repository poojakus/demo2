var logger = require('../api/service/logger');

module.exports = function(router) {
    router.get('*', function(req, res) {
        logger.info('404 Hit');
        res.status(404).send();
    });
};
