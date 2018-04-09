## 说明
> 潘神（Pan）,希腊神话中司羊群和牧羊人的神，被认为是帮助孤独的航行者驱逐恐怖的神。

> 就像在希腊神话中羊是不可或缺的一样，我们同样希望 Pan，能够帮助开发者驱逐一些因环境及条件等因素带来的疑难杂症。缩减问题复现及定位的时间。



### 使用条件
* 一台装有xcode 的mac
* 本地安装node

### 使用说明

#### 安装

``` javascript
npm install olympus-pan -g 

// 不建议使用sudo来进行安装，可以使用下面命令进行去sudo
sudo chown -R $USER /usr/local
```

* 安装完毕后，请输入 `pan -v` 来查看是否安装成功。如果提示 `pan command not found`则安装失败

#### 使用

``` javascript
pan ios -s  // 该命令为启动客户端
```

* 第一次启动，会看到 `当前未添加任何app信息,如想添加请查阅文档` 的提示。这是因为pan 扩展了对app管理的自定义模式，pan仅为对模拟器的调用及调试工具，与客户端管理解耦。用户根据自身业务自行对pan的配置项进行添加

![start_pan_github.gif](http://7xqv6o.com1.z0.glb.clouddn.com/start_pan_github.gif) 

#### 添加配置项
* pan 内置了对配置项增、删、改、查的本地方法。使用方法如下


* pan ios --add // 添加客户端

![Snip20180408_5.png](http://7xqv6o.com1.z0.glb.clouddn.com/Snip20180408_5.png) 

* pan ios --remove [type] // 删除配置项 [type] 为可选参数，如填写，则直接删除指定配置项，默认为空，即出现删除选择列表
 * 比如：pan ios --remove xxx ，就会直接删掉xxx的配置项，跳过选择list 
* pan ios --info [type] // 获取对应客户端配置项内容
* pan ios --upadte [type] // 更新指定客户端配置项，应用场景:比如git仓库修改

#### 手动修改配置项

配置项格式如下:

 ```
{
  "name": 你客户端的英文名，用于客户端启动标记,唯一且不能重复
  "cname": 客户端中文名,
  "packageName": 客户端包名称,
  "boundId": 客户端对应的boundId,
  "scheme": 客户端对应的scheme呼叫h5指令，通常是xxxx://xxx?url= 的格式,
  "repository": {
    "type": "git",
    "url": 客户端所在地址
  }
},
 ```
 

#### 在线安装客户端
* 如果配置项内已经填写了客户端所在仓库地址，则只需要 `pan ios -i` 即可出现可安装列表。
* 各业务部门可以自行维护该列表。

* 客户端git仓库目录规则:

``` javascript

  root
  ├── readme.md
  ├── app
      ├── xxx.ipa

```

![installApp_pan_github](http://7xqv6o.com1.z0.glb.clouddn.com/installApp_pan_github.gif)

#### 如何在iphoneX 的客户端内 打开指定页面？
* 以严选为例

* ![url_pan_github.gif](http://7xqv6o.com1.z0.glb.clouddn.com/url_pan_github.gif)

* 非严选客户端，则需要添加配置项才能支持
* 比如：如下配置项，那么指令为
  * pan ios -u 'you.163.com' xxx1
 

 ``` javascript
  {
      "name": "xxx1",
      "cname": "xxx2",
      "packageName": "xxxx.app",
      "boundId": "xxxx",
      "scheme": "aaa://bbb?url=",
      "repository": {
        "type": "git",
        "url": ""// 此项如非通用，可以不填
      }
    },
 ```   

 * ![Snip20180408_7.png](http://7xqv6o.com1.z0.glb.clouddn.com/Snip20180408_7.png) 

 * 也就是说 通过`pan ios -u "http://dizhi" [type]` 可以自定义客户端呼叫指令

#### 同步
* 由于配置项文件是跟随版本走，所以每次更新版本会导致配置文件重置，为此，pan提供了导入导出功能。具体操作如下
* pan ios --config 
  * 选择导入
  * 输入导入的目标文件，注意必须含后缀
![config_pan_github.gif](http://7xqv6o.com1.z0.glb.clouddn.com/config_pan_github.gif) 

* 将配置文件导出到自定义目录
* pan ios --config
  * 选择导出
  * 输入导出的目标路径文件

  ![config_pan_github_2.gif](http://7xqv6o.com1.z0.glb.clouddn.com/config_pan_github_2.gif) 

### 附属功能
* pan ip // 用于获取当前设备ip信息
* pan path // 用于获取当前目录地址

#### Q&A
1. 怎么调试h5？
  * 首先，safari-> preferences -> Advanced ->  Show Develop menu in menu bar 
  * ![](http://mimg.127.net/pub/img/555.gif)
2. 怎么添加其他ios版本的模拟器？
  * xcode->   preferences -> components -> 想要哪个版本手动选择下载
  * 至于删除，`/Library/Developer/CoreSimulator/Profiles/Runtimes/` 这个目录手动删除
3. 为什么在列表里找不到iphoneX?
  * 升级xcode至最新版本
4. 输入地址后，命令行长时间无响应
  * 正确的写法是 pan ios -u 'http://xxx.xxx' ,请检查url是否没有加引号
5. pan ios -i 安装提示报错
  * 原则上，pan只是一个调试工具，并不是app的模拟器，所以并不管理你的app应用。
  * 安装失败说明你并没有改app的权限，请联系对应文件管理员或检查地址是否写错    
6. 怎么在模拟器内呼叫出键盘？
  *  Hardware -> KeyBoard -> Toggle Software keyBoard 