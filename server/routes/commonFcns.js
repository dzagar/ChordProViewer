var commonFcns = require('./commonFcns');
var cookieParser = require('cookie-parser');

exports.getUser = function(req){    //  Get user cookie
    if(req.cookies != undefined){
        if(req.cookies.user != undefined){
            return req.cookies.user;
        }
    }
    return undefined;
}

exports.redirect = function(res, req){      //  Redirect if no user
    var username = commonFcns.getUser(req);
    if (username != undefined){
        return true;
    }
    return false;
}

exports.deleteUser = function(res, req){
    var username = commonFcns.getUser(req);
    if(username != undefined){
        cookieParser.clearCookie(username);
    }
}