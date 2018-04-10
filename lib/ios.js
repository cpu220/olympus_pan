#!/usr/bin/env node

const process = require('child_process');
color = require('colors-cli/toxic');
const iosTools = require('../common/iosTools');
const question = require('../common/question');
const appListManage = require('../common/appListManage');
const utils = require('../common/utils');
const log = utils.msg;
// const path = require('path');


module.exports = function (cmd, options) {

	if (!!options.start) {
		/**
		 * 1. 没参数，则直接打开list
		 * 2. none 则跳过list，直接打开模拟器，什么都不做
		 * 3. type 则寻找对应id打开
		 */
		if (options.start === true) {

			question.chooseApp((answers) => {

				if (answers === false) {
					iosTools.openIphone();
				} else {
					const appInfo = iosTools.getAppInfo(answers.app, 'cname');
					iosTools.openIphone(() => {
						process.exec(`xcrun simctl launch booted ${appInfo.boundId}`);
					});
				}

			})

		} else {
			if (options.start === 'none') {
				// 不选择app，仅打开模拟器
				iosTools.openIphone();
			} else {
				const appInfo = iosTools.getAppInfo(options.start, 'name');
				if (!!appInfo.boundId) {
					iosTools.openIphone(() => {
						process.exec(`xcrun simctl launch booted ${appInfo.boundId}`);
					});
				} else {
					console.log(`未找到${options.start},请确认已经安装对应app或已更新app清单库文件`)
				}
			}
		}
	} else if (options.install === true) {
		// 安装 
		question.chooseApp((answers) => {
			const appInfo = iosTools.getAppInfo(answers.app, 'cname');
			iosTools.installPackage(appInfo);
		});
	} else if (options.yanxuan === true) {
		// 启动客户端 
		iosTools.openIphone(() => {
			process.exec(`xcrun simctl launch booted `);
		});

	} else if (!!options.url) {
		let url = options.url;
		if (!/^http(s){0,1}:\/\//.test(url)) {
	 		log.warn('检测到url 没有带http|https ,请确认是否为遗漏');
		}
		let type = 'list';
		if (!!cmd) {
			type = cmd.toLocaleLowerCase();
		}

		if (type === 'list') {
			question.chooseApp((answers) => {
				const appInfo = iosTools.getAppInfo(answers.app, 'cname');
				url = iosTools.translateURL(url, appInfo);
				iosTools.openUrl(url);
			});
		} else if (type === 'safari') {
			// url不处理
			iosTools.openUrl(url);
		} else {
			const appInfo = iosTools.getAppInfo(type, 'name');
			if (!!appInfo.name) {
				url = iosTools.translateURL(url, appInfo);
			} else {
				url = iosTools.translateURL(url, type);
			}
			iosTools.openUrl(url);
		}


	} else if (!!options.translate) {
		// 翻译
		const url = options.translate;
		let type = '';
		if (!!cmd) {
			type = cmd.toLocaleLowerCase();
		}
		const appInfo = iosTools.getAppInfo(type, 'name');
		console.log(iosTools.translateURL(url, appInfo));
	} else if (!!options.init) {
		// console.log(options.init);
		// 初始化配置表单
	} else if (!!options.add) {
		// 对本地json配置进行添加 
		addApp();
	} else if (!!options.info) {
		let type = options.info
		if (type === true) {

			appListManage.getList().then(file => {
				console.log(file);
			})
		} else {
			const appInfo = iosTools.getAppInfo(type, 'name');
			if (!!appInfo.name) {
				console.log(appInfo);
			} else {
				console.log(`未找到 ${type}`)
			}
		}
	} else if (!!options.remove) {

		iosTools.judgeTypeAndChooseList(options.remove).then((info) => {

			appListManage.removeApp(info).then().catch(err => {
				console.log(err);
			});
		}).catch((err) => {
			console.log(`删除失败`)
		});

	} else if (!!options.update) {

		iosTools.judgeTypeAndChooseList(options.update).then((info) => {
			question.updateApp(info).then((info) => {
				appListManage.updateApp(info)
			});
		}).catch((err) => {
			// console.log(`更新失败`)
			question.confirm(`目标不存在，是否改为新增`).then((answers) => {
				addApp();
			})
		});
	} else if (!!options.config) {

		question.getConfig().then((answers) => {
			// console.log(answers);
			if (answers.type === 'export') {
				appListManage.exportsConfig(answers);
			} else if (answers.type === 'import') {
				appListManage.importConfig(answers);
			} else if (answers.type === 'userDefined') {
				appListManage.userDefined(answers);
			} else if (answers.type === 'reset') {
				appListManage.resetConfig(answers);
			} else if (answers.type === 'this') {
				appListManage.useThisDirFile(answers);
			}
		});
	} else {
		console.log('pan ios -h  可以查看命令');
	}
}

// 省代码
const addApp = () => {
	question.inputAppInfo().then((info) => {
		appListManage.addApp(info).then().catch(err => {
			console.log(err);
		});
	}).catch(err => console.log(err));
}