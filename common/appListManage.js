const _configRoot = '../data/config.json';
const _defaultConfigRoot = '../data/pan.json';
const utils = require('./utils');
const question = require('./question');
const _config = require(_configRoot);
const listJSONRoot = _config.panJSON;
// const _listJSONRoot = _config.panJSON;

const fs = require('fs');
const path = require('path');
const log = utils.msg;


class common {
  constructor() {
    this.state = {
      json: utils.JSON.get(listJSONRoot)
    }
  }

  /**
   * 获取配置项list
   * 
   * @returns 
   * @memberof common
   */
  getList() {
    return new Promise((resolve, reject) => {
      utils.file.read(listJSONRoot).then((file) => {
        resolve(file);
      });
    }).catch((err) => {
      reject(err);
    })

  }

  /**
   * 插入app信息
   * 
   * @param {any} info 
   * @returns 
   * @memberof common
   */
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

  /**
   * 判断当前信息能否添加
   * 
   * @param {any} info 
   * @param {any} json 
   * @returns 
   * @memberof common
   */
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

  /**
   * 删除数据
   * 
   * @param {any} info 
   * @returns 
   * @memberof common
   */
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
        log.success(`${info.name} 已成功删除`);
        resolve()
      }).catch((err) => {
        reject(err);
      });
    })
  }
  /**
   * 更新app配置项
   * 
   * @param {any} info 
   * @returns 
   * @memberof common
   */
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
          log.success(`${info.name} 已修改成功`);
          resolve();
        });
      } else if (!result.flag && result.errorCode === '0') {
        reject();
      }
    })
  }
  /**
   * 导入配置项
   * 
   * @param {any} answers 
   * @memberof common
   */
  importConfig(answers) {
    utils.file.readFile({
      path: answers.url,
      isAbsolute: false,
    }).then((data) => {
      utils.file.reset(listJSONRoot, data);
    }).catch(err => console.log(err))
  }
  /**
   * 导出配置项
   * 
   * @param {any} answers 
   * @memberof common
   */
  exportsConfig(answers) {
    utils.file.readFile({
      path: listJSONRoot,
      isAbsolute: true
    }).then((data) => {
      utils.file.reset(answers.url, data);
      log.success('== success ==');
    }).catch(err =>log.error(err));
  }
  /**
   * 将默认目录更改为自定义目录
   * 
   * @param {any} answers 
   * @memberof common
   */
  userDefined(answers) {
    _config.panJSON = answers.url;
    const jsonStr = JSON.stringify(_config, '', 2);
    utils.file.reset(_configRoot, jsonStr);
    log.success('== success ==');
  }
  /**
   * 重置回默认配置项地址
   * 
   * @param {any} answers 
   * @memberof common
   */
  resetConfig(answers) {
    _config.panJSON = _defaultConfigRoot;
    const jsonStr = JSON.stringify(_config, '', 2);
    utils.file.reset(_configRoot, jsonStr);
    log.success('== success ==');
  }
  /**
   * 使用当前目录文件作为配置项，同步到默认配置项文件，防止文件被删
   * 
   * @param {any} answers 
   * @memberof common
   */
  async useThisDirFile(answers) {
    
    const url = `./${answers.fileName}`;
    utils.file.readFile({
      path: url
    }).then(data => {
      utils.file.reset(listJSONRoot, data);
      log.success('== success =='); 
    }); 
  }
}
module.exports = new common();