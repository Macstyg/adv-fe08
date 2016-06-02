var express = require( 'express' );
var path = require( 'path' );
var fs = require( 'fs' );
var url = require('url');
var apiVersion = require('./package').version;

var app = express();

app.set('port', 5000);

app.listen(app.get('port'), function() {
    console.log('Node app is running on http://localhost:' + app.get('port') );
});


app.get('/', function (req, res) {
    var urlParsed = url.parse(req.url, true);

    console.log(urlParsed);

    res.send('<html><body><h1>My web app http API! Version ' + apiVersion + ' </h1></body></html>');
});

app.all('/test/', function (req, res) {
    res.send('<html><body><h1>Hello test</h1></body></html>');
});



app.all('/api/' + apiVersion + '/*', function (req, res) {
    // console.log(req);

    render(req, res);
});

function render(req, res) {
  'use strict';
  let urlPath = `${req.path}`.replace(`/${apiVersion}/`, '/'), // <-- /api/1.0.1/users
      fullPath = path.join(__dirname, urlPath); // <-- /Users/yaroslavmuliar/Desktop/githubs/advanced-frontend/adv-fe08/api/users


  fs.readdir(fullPath, (err, files) => {
    if (err) console.log(err);

    files.forEach( (element, index) => {
      let fileName = `${req.path}/${element}/${req.method.toLowerCase()}.json`.replace(`/${apiVersion}/`, '/'), // < /api/users/001/get.json
          filePath = path.join(__dirname, fileName);    // /Users/yaroslavmuliar/Desktop/githubs/advanced-frontend/adv-fe08/api/users/001/get.json

          fs.stat(filePath, (err, stats) => {
            if (err) console.log(err);

            if (stats.isDirectory()) {

              res.setHeader('content-type', 'application/json');
              fs.createReadStream(filePath).pipe(res);

            } else {
               console.log('no such file', filePath);
                   res
                       .status(404)
                       .json([
                           {
                               "info": {
                                   "success": false,
                                   "code": 12345
                               }
                           }
                       ])
                       .end();
            }
          })

    });

  });



    // console.log('req.path = ', req.path);

}

//
//app.get('/api/1.0/users', function (req, res) {
//    res.send(users);
//});
//
//app.get('/api/1.0/users/:userId', function (req, res) {
//
//    console.log(req.query);
//
//    res.send(user);
//});
