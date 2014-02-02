var path = require('path');
var fs = require('fs');
var cheerio = require('cheerio');

var stencil = function()
{
	this.stencils = {};
}

function parseRecurse($, curPath)
{
	var rtn = {};
	var i;

	if($.type != 'tag')
	{
		return;
	}

	if($.attribs)
	{
		for(var attrib in $.attribs)
		{
			if(attrib === 'data-path')
			{
				//Check to see if it starts with a '.'
				if($.attribs[attrib].indexOf('.') === 0)
				{
					$.dataPath = 'obj' + $.attribs[attrib];	
				}
				else
				{
					$.dataPath = 'root.' + $.attribs[attrib];
				}
			}	
		}
	}

	if($.children && $.children.length > 0)
	{
		for(i=0;i<$.children.length;i++)
		{
			parseRecurse($.children[i], $.dataPath);
		}
	}
}

stencil.prototype.loadStencils = function(stencilPath)
{
	console.log('Loading Stencils...');
	sPath = path.resolve(stencilPath);

	var filenames = fs.readdirSync(sPath);
	var i;
	var iCount = 0;

	for(i=0;i<filenames.length;i++)
	{
		this.stencils[filenames[i]] = {};

		var html = fs.readFileSync(sPath + '\\' + filenames[i]);
		var $ = cheerio.load(html);
		
		var parsed = $('html')['0'];
		parseRecurse(parsed, 'root');

		this.stencils[filenames[i]].html = html;
		this.stencils[filenames[i]].$ = parsed;

		iCount++;
	}

	console.log('Finished. ' + iCount + ' stencils loaded');
}

function fillRecurse($, obj, objType, root)
{
	var htmlRtn = '';

	//console.log('Checking.. ', $);

	if($.name === 'br')
	{
		console.log($);
	}

	if($.type === 'text')
		htmlRtn = $.data;
	else if($.type === 'tag')
	{
		htmlRtn = '<' + $.name + '>';

		//Evaulate the obj
		if($.dataPath)
		{
			obj = eval($.dataPath);
			objType = Object.prototype.toString.call(obj);
		}

		//console.log($.name, $.dataPath, obj, typeof obj);

		if(objType === '[object Number]' || objType === '[object String]')
		{
			htmlRtn += obj;
		}
		else if(objType === '[object Object]')
		{
			for(i in $.children)
			{
				htmlRtn += fillRecurse($.children[i], obj, objType, root);
			}
		}
		else if(objType === '[object Array]')
		{
			for(i in obj)
			{
				for(n in $.children)
				{
					var newType = Object.prototype.toString.call(obj[i]);
					htmlRtn += fillRecurse($.children[n], obj[i], newType, root);
				}
			}
		}

		htmlRtn += '</' + $.name + '>';
	}

	return htmlRtn;
}

stencil.prototype.fillStencil = function(stencil, root)
{
	return fillRecurse(this.stencils[stencil].$, root, Object.prototype.toString.call(root), root);
}

module.exports = new stencil();