## 安装
1. 安装 qbittorrent_4.4.3.1_x64_setup.exe
2. 在 qbittorrent 设置 - WebUI，点开 "Web 用户界面"，账号密码不要更改
3. 安装 pt Setup 1.0.0.exe
4. 之后每次打开 pt 之前先打开 qbittorrent

## 使用
1. 登录后点击 用户->邀请 按钮, 将返回一个邀请码用于注册新账号时填写, 目前无邀请人数限制
2. 在"资源"页下可以搜索, 下载, 导入想要的资源
3. 在"发布"页下可以上传自己的资源, 选择存放资源的文件夹即可自动发布该文件夹下所有资源(unitypackage文件), 只会上传Unity Asset Store中存在的资源, 其他文件会自动过滤
4. 支持rss订阅,订阅地址为 https://t.lolo.moe/rss , 此功能可以在qbittorent中的工具->选项->RSS订阅中设置;
5. 支持远程qbittorrent,支持sftp,http,smb协议,可以在"设置"页下设置
6. 使用docker时,请注意远程协议的服务端目录必须与qbittorent的下载目录挂载同一个主机目录,否则无法正常使用

## 主页
https://github.com/UnityPT/pt