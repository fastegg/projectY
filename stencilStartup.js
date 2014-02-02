//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//														//
// 				Stencil Startup         	           	//
//	This is just an example web server with stencil		//
//	drawing from objects. This should never get 		//
// 	included in any project								//
//														//
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////

var app = require('http');
var stencil = require('./stencil/stencil');

var server = app.createServer(drawStencil);

console.log('Requesting to load stencils...');
stencil.loadStencils('./stencil/Stencils/');

server.listen(1773);

console.log('Stencil Example Server now listening on: 1773');


function drawStencil(req, res)
{
	var profile = {
		name: 'Michael McCarry',
		age: 29,
		sex: 'Male',
		friends: [{name: 'Ashley Farabee', age: 24, sex: 'Female', relationship: 'Girlfriend' },
		{name: 'Gary Malare', age: 100, sex: 'Male', relationship: 'Training Partner'},
		{name: 'April Cooley', age: 30, sex: 'Female', relationship: 'Training Partner'} 
		]
	};

	var rootObj = {profile: profile};

	res.end(stencil.fillStencil('example.html', rootObj));
}