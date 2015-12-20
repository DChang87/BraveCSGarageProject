var HOST = "192.168.150.181"; // This should be your IP of 192.168.150.XXX
var PORT = 5007;        // Send to PORT 5007 which the sample-listen is listening on

var http = require('http');

var message = {
    carID: '65432',
    lift: 'L1',
    floor: 2
};

var options = {
    host: HOST,
    path: '/INPARK/',
    port: PORT,
    method: 'POST'
};

var req = http.request(options, function (res) {
    var buffer = '';
    res.on('data', function (chunk) {
        buffer += chunk;
    });
    res.on('end', function () {
        var json = '';
        try {
            json = JSON.parse(buffer);
        } catch (err) { }
        console.log(buffer);
    });
});

req.write(JSON.stringify(message));
req.end();
