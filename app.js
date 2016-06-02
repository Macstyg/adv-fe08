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

    var fileName = req.path + '/' + req.method.toLowerCase() + '.json';
    //   /api/1.0.1/users/get.json
    fileName = fileName.replace('/' + apiVersion + '/', '/');
    //   /api/users/get.json
    var filePath = path.join(__dirname, fileName);
    console.log(req.method, filePath);
    // /Users/puzankov/work/fs/node-js-getting-started/api/users/get.json

    if (fs.statSync(filePath)) {

        res.setHeader('content-type', 'application/json');

        fs.createReadStream(filePath).pipe(res);
    }
    else {
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


