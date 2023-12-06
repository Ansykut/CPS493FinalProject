const users = require('../models/users');

module.exports = {
    parseAuthorizationHeader(req, res, next) {
        const token = req.headers.authorization?.split(' ')[1];
        if (token) {
           users.verifyTokenAsync(token)
                .then(user => {
                    if (user) {
                        req.user = user;
                    }
                    next();
                }
                ).catch(err=> {
                    next({ code: 401, message: err });
                }
                );
        } else {
            next();
        }
    },


    
    requireLogin(requireAdmin = false) {
        return (req, res, next) => {
            if (req.user) {
                if (requireAdmin && req.user.role !== 'admin') {
                    next({ code: 403, message: 'Admin required' });
                } else {
                    next();
                }
            } else {
                next({ code: 401, message: 'Login required' });
            }
        };
    }
};