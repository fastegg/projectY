var mongoose = require('mongoose');

var db = function()
{
	var dbCheck = this;
	
	this.schemas = {};
	this.models = {};
	
	this.dbCon = mongoose.connection;
	this.mongoose = mongoose;

	//There was an error of somesort. This should get better...
	this.dbCon.on('error', console.error.bind(console, 'connection error:'));

	this.dbCon.once('open', function callback () {
		console.log('Connected to database!');
		console.log('Loading schemas..');

		for(var schema in dbCheck.schemas)
		{
			console.log('\tAdding Schema ' + schema);
			dbCheck.schemas[schema] = mongoose.Schema(dbCheck.schemas[schema]);

			//console.log(dbCheck.schemas[schema])
			dbCheck.models[schema] = mongoose.model(schema, dbCheck.schemas[schema]);
		}

		if(dbCheck.onConnect)
		{
			console.log('Running onConnect');
			dbCheck.onConnect();
		}

		console.log('Loading schemas done!');
	});
}


db.prototype.connect = function(address, onConnect)
{
	console.log('Attempting to connect to database: ' + address);
	this.onConnect = onConnect;
	return mongoose.connect(address);
}

db.prototype.addSchema = function(name, schema)
{
	//return mongoose.Schema(schema);

	if(this.schemas[name])
	{
		console.error.bind(console, 'Duplicate Schema Found!', name, schema, this.schemas[name]);
	}
	else
	{
		this.schemas[name] = schema;

	}
}

db.prototype.getModel = function(name)
{
	return this.models[name];
}

module.exports = new db();