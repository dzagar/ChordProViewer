var mongoose = require('mongoose');
var Schema       = mongoose.Schema;

var ChordSchema = new Schema({
    title: String,
    user: String,
    contents: String,
    isPrivate: Boolean,
    versionNo: Number,
    lastRevision: String
});

module.exports = mongoose.model('Chord', ChordSchema);
