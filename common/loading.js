
const BottomBar = require('../utils/bottom-bar'); 
const cmdify = require('cmdify'); 
function loader() { 
  this.state = {
    timer: null,
    loaderList: ['/ ', '| ', '\\ ', '- '],
    loaderListIndex: 4,
  }

  this.setState = (obj) => {
    const state = { ...this.state,
      ...obj
    };
    this.state = state;
  }
  this.init = (opation) => {
    this.setState(opation);
    const {
      index,
      loaderList
    } = this.state;
    const length = loaderList.length;
    this.ui = new BottomBar({
      bottomBar: loader[index % length]
    });
  }
  this.start = () => {
     
    const _this = this;
    const {
      loaderList
    } = this.state;
    let i = 0; 
    this.state.timer = setInterval(() => {
      _this.ui.updateBottomBar(loaderList[i++ % 4]);
    }, 300);
  }
  this.end = () => {
    // console.log('end2'); 
    clearInterval(this.state.timer);
    process.exit();
  }
}

module.exports = loader;
 