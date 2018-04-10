const fs = require('fs');
const question = require('./question');
const utils = require('./utils');

const _config = require('../data/config.json');
const listJSONRoot = _config.panJSON;
const appJson = require(listJSONRoot);

const process = require('child_process');

color = require('colors-cli/toxic');

const loader = require('./loading');

const appLoad = new loader()
const root = './temp';
const log = utils.msg;

class common {
  constructor() {


    this.installPak = this.installPak.bind(this);
    this.removePak = this.removePak.bind(this);
    this.installPackage = this.installPackage.bind(this);
  }

  // 安装app
  installPak(info, cb) {
    const _this = this;
    appLoad.init();
    appLoad.start();
    process.exec(`xcrun simctl install booted ${root}/app/${info.packageName}`, (err, stdout, stderr) => {
      console.log('== 安装完毕 == '.x34);
      _this.removePak().then(() => {
        appLoad.end();
        if (!!cb) {
          cb()
        }
      }).catch((err) => {

      })
    });
  }
  // 删除app安装文件
  removePak() {
    return new Promise((resolve, reject) => {
      process.exec(`rm -rf ${root}`, function (err, stdout, stderr) {
        if (!!err) {
          reject(err)
        } else {
          resolve();
        }
        appLoad.end();
      });
    })
  }
  // 安装指定客户端
  installPackage(info) {

    const _this = this;
    appLoad.init();
    appLoad.start();
    fs.readdir(root, 'utf8', (err, files) => {
      if (!!files && files.length > 0) {
        // 如果已经有安装包，则开始安装
        _this.installPak(info);
      } else {
        if (info.repository.type === 'git') {
          process.exec(`git clone ${info.repository.url} temp`, (err, stdout, stderr) => {
            if (!!err) {
              console.log('== 安装失败，请检查是否具备对应权限 =='.x33)
              appLoad.end();
            } else {
              // 下载完毕后，开始安装
              _this.installPak(info);
            }
          });
        } else if (info.repository.type === 'ftp') {
          // console.log('用ftp下载');

        }
      }
    });
  }
  // 简单处理下，为了判断当前是否有客户端
  getDir(url) {
    return new promise((resolve, reject) => {
      fs.readdir('./app', (err, list) => {
        if (!!list && list.length > 0) {
          resolve(list);
        } else {
          reject();
        }
      })
    });
  }

  translateURL(url, info) {
    let head = '';
    let _url = url;

    try {
      if (!!info.scheme) {
        // head = info.scheme; 
        const template = info.scheme;
        if (/\{\{(.*?)\}\}/.test(template)) {
          // 含有模板规则 
          // 考虑到后续的扩展性，不建议封装在一起
          const key = utils.template.getTemplateKey(template);
          const json = {};
          json[key] = url;
          _url = utils.template.render(template, json);
        } else {
          // 不含模板规则
          head = template;
          _url = encodeURIComponent(url);
        }
      } else {

        head = '';
      }
    } catch (error) {
      console.log(error);
    }
    return `${head}${_url}`;
  }
  // 找到对应appInfo
  getAppInfo(name, key) {
    let result = {};
    const listLength = appJson.list.length;
    for (let i = 0; i < listLength; i++) {
      if (name === appJson.list[i][key]) {
        result = appJson.list[i];
        break;
      }
    }
    return result;
  }
  // 打开iphone 
  openIphone(cb) {
    // 选择设备
    question.chooseDevice((answers) => {
      process.exec(`xcrun instruments -w '${answers.iphone}'`, (error, stdout, stderr) => {
        console.log('\n== 正在启动客户端 == \n'.x34)
        // appLoad.end();
        if (!!cb) {
          cb();
        }
      });
    });
  }
  openUrl(url, cb) {
    const _this = this;
    return new Promise((resolve, reject) => {
      process.exec(`xcrun simctl openurl booted '${url}'`, (error, stdout, stderr) => {
        if (!!error && error.code === 163) {
          // 客户端还未启动
          log.info('启动客户端')
          _this.openIphone(() => {
            _this.openUrl(url, cb);
          })
        } else {
          log.success('== success ==');
          resolve();
        }
      });
    });
  }
  judgeTypeAndChooseList(type) {
    const _this = this;
    let _type = 'list';
    if (type !== true) {
      _type = type;
    }

    return new Promise((resolve, reject) => {

      if (_type === 'list') {
        question.chooseApp((answers) => {
          const appInfo = _this.getAppInfo(answers.app, 'cname');
          resolve(appInfo);
        });

      } else {
        const appInfo = _this.getAppInfo(_type, 'name');


        if (appInfo.name) {
          resolve(appInfo);
        } else {

          reject();
        }
      }
    })
  }


}

module.exports = new common();