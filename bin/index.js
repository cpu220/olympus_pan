#!/usr/bin/env node

const program = require('commander'),
  appInfo = require('./../package.json'),
  ios = require('../lib/ios.js'),
  _ip = require('../lib/ip.js'),
  _path = require('../lib/path.js'),
  
  color = require('colors-cli/toxic');





program
  // .allowUnknownOption()//不报错误
  .version(`pan@${appInfo.version}`,'-v, --version')
  .usage('\n pan '.x34 + '为本地debug工具，致力于为开发提供各种便捷的服务。\n  '.x33 + '目标为：更高的开发效率，更好的代码质量，更早下班')
  .description(`内部工具，请注意使用`.x33 + `当前版本${appInfo.version}`)
  .parse(process.argv);


program
  .command('ios [cmd]')
  .description('这个是基于xcode的模拟器，用来快速在对应iphone上调试H5页面，初期启动需要1分钟左右来安装客户端'.x29)
  .option('-s --start [type]', '启动模拟器')
  .option('-i --install [type]', '安装客户端（每个simulator的安装包是独立的，所以需要保持simulator的激活状态）')

  // .option('-d --delete [type]', '卸载客户端')
  .option('-y --yanxuan [type]', '启动模拟器并打开严选app')
  .option('-u --url [type]', '必须跟参数，直接打开参数所带的H5地址')
  .option('-t --translate [type]', 'encode url地址，用于生辰更直接在客户端内执行的命令')
  // .option('--init [type]', '初始化appList')
  .option('--add [type]', '对本地list添加app信息')
  .option('--update [type]', '更新指定app信息')
  .option('--remove [type]', '移除指定app')
  .option('--info [type]', '获取指定app的信息')
  .option('--config [type]','同步配置项')
  .option('--use [type]','配置默认的客户端，如iphone/ipad')
  .action(function (cmd, options) {
    ios(cmd, options); 
  }).on('--help', function () {
    console.log('ios simulator'.x29);
  })

program
  .command('ip [cmd]')
  .option('-p --ip [type]', '获取ip')
  .description('获取当前设备ip信息'.x29)
  .action(function (cmd, options) {
    _ip(cmd, options);
  }).on('--help', function () {
    console.log('获取ip');
  })

  program
  .command('path [cmd]')
  .description('当前路径信息'.x29)
  .action(function (cmd, options) {
    _path(cmd, options);
  }).on('--help', function () {
    console.log('获取路径信息');
  })

//默认不传参数输出help
if (!process.argv[2]) { 
  program.help(); 
}
program.parse(process.argv);