const fs = require('fs');
const question = require('./question');
const appJson = require('../data/pan.json');
const process = require('child_process');

color = require('colors-cli/toxic');

const loader = require('./loading');

const appLoad = new loader()
const root = './temp';


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
    let head;
    if (!!info.scheme) {
      head = info.scheme;
    } else {
      head = info;
    }
    return `${head}${encodeURIComponent(url)}`;
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
        if (!!error) {
          console.log('启动客户端')
          _this.openIphone(() => {
            _this.openUrl(url, cb);
          })
        } else {
          console.log('== success =='.x34);
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