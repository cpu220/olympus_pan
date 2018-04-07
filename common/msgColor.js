const msg = {
  error: (text) => {
      console.log('\033[31m' + text + '\033[m');
  },
  log: (text) => {
      console.log('\033[34m' + text + '\033[m');
  },
  warn: (text) => {
      console.log('\033[33m' + text + '\033[m');
  },
  tip: (text) => {
      console.log('\033[36m' + text + '\033[m');
  },
  info: (text) => {
      console.log('\033[36m' + text + '\033[m');
  },
  success:(text)=>{
      console.log('\033[32m' + text + '\033[m');
  },
  hide:(text)=>{
      console.log('\033[30m' + text + '\033[m')
  }
};
module.exports = msg;
