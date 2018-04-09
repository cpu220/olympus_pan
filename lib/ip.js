 
const os = require("os");

function ipTools (cmd, opations) {
 
    var hostName = os.hostname();
    var ifaces = os.networkInterfaces();
    var ip = [];
    for (var x in ifaces) {

      for (var y in ifaces[x]) {
        var object = ifaces[x][y];
        if (object["family"] === 'IPv4') {
          ip.push(object.address);
        }
      }

    }
    var json = {
      ip: ip,
      host: hostName,
      system: os.type(),
      release: os.release(),

    };

    return console.log( JSON.stringify(json) );
   
}

module.exports = ipTools;