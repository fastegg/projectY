//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//														//
// 				Database Startup                    	//
//	This is just an example database server with simple //
// exaples on how to use it.							//
// This should not get included in any project			//
//														//
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////

var db = require('./database/database');

//Adding some schemas before connecting
db.addSchema('profile', {
	accountID: Number,
	name: String,
	picture: String, 
	age: Number,
});

db.addSchema('account', {
	accountID: Number,
	email: String
});

function onDBConnect()
{
	var Profile = db.getModel('profile');

	console.log('Finding profiles...');

	Profile.find(function (err, profiles) {
		if (err) // TODO handle err
		{
			console.error.bind(console, err);
		}
		else
		{
			console.log('Found ' + profiles.length + ' profiles:', profiles);

			if(profiles.length === 0)
			{
				var profileModel = db.getModel('profile');

				var newProfile = new profileModel({accountID: 1, name: 'Michael McCarry', picture: 'mm01.jpg', age: '29'});

				newProfile.save();
			}
		}
	});
}

//connect to the database
db.connect('mongodb://localhost/test', onDBConnect);