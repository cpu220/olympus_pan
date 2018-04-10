const path = require('path');
const fs = require('fs');
const utils = require('./utils');

const inquirer = require('inquirer');
const _config = require('../data/config.json');
const listJSONRoot = _config.panJSON;
const appJson = require(listJSONRoot);
const process = require('child_process');
const iosTools = require('./iosTools');

class question {
  constructor() {
    this.state = {

    }
    this.getAppName = this.getAppName.bind(this);
    this.getIphoneList = this.getIphoneList.bind(this);

    this.chooseApp = this.chooseApp.bind(this);
    this.chooseDevice = this.chooseDevice.bind(this);
    this.inputAppInfo = this.inputAppInfo.bind(this);

    this.confirm = this.confirm.bind(this);

  }
  // 获取appName 列表 
  getAppName() {
    let result = [];
    const listLength = appJson.list.length;
    for (let i = 0; i < listLength; i++) {
      result.push(appJson.list[i].cname);
    }
    return result;
  }
  //  获取当前设备的模拟器list
  getIphoneList() {
    return new Promise((resolve, reject) => {
      console.log('== 正在获取本地设备清单 =='.x34);
      console.log('ps: 首次启动时间较长，请耐心等待... \n');
      process.exec("xcrun instruments -w 'iphone'", (err, stdout, stderr) => {
        const arr = stderr.split('\n')
        const iphoneList = [];
        for (let i = 1; i < arr.length; i++) {
          if (/^iPhone/.test(arr[i])) {
            iphoneList.push(arr[i]);
          }
        }
        resolve(iphoneList.reverse());
      });
    })
  }
  /**
   * 获取本地的applist，并给与选择
   * 
   * @memberof question
   */
  chooseApp(callback) {
    const list = this.getAppName();
    if (list.length === 0) {
      console.log('当前未添加任何app信息,如想添加请查阅文档');
      callback(false);
    } else {
      const appList = [{
        type: 'list',
        name: 'app',
        message: 'choose a app',
        choices: this.getAppName() || [],
        filter: function (val) {
          return val;
        }
      }];

      inquirer.prompt(appList).then(function (answers) {
        if (!!callback) {
          callback(answers);
        }

      });
    }

  }
  /**
   * 获取本地设备清单，并给与选择
   * 
   * @param {any} callback 
   * @memberof question
   */
  chooseDevice(callback) {
    this.getIphoneList().then(data => {
      const list = [{
        type: 'list',
        name: 'iphone',
        message: '选择设备',
        choices: data,
        filter: function (val) {
          return val;
        }
      }];
      inquirer.prompt(list).then(function (answers) {
        if (!!callback) {
          callback(answers);
        }
      });
    })
  }
  inputAppInfo() {
    const _this = this;

    return new Promise((resolve, reject) => {
      const list = _this.formatInfoList({});

      inquirer.prompt(list).then(function (answers) {
        const result = _this.formatInfoListForResult(answers);
        resolve(result);
      });
    });

  }
  /**
   * 用于条件判断
   * 
   * @param {any} msg 
   * @memberof question
   */
  confirm(msg, callback) {
    const list = [{
      type: 'confirm',
      name: 'flag',
      message: msg
    }];

    return new Promise((resolve, reject) => {

      inquirer.prompt(list).then(function (answers) {
        resolve(answers);
      });
    })
  }
  /**
   * 更新app，并获取更新后的数据
   * 
   * @param {any} appInfo 
   * @returns 
   * @memberof question
   */
  updateApp(appInfo) {
    const _this = this;
    // console.log(appInfo);
    return new Promise((resolve, reject) => {
      const list = _this.formatInfoList(appInfo);

      inquirer.prompt(list).then(function (answers) {
        const result = _this.formatInfoListForResult(answers);
        result.name = appInfo.name; // name为主键，不允许修改
        resolve(result);
      });
    })

  }
  formatInfoList(appInfo) {
    const name = [{
      type: 'input',
      name: 'name',
      message: 'app的英文名(用于启动指令)',
      validate: (val) => {
        if (val.trim() === '') {
          return '请填写app的英文名';
        }
        return true;
      }
    }]
    const list = [{
        type: 'input',
        name: 'cname',
        default: appInfo.cname || null,
        message: 'app的中文名(用于list展示)',
        validate: (val) => {
          if (val.trim() === '') {
            return '请填写app的中文名';
          }
          return true;
        }
      }, {
        type: 'input',
        name: 'packageName',
        message: 'app文件名(xxx.app)',
        default: appInfo.packageName || null,
        validate: (val) => {
          if (val.trim() === '') {
            return '请填写正确的packageName';
          }
          return true;
        }
      }, {
        type: 'input',
        name: 'boundId',
        message: '请填写boundId',
        default: appInfo.boundId || null,
        validate: (val) => {
          if (val.trim() === '') {
            return '请填写boundId';
          }
          return true;
        }
      }, {
        type: 'input',
        name: 'scheme',
        message: '请填写scheme(用于调用对应app打开H5页面,如:xxx://webview?url=)',
        default: appInfo.scheme || null,
        validate: (val) => {
          if (val.trim() === '') {
            return '请填写scheme';
          }
          return true;
        }
      },
      {
        type: 'input',
        name: 'url',
        message: 'app包仓库地址(git地址),用于存放对应app包，如果不需要安装可以不填写直接回车',
        default: !!appInfo.repository ? appInfo.repository.url : null,
        // validate: (val) => {
        //   if (!/^git/.test(val)) {
        //     return '请填写正确的仓库地址,如 git@xxx';
        //   }
        //   return true;
        // }
      }
    ];
    if (!!appInfo.name) {
      return list;
    } else {
      return [].concat(name, list);
    }

  }
  formatInfoListForResult(answers) {
    return Object.assign({}, {
      "name": answers.name || '',
      "cname": answers.cname,
      "packageName": answers.packageName,
      "boundId": answers.boundId,
      "scheme": answers.scheme,
      "repository": {
        "type": "git",
        "url": answers.url
      }
    });
  }
  // 输入地址
  async getConfig() {
    const _this =this;
    const file = await utils.file.getFile('./', ['json', 'js']);
    const configList = [{
      type: 'list',
      message: '请选择操作类型',
      name: 'type',
      choices: [{
        name: '导出',
        value: 'export'
      }, {
        name: '导入',
        value: 'import'
      }, {
        name: '自定义配置项目录',
        value: 'userDefined'
      }, {
        name: '重置',
        value: 'reset'
      }, {
        name: '使用当前目录文件',
        value: 'this'
      }],
    }, {
      type: 'input',
      name: 'url',
      message: "请输入地址",
      when: (answers) => {
        if (answers.type !== 'reset' && answers.type !== 'this') {
          return answers.type;
        }
      },
      validate: (val) => {
        let _urlObj = path.parse(val);
        if (!!_urlObj.ext.trim() === false) {
          return '请填写准确的文件地址(xxx/xxx/xxx.xx)';
        }
        return true;
      }
    }, {
      type: 'list',
      name: 'fileName',
      message: '输选择文件名',
      choices:file||[],
      when: (answers) => {
        if (answers.type === 'this') {
          return answers.type;
        }
      },
      filter: function (val) {
        return val;
      }
    }];
    return new Promise((resolve, reject) => {
      inquirer.prompt(configList).then((answers) => {
        resolve(answers);
      }).catch(err => {
        reject(err);
      });
    });

  }


}
// const a = new question();
module.exports = new question();

// a.chooseApp()