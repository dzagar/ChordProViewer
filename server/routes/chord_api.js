// Handling the chord_api
var Chord = require('../models/chord');
var User = require('../models/user');
var validator = require('validator');
var express = require('express');
var bcrypt = require('bcrypt');
var cookieParser = require('cookie-parser');
var router = express.Router();
var commonFcns = require('./commonFcns');

router.route('/chord-editor')   //  Edit Chord

    .post(function(req, res, next) {
        
        //Create new Chord
        var chordFile = new Chord();
        chordFile.title = validator.escape(req.body.title);
        chordFile.user = validator.escape(req.body.user);
        chordFile.contents = validator.escape(req.body.contents);
        chordFile.isPrivate = req.body.isPrivate;
        chordFile.versionNo = 1;
        //Make date pretty
        var currentDateTime = new Date();
        var currentDate = currentDateTime.toDateString();
        var currentTime = currentDateTime.toLocaleTimeString();
        chordFile.lastRevision = currentDate + ', ' + currentTime;
        
        //Check if it is duplicate of public chord
        Chord.find({ $and: [ {'contents': chordFile.contents}, {'isPrivate': false}, { 'user': { $ne: chordFile.user } } ] }, function(err, chords){
            // console.log('entered duplicate check');
            // console.log(chords);
            if (err) return res.send(err);
            if (chords.length != 0) {
                // console.log('is duplicate..');
                res.json({ message: 'Chord file has been copied from public directory. Unable to save cheater work.'});
            }
            else {
                //  Check if it is a new chord (not a revision)
                Chord.find({ $and: [ {'title': chordFile.title}, {'user': chordFile.user} ] }, function(err, allRev){
                    if (err) return res.send(err);
                    if (allRev.length === 0) {
                        // console.log('no revisions found');
                        chordFile.save(function(err){
                            if (err){
                                return res.send(err);
                            }
                            res.json({ message: 'Chord file saved successfully!'});
                            return;
                        });
                    } 
                    else {
                        var query = {
                            title: chordFile.title,
                            user: chordFile.user,
                            $or : [
                                { contents: { $ne: chordFile.contents } },
                                { isPrivate: {$ne: chordFile.isPrivate } }
                                ]
                        }
                        //  Is a revision; check if changes made to most recent, then save.
                        Chord.find(query, function(err, revs){
                            if(err) return res.send(err);
                            if (revs.length === 0) {
                                res.json({ message: 'No changes made.' });
                                return;
                            } else {
                                if (revs[revs.length-1]){
                                    var temp = 0;
                                    temp = allRev[allRev.length-1].versionNo;
                                    chordFile.versionNo = temp + 1;
                                }
                                // console.log('revision, version changed');
                                chordFile.save(function(err){
                                    if (err){
                                        return res.send(err);
                                    }
                                    res.json({ message: 'Chord file saved successfully!'});
                                });
                            }
                        })
                    }
                });
                
            }
        });
    });

router.route('/chord-editor/:chord')    //  Edit one chord

    .get(function(req, res, next){
        //  Get one chord
        Chord.findOne({'_id': req.params.chord }, function(err, chord){
            if (err) return res.send(err);
            res.json(chord);
        });
    })

    .delete(function(req, res) {
        //  Delete one chord
        Chord.remove({
            _id: req.params.chord
        }, function(err, chord) {
            if (err)
                return res.send(err);
            res.json({});
        });
    })
    
    .put(function(req, res, next){
        //  Update one chord's privacy
        Chord.findOne({'_id': req.body._id }, function(err, chord){
            if (err) return res.send(err);
            chord.isPrivate = req.body.isPrivate;
            chord.save();
            res.json({});
        })
    });

router.route('/login')  //  Login

    .post(function(req, res, next){

        var existingUser = new User();
        existingUser.username = validator.escape(req.body.user);
        existingUser.password = validator.escape(req.body.pass);

        User.findOne({'username': existingUser.username}, function(err, user){
            if (err) return res.send(err);
            if (!user) return res.json('Error: wrong username or password.');
            bcrypt.compare(existingUser.password, user.password, function (err, isValid) {
                if (err) {
                    return res.send(err);
                } else if (!isValid) {
                    return res.json('Error: wrong username or password.');
                } else {
                    res.cookie('user', existingUser.username, {overwrite: true, maxAge: 1000 * 60 * 60 * 24});
                    res.json();
                }
            });
        });
    });

router.route('/register')   // Register

    .post(function(req, res, next){
        
        var newUser = new User();
        newUser.username = validator.escape(req.body.user);
        newUser.password = validator.escape(req.body.pass);
        
        User.findOne({ 'username' : newUser.username }, function(err, user){
            if (err) return res.send(err);
            if (user) return res.json('Error: username already in use. Choose a unique username.');
            bcrypt.hash(newUser.password, 10, function(err, hash){
                if (err) return res.send(err);
                newUser.password = hash;
                newUser.save(function(err, inserted){
                    if (err) return res.send(err);
                    res.cookie('user', newUser.username, {overwrite: true, maxAge: 1000 * 60 * 60 * 24});
                    res.json();
                });
            });
        });
    });

// router.route('/users')
//     .get(function(req, res, next){
//         User.find(function(err, users){
//             if (err) return res.send(err);
//             res.json(users);
//         });
//     });
    
router.route('/allchords')

    .get(function(req, res, next) {
        //Get all the chords
        Chord.find(function(err, chords){
            if (err){
                return res.send(err);
            }
            res.json(chords);
        });
    })
    
    // .delete(function(req,res,next){
    //     Chord.remove({ }, function(err){
    //         if (err) return res.send(err);
    //         res.json('successfully removed all chords');
    //     });
    // });

router.route('/songdisplay')

    .get(function(req, res, next) {
        if (!commonFcns.redirect(res, req)){ //Not logged in
            //Get only public chords
            Chord.find({ 'isPrivate': false }, function(err, chords){
                if (err){
                    return res.send(err);
                }
                res.json(chords);
            }).sort({ '_id': -1 });
        } else {
            //Logged in = get all public chords and your private chords
            Chord.find({ $or: [ {'isPrivate': false}, {'isPrivate': true, 'user': commonFcns.getUser(req)} ] }, function(err, chords){
                if (err){
                    return res.send(err);
                }
                res.json(chords);
            }).sort({ '_id': -1 });
        }
    });
    
    
router.route('/songdisplay/:chord')     //  Update one chord

    .put(function(req, res, next){
        Chord.findOne({'_id': req.body._id }, function(err, chord){
            if (err) return res.send(err);
            chord.title = validator.escape(req.body.title);
            chord.contents = validator.escape(req.body.contents);
            chord.versionNo = 1;    //  Set to new version (since song would be different)
            chord.save();
            res.json({});
        })
    });
    
module.exports = router;