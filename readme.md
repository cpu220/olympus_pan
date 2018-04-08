## 说明
>潘神（Pan）,希腊神话中司羊群和牧羊人的神，被认为是帮助孤独的航行者驱逐恐怖的神。就像在希腊神话中羊是不可或缺的一样，我们同样希望 Pan，能够帮助开发者驱逐一些因环境及条件等因素带来的疑难杂症。缩减问题复现及定位的时间。

* pan将独立存在，不与任何业务进行耦合。但支持对任何第三方工具的嵌入式调用。
 
### 更新日志
 
### 安装
* npm install -g olympus_pan 
 
 
* ps: safari 只有古老的版本支持inline的代码 pretty print。 新版本不支持。 查看network 记得timeline 拉时间轴。具体操作请自行学习safari 调试技巧
 

### 命令
* pan ios -s
  * start
  * 仅启动ios模拟器
* pan ios -i 
  * install
  * 安装客户端 
 
* pan ios -h 
  * help
  * 帮助
* pan ip  
  * 打印当前设备及系统 name，以及 当前网络ip。  
 
### 配置表
* 初次使用，需要添加app相关信息，虽然不添加也可以用，不过添加后就可以自行唤起你想要的客户端
* 命令： pan ios --add  

 ```
{
  "name": 你客户端的英文名，用于客户端启动标记,
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

 如果想要远程安装，客户端需要按如下目录

``` javascript
root
├── readme.md
├── app
    ├── xxx.ipa

``` 
