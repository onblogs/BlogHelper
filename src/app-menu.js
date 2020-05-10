const {Menu, app, clipboard, shell} = require('electron')
const appLogin = require('./app-login')
const string = require('./app-string')
const appMenuPublish = require('./app-menu-publish')
const appUtil = require('./app-util')
const DataStore = require('./app-store')
const dataStore = new DataStore()
const appToast = require('./app-toast')
const appUpdate = require('./app-update')
const appShortcut = require('./app-shortcut')

// 图床
const PIC = dataStore.PIC

exports.buildContextMenu = function buildContextMenu(tray) {
    // 菜单栏引用
    let menu
    const template = [
        {
            label: '博客',
            submenu: [
                {
                    label: '知乎',
                    submenu: [{
                        label: '绑定',
                        click: function (menuItem, browserWindow, event) {
                            appLogin.loginZhiHu(menuItem, browserWindow, event)
                        }
                    }, {
                        label: '发布',
                        click: function (menuItem, browserWindow, event) {
                            appMenuPublish.publishArticleTo(tray, string.zhihu)
                        }
                    }]
                }
                , {
                    label: '简书',
                    submenu: [{
                        label: '绑定',
                        click: function (menuItem, browserWindow, event) {
                            appLogin.loginJianShu(menuItem, browserWindow, event)
                        }
                    }, {
                        label: '发布',
                        click: function (menuItem, browserWindow, event) {
                            appMenuPublish.publishArticleTo(tray, string.jianshu)
                        }
                    }]
                }
                , {
                    label: '掘金',
                    submenu: [{
                        label: '绑定',
                        click: function (menuItem, browserWindow, event) {
                            appLogin.loginJueJin(menuItem, browserWindow, event)
                        }
                    }, {
                        label: '发布',
                        click: function () {
                            appMenuPublish.publishArticleTo(tray, string.juejin)
                        }
                    }]
                }
                , {
                    label: '思否',
                    submenu: [{
                        label: '绑定',
                        click: function (menuItem, browserWindow, event) {
                            appLogin.loginSegmentFault(menuItem, browserWindow, event)
                        }
                    }, {
                        label: '发布',
                        click: function () {
                            appMenuPublish.publishArticleTo(tray, string.segmentfault)
                        }
                    }]
                }
                , {
                    label: 'CSDN',
                    submenu: [{
                        label: '绑定',
                        click: function (menuItem, browserWindow, event) {
                            appLogin.loginCSDN(menuItem, browserWindow, event)
                        }
                    }, {
                        label: '发布',
                        click: function () {
                            appMenuPublish.publishArticleTo(tray, string.csdn)
                        }
                    }]
                }
                , {
                    label: '博客园',
                    submenu: [{
                        label: '绑定',
                        click: function (menuItem, browserWindow, event) {
                            appLogin.loginCnBlog(menuItem, browserWindow, event)
                        }
                    }, {
                        label: '发布',
                        click: function (menuItem, browserWindow, event) {
                            appMenuPublish.publishArticleTo(tray, string.cnblogs)
                        }
                    }]
                }
                , {
                    label: '开源中国',
                    submenu: [{
                        label: '绑定',
                        click: function (menuItem, browserWindow, event) {
                            appLogin.loginOsChina(menuItem, browserWindow, event)
                        }
                    }, {
                        label: '发布',
                        click: function (menuItem, browserWindow, event) {
                            appMenuPublish.publishArticleTo(tray, string.oschina)
                        }
                    }]
                }
            ]
        }
        , {
            label: '图床',
            submenu: [
                {
                    label: '新浪',
                    submenu: [
                        {
                            label: '绑定',
                            click: function (menuItem, browserWindow, event) {
                                appLogin.loginWebBoPicture(menuItem, browserWindow, event)
                            }
                        }
                        , {
                            label: '启用',
                            id: PIC[0],
                            type: 'checkbox',
                            checked: dataStore.isWeiBoFigureBedSwitch(),
                            click: function (menuItem, browserWindow, event) {
                                menuItem.checked = true
                                dataStore.setWeiBoFigureBedSwitch()
                                appToast.toast({title: '启用成功', body: '正在使用新浪图床'})
                                closeMenuChecked(menuItem.id, menu)
                            }
                        }
                    ]
                }
                , {
                    label: '图壳',
                    submenu: [
                        {
                            label: '启用',
                            id: PIC[2],
                            type: 'checkbox',
                            checked: dataStore.isIMGKRFigureBedSwitch(),
                            click: function (menuItem, browserWindow, even) {
                                menuItem.checked = true
                                dataStore.setIMGKRFigureBedSwitch()
                                appToast.toast({title: '启用成功', body: '正在使用图壳图床'})
                                closeMenuChecked(menuItem.id, menu)
                            }
                        }
                    ]
                }
                , {
                    label: 'SM.MS',
                    submenu: [
                        {
                            label: '启用',
                            id: PIC[1],
                            type: 'checkbox',
                            checked: dataStore.isSmMSFigureBedSwitch(),
                            click: function (menuItem, browserWindow, even) {
                                menuItem.checked = true
                                dataStore.setSmMSFigureBedSwitch()
                                appToast.toast({title: '启用成功', body: '正在使用SM图床'})
                                closeMenuChecked(menuItem.id, menu)
                            }
                        }
                    ]
                }
            ]
        }
        , {
            label: '文章',
            submenu: [
                {
                    label: '本地图片上传',
                    click: function () {
                        appMenuPublish.uploadAllPictureToWeiBo(tray).then()
                    }
                }
                , {
                    label: '网络图片下载',
                    click: function () {
                        appMenuPublish.downloadMdNetPicture(tray).then()
                    }
                }
                , {
                    label: '本地图片整理',
                    click: function () {
                        appMenuPublish.movePictureToFolder(tray)
                    }
                }
                , {
                    label: '整理至新目录',
                    click: function () {
                        appMenuPublish.movePictureAndMdToFolder(tray)
                    }
                }
                , {
                    label: 'Md图片转Img',
                    click: function () {
                        appMenuPublish.pictureMdToImg(tray)
                    }
                }, {
                    label: 'HTML转为Md',
                    click: function () {
                        appMenuPublish.HTMLToMd(tray)
                    }
                }
            ]
        }
        , {
            label: '剪贴板',
            submenu: [
                {
                    label: '图片上传',
                    click: function () {
                        appMenuPublish.uploadClipboardPic(tray)
                    }
                }
                , {
                    label: '代码对齐',
                    click: function () {
                        const oldT = clipboard.readText()
                        const newT = appUtil.formatCode(oldT)
                        appUtil.updateClipboard(newT)
                    }
                }, {
                    label: '转纯文字',
                    click: function () {
                        appMenuPublish.coverToText()
                    }
                }, {
                    label: '删除换行',
                    click: function () {
                        const oldT = clipboard.readText()
                        const newT = oldT.replace(/\n/g, '')
                        appUtil.updateClipboard(newT)
                    }
                }, {
                    label: '删除空格',
                    click: function () {
                        const oldT = clipboard.readText()
                        const newT = oldT.replace(/\s+/g, '')
                        appUtil.updateClipboard(newT)
                    }
                }, {
                    label: 'HTML转Md',
                    click: function () {
                        const oldT = clipboard.readText()
                        const newT = require('html-to-md')(oldT)
                        appUtil.updateClipboard(newT)
                    }
                }
            ]
        }, {
            label: '快捷键',
            submenu: [
                {
                    label: '图片上传',
                    type: 'checkbox',
                    accelerator: appShortcut.ACCELERATORS[0],
                    click: function (menuItem) {
                        appShortcut.uploadClipboardPicSwitch(tray, menuItem.checked)
                    }
                },
                {
                    label: '转纯文字',
                    type: 'checkbox',
                    accelerator: appShortcut.ACCELERATORS[1],
                    click: function (menuItem) {
                        appShortcut.coverToTextSwitch(tray, menuItem.checked)
                    }
                }
            ]
        }
        , {
            label: '工具集',
            submenu: [
                {
                    label: '文章排版',
                    click: function () {
                        shell.openExternal(require('./app-constant').article).then()
                    }
                }
                , {
                    label: '图片素材',
                    click: function () {
                        shell.openExternal(require('./app-constant').pic).then()
                    }
                }
                , {
                    label: 'JSON美化',
                    click: function () {
                        shell.openExternal(require('./app-constant').json).then()
                    }
                }
            ]
        }
        , {
            type: "separator"
        }
        , {
            label: '关于应用',
            submenu: [
                {
                    label: '官方网站',
                    click: function () {
                        shell.openExternal(require('./app-constant').link).catch()
                    }
                }
                , {
                    label: '我要反馈',
                    click: function () {
                        shell.openExternal(require('./app-constant').issues)
                            .catch()
                    }
                }
                , {
                    label: '给我写信',
                    click: function () {
                        shell.openExternal(require('./app-constant').mail).catch()
                    }
                }
                , {
                    label: '版本查询',
                    click: function () {
                        appToast.toast({title: '当前版本 ' + app.getVersion(), body: ''})
                    }
                }, {
                    label: '检查更新',
                    click: function () {
                        checkUpdateApp(true)
                    }
                }
            ]
        }
        , {
            label: '退出程序',
            click: () => {
                tray.destroy()
                app.quit()
            }
        }
    ]
    menu = Menu.buildFromTemplate(template)
    return menu
}

/**
 * 检查更新
 */
function checkUpdateApp(isTip) {
    appUpdate.autoUpdateApp(isTip)
}

exports.checkUpdateApp = checkUpdateApp

/**
 * 关闭除ID外的其他checked
 */
function closeMenuChecked(id, menu) {
    for (let pic of PIC) {
        if (id !== pic) {
            appUtil.myGetMenuItemById(pic, menu).checked = false
        }
    }
}