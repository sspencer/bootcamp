exports.login = function(req, res, next) {
    res.render('home/login', {
        layout:  '',
        login:   req.user,
        csrf:    req.csrfToken(),
        message: req.flash('error')
    });
};

exports.postLogin = function(redirectUrl) {
    return function(req, res, next) {
        res.redirect(redirectUrl);
    };
};

exports.logout = function(req, res, next) {
    req.logout();
    res.redirect('/');
};
