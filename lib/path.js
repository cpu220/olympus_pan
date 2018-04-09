 
const process = require('child_process');

function pathTools (cmd, opations) { 
  
  process.exec(`pwd`, (err, stdout, stderr)=>{
    console.log(stdout);
  }) 
}

module.exports = pathTools;