/*
 * 通用方法合集
 */
const msg = require('./msgColor');
const fs = require('fs');
const path = require('path');
const process = require('child_process');

const common = function () {

}

// 文件处理
common.prototype.file = {
    set: function (file, message, opation) {
        return new Promise((resolve, reject) => {
            const dir = path.resolve(__dirname, file);

            fs.appendFile(dir, message, (err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        })
    },
    reset: function (file, message) {
        return new Promise((resolve, reject) => {
            const dir = path.resolve(__dirname, file);
            fs.writeFile(dir, message, (err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });

    },

    read: function (file) {
        return new Promise((resolve, reject) => {
            const dir = path.resolve(__dirname, file);
            fs.readFile(dir, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        });
    },
    readdir: function (path) {
        return new Promise((resolve, reject) => {
            fs.readdir(path, (err, fd) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    },
    readdirSync: function (path, callback) {
        return new Promise((resolove, reject) => {
            const file = fs.readdirSync(path);
            resolve(file);
        });

    },

    // 获取指定目录下指定文件合集（内部调用方法）
    getFile: function (root, fileType) {
        return new Promise((resolve, reject) => {
            const file = fs.readdirSync(root);
            const array = file.filter((name) => {
                const arr = name.split('.');
                return fileType.includes(arr[arr.length - 1])
            })
            resolve(array);
        })
    },
    open: function (file) {
        return new Promise((resolve, reject) => {
            fs.open(file, 0666, (err, d) => {
                if (err) {
                    throw err
                }
                resolve()
            });
        })

    },
    create: function (file, message, callback) {
        const _this = this;
        const array = file.split('/');
        const name = array[array.length - 1];
        if (name.indexOf('.') < 0) {
            console.error('当前目录地址格式错误');
            return false;
        }

        var root = file.substring(0, file.indexOf(name));

        common.exists({
            path: file,
            callback: function (data) {
                if (data) {
                    console.error(file + '对应目录文件已存在,创建失败');
                } else {
                    common.mkdirSync(root, () => {
                        _this.reset(file, message).then(callback());
                    });
                }
            }
        });
    },
    mkdirSync: function (root) {
        return new Promise((resolve, reject) => {
            fs.mkdir(root, 0777, (err) => {
                if (err) {
                    // console.error(root + ' =>对应目录已存在');
                    reject(err);
                } else {
                    // console.tip(root + '=> 目录已创建完成');
                }
                resolve();
            });
        });

    },
    // 判断文件是否存在
    // todo 后续用stat替换
    exists: function (obj) {
        return new Promise((resolve, reject) => {
            fs.exists(obj.path, (exists) => {
                if (!exists) {
                    reject(exists);
                }
                resolve(exists);
            });
        });

    },
    // 读取文件
    readFile: function (obj) {
        return new Promise((resolve, reject) => {
            let dir = obj.path;
            if (obj.isAbsolute) {
                dir = path.resolve(__dirname, obj.path);
            }
            fs.readFile(dir, obj.encode || 'utf8', (err, file) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(file);
                }
                // resolve(err, file);
                // obj.callback(err, file);
            });
        })

    },

};

// json 处理
common.prototype.JSON = {
    get: function (file) {
        const dir = path.resolve(__dirname, file);
        const fileStr = fs.readFileSync(dir);
        return JSON.parse(fileStr);
    }
};

// 工具类
common.prototype.tools = {
    formatDate: function (date, type, format) {
        const arr = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09'];
        const D = date.getDate(),
            M = date.getMonth() + 1,
            Y = date.getFullYear(),
            h = date.getHours(),
            m = date.getMinutes(),
            s = date.getSeconds();

        const _date = `${Y}-${arr[M] || M}-${arr[D] || D}`.split('-').join(format),
            _time = `${arr[h] || h}:${arr[m] || m}:${arr[s] || s}`
        return {
            date: _date,
            time: _time,
            fullDate: `${_date} ${_time}`
        };
    },
    formatData: function (obj, type) {
        const _this = this,
            data = decodeURI(obj.toString());
        if (type === 'json') {
            data = _this.dataToObj(data);
        }
        return data;
    },
    dataToObj: function (url) {
        var obj = {};
        var keyvalue = [];
        var key = '',
            value = '';

        var paraString = url.substring(0, url.length).split('&');
        for (var i in paraString) {
            keyvalue = paraString[i].split('=');
            key = keyvalue[0];
            value = keyvalue[1];
            obj[key] = value;
        }
        return JSON.stringify(obj);
    },
    getDir: function () {
        return new Promise((resolve, reject) => {
            process.exec(`pwd`, (err, stdout, stderr) => {
                if (!!err) {
                    reject(err);
                } else {
                    resolve(stdout);
                }
            })
        });
    }
};

common.prototype.template = {
    templateReg : /\{\{(.*?)\}\}/g,
    render: function (template, context) {
        reg = this.templateReg;
        return template.replace(/\{\{(.*?)\}\}/g, (match, key) => {
            const arr = key.split('.'); // 判断是否携带功能参数
            let str = '';
            const _key = arr[0]
            if (arr.length > 1) {
                const type = arr[1];
                const _val = context[_key];
                if (type === 'encode') {
                    str = encodeURIComponent(_val);
                } else if (type === 'decode') {
                    str = decodeURIComponent(_val);
                }
            } else {
                str = context[_key];
            }
            return str;
        });
    },
    getTemplateKey:function(template){
        reg = this.templateReg;
        const str = reg.exec(template)[1];
        if(str.indexOf('.')){
            return str.split('.')[0]
        }else{
            return str;
        } 
    }
}

// 打印日志
common.prototype.msg = msg;

const utils = new common();
module.exports = utils;