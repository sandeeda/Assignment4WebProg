
// load mongoose since we need it to define a model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
BookSchema = new Schema({
    ISBN : String,
    img : String,
	title : String,
    author : String,
    category : String
});
module.exports = mongoose.model('Book', BookSchema);

