var Sequelize = require('sequelize');

//sequelize-auto -o "./service/models" -d ifix -h i-make.kr -u root -p 3306 -x acac1202 -e mysql


var host = process.platform === "win32" || process.platform === "darwin" ? "i-make.kr" : "localhost";
var sequelize = new Sequelize('mysql://root:acac1202@'+host+'/ifix',{
	define : {
		timestamps: false
	},
	logging: true
});
var fs = require("fs");
var path = require("path");
var db = {};
fs.readdirSync(__dirname+"/"+"models").forEach(function(file) {
	if(file.indexOf(".js") > -1) {
		var name = file.replace(".js","");
		db[name] = sequelize.import(path.join(__dirname+"/models", file));
	}
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.PhoneModel.hasMany(db.FixPrice, {foreignKey: 'phoneId', useJunctionTable: false});
db.Store.hasMany(db.AttachFile, {foreignKey: 'storeId', useJunctionTable: false});
db.Group.hasMany(db.Store, {foreignKey: 'groupId', useJunctionTable: false});
db.Contact.hasMany(db.ContactComment, {foreignKey: 'contactId', useJunctionTable: false});
db.Contact.hasMany(db.ContactComment, {foreignKey: 'contactId', useJunctionTable: false});
db.Contact.belongsTo(db.Store, {foreignKey: 'storeId', targetKey: 'storeId'});
db.Contact.belongsTo(db.PhoneModel, {foreignKey: 'phoneId', targetKey: 'phoneId'});
module.exports = db;
