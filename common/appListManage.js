const utils = require('./utils');
const listJSONRoot = '../data/pan.json';

class common {
  constructor() {
    this.state = {
      json: utils.JSON.get(listJSONRoot)
    }
  }

  // 获取list
  getList() {
    return new Promise((resolve, reject) => {
      utils.file.read(listJSONRoot).then((file) => {
        resolve(file);
      });
    }).catch((err) => {
      reject(err);
    })

  }

  // 插入app信息
  addApp(info) {
    const {
      json
    } = this.state;
    
    return new Promise((resolve, reject) => { 
      const result = this.judgeInfo(info, json); 
      if (!result.has) {
        json.list.push(info);
        utils.file.reset(listJSONRoot, JSON.stringify(json, null, 2)).then(() => {
          console.log(`${info.name} 添加成功`);
          resolve();
        });
      } else if (result.errorCode === '1') {
        reject('有重复')
      } else if (result.errorCode === '2') {
        // 暂时不做处理，基本不会出现信息不全的问题。除非手动改配置文件
        // console.log('信息不全')
        // reject(); 
      }
    });

  }

  // 判断当前信息能否添加
  judgeInfo(info, json) {
    let result = {
      index: 0,
      errorCode: '0',
      has: false
    };
    if (!!info.name) {
      for (let i = 0; i < json.list.length; i++) {
        if (info.name === json.list[i].name) {
          result = Object.assign({}, {
            index: i,
            errorCode: '1',
            has: true
          })
          break;
        }
      }
    } else {
      result = Object.assign({}, {
        errorCode: '2',
        has: true
      });
    }
    return result;
  }

  // 删除数据
  removeApp(info) {
    const {
      json
    } = this.state;
    return new Promise((resolve, reject) => {
      let result = [];
      if (!!info.name) {
        result = json.list.filter((item, index) => {
          return item.name !== info.name;
        });
      }
      json.list = result;

      utils.file.reset(listJSONRoot, JSON.stringify(json, null, 2)).then(() => {
        console.log(`${info.name} 已成功删除`);
        resolve()
      }).catch((err) => {
        reject(err);
      });
    })
  }
  updateApp(info) {
    const {
      json
    } = this.state;
    let flag = false;
    const result = this.judgeInfo(info, json);
    
    return new Promise((resolve, reject) => {
      if (result.has) {
        json.list[result.index] = info; 
        utils.file.reset(listJSONRoot, JSON.stringify(json, null, 2)).then(() => {
          console.log(`${info.name} 已修改成功`);
          resolve();
        });
      } else if (!result.flag && result.errorCode === '0') {
        reject();
      }
    })

  }
}
module.exports = new common();
