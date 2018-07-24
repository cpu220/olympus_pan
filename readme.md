## 说明
> 潘神（Pan）,希腊神话中司羊群和牧羊人的神，被认为是帮助孤独的航行者驱逐恐怖的神。

> 就像在希腊神话中羊是不可或缺的一样，我们同样希望 Pan，能够帮助开发者驱逐一些因环境及条件等因素带来的疑难杂症。缩减问题复现及定位的时间。


### 1. 使用条件
* 一台装有xcode 的mac 
* 本地安装node 8.x


### 2.  安装

* 以下安装选择一个即可

``` javascript
npm install olympus-pan -g 
// 不建议使用sudo来进行安装，可以使用下面命令进行去sudo
sudo chown -R $USER /usr/local
```

* 安装完毕后，请输入 `pan -v` 来查看是否安装成功。如果提示 `pan command not found`则安装失败

---

### 3. 使用

### 3.1 呼叫客户端

``` javascript
pan ios -s  // 该命令为启动客户端
```

* 第一次启动，会看到 `当前未添加任何app信息,如想添加请查阅文档` 的提示。这是因为pan 扩展了对app管理的自定义模式，pan仅作为对模拟器的调用及调试工具，与客户端管理解耦。用户根据自身业务自行对pan的配置项进行添加

 ```   
![start_pan_github.gif](https://user-images.githubusercontent.com/5085979/39687112-55948b04-51ff-11e8-8081-fcc482d2b649.gif) 
 

---

#### 3.2 如何在 iphoneX 的客户端内 打开指定页面？

* 以严选为例

``` javascript
pan ios -u 'http://xxx'  yanxuan  
```
* ![url_pan_github.gif](https://user-images.githubusercontent.com/5085979/39689737-6a6828aa-520a-11e8-8b07-9b97952b9bf6.gif)


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
        "url": ""
      }
    },
 ```   

  * ![Snip20180408_7.png](https://user-images.githubusercontent.com/5085979/39687640-fac03694-5201-11e8-926a-5f45893c648b.png) 

  * 也就是说 通过`pan ios -u "http://dizhi" [type]` 可以自定义客户端呼叫指令
  * 所有的客户端呼叫、安装，全部依赖pan所导入的配置项内容
 

---

### 4. 配置项
* pan仅作为对模拟器的调用工具，并不负责app的管理，所有对app的操作均根据配置项进行操作。
* 什么是配置项？
  * pan ios --info // 打印出当前所用配置项

```jacascript
{
  "version":"1.0.0", // 当前配置项版本
  "list":[] // 所有客户端配置项所在清单
}
```


#### 4.1 添加配置项
* pan 内置了对配置项增、删、改、查的本地方法。使用方法如下


* pan ios --add // 添加客户端

![Snip20180408_5.png](https://user-images.githubusercontent.com/5085979/39687657-0aac2e28-5202-11e8-823e-cad0f7a8290d.png) 

* pan ios --remove [type] // 删除配置项 [type] 为可选参数，如填写，则直接删除指定配置项，默认为空，即出现删除选择列表
 * 比如：pan ios --remove xxx ，就会直接删掉xxx的配置项，跳过选择list 
* pan ios --info [type] // 获取对应客户端配置项内容，[type]为可选参数，如填写，则直接打印指定客户端对应的配置项，不填写则打印全部
* pan ios --upadte [type] // 更新指定客户端配置项，应用场景:比如git仓库修改

#### 4.2 手动修改配置项

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
    "url": 客户端所在地址,选填。不填写将无法自动安装客户端
  }
},
 ```
 
* scheme
  * 理论上所有app都支持从浏览器或第三方app 跳转到自己app的功能。Pan的呼叫app其实是调用了对应app的该命令
  * 大部分app的跳转规则基本为: xxx://xxx?url=encode(目标页面)，但也有一些app的规则并非如此，比如：
    * http://xxxx.html?id={1}
    * http://*.xxx.com/{1}.html
  * 针对非常规格式的命令，Pan提供自身内置了模板功能。使用方式如下

    ``` javascript
    http://xxxx.html?id={{url.encode}} 

    1. 双花括号
    2. key.encode  || key || key.decode // 第二个参数为功能参数，用于判断是否对url进行encode|decode处理

    ```  

  * 对于多种一个app想多种方式跳转。原则上Pan的命令是为了使用者的简便而设计，所以请配置多个配置项，毕竟，配置项不常改，但命令经常敲。
  * 保证`name`不相同即可，不然Pan将无法区分  

 ---

#### 4.3 在线安装客户端
* 如果配置项内已经填写了客户端所在仓库地址，则只需要 `pan ios -i` 即可出现可安装列表。
* 各业务部门可以自行维护该列表。

* 客户端git仓库目录规则:

``` javascript

  root
  ├── readme.md
  ├── app
      ├── xxx.ipa

```

![installApp_pan_github](https://user-images.githubusercontent.com/5085979/39687676-1f7a58e8-5202-11e8-83e6-627d2f2914b2.gif)


---

#### 4.4 同步配置文件
* 由于配置项文件是跟随版本走，所以每次更新版本会导致配置文件重置，为此，pan提供了导入导出功能。具体操作如下
* pan ios --config 
  * 选择导入
  * 输入导入的目标文件，注意必须含后缀
![config_pan_github.gif](https://user-images.githubusercontent.com/5085979/39687745-5ac29758-5202-11e8-867a-b3ea76680d8e.gif) 

* 将配置文件导出到自定义目录
* pan ios --config
  * 选择导出
  * 输入导出的目标路径文件

  ![config_pan_github_2.gif](https://user-images.githubusercontent.com/5085979/39687782-7e69726c-5202-11e8-8475-526cfc9f4f17.gif) 

---

#### 4.5 自定义配置项地址
* 考虑到有些人觉得每次更新后都要导入导出的比较麻烦，所以我这里也提供自定义配置项目录，只要遵守配置项格式就行
* pan ios --config
  * 选择自定义选项
  * 输入导入的目标文件，注意必须含后缀
  * ![config_pan_github_3](https://user-images.githubusercontent.com/5085979/39687812-93fca7de-5202-11e8-9a5d-0ee1a0ebe8cb.gif)

---

#### 4.6 重置配置项
* pan ios --config
   * 选择重置
   * ![config_pan_github_4](https://user-images.githubusercontent.com/5085979/39687843-b21beb8a-5202-11e8-97b4-ce0871dcbee9.gif)

---

#### 4.7 当前目录导入配置项
* pan ios --config
 * 选择`使用当前目录文件`
 * 选择列表内的配置文件名，进行导入
 * ![config_pan_github_5](https://user-images.githubusercontent.com/5085979/39687885-e2d94e7a-5202-11e8-947f-36cad62f1f85.gif)

---


### 4.8 附属功能
* pan ip // 用于获取当前设备ip信息
* pan path // 用于获取当前目录地址

### 4.9 设置默认客户端
* pan ios --use iphone // 用于设置默认启动客户端类型，其中iphone可替换为ipad。
  * eg:若只想有iphoneX的list，则可以这么输入 ** pan ios --use 'iphone 8' ** 用于筛选list，当然也可以搜索ipad等其他设备
  * 如果输入不存在的设备，如 `iphone 9`;不会启动任何设备，但输入的设备在当前mac上只存在1个，会直接启动。

### 5. Q&A

1. 怎么调试h5？
  * 首先，safari-> preferences -> Advanced ->  Show Develop menu in menu bar 
  * ![debug](https://mimg.127.net/pub/img/555.gif)
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
7. 执行pan ios -s 无响应
  1. 请确认是否已安装xcode
  2. 请确认是否打开过xcode并安装了模拟器，在xcode->Preferences->components选择安装ios版本
  3. 执行`xcrun instruments -w 'iphone'`,查看是否报错，如果错误为`xcrun: error: unable to find utility "instruments", not a developer tool or in PATH`.  在中断输入:`sudo xcode-select -s /Applications/Xcode.app/Contents/Developer/`

### 6. 其他
1. 为了方便管理，更新说明以后放在issues了。首页只作为文档的简略说明
2. 欢迎pr，若有业务需求或再封装，请联系作者。转载经说明出处。