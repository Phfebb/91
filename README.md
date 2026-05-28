# 视频聚合站

把散落在不同网盘里的视频，整理成一个可以自己登录、自己浏览、自己管理的私人视频站。

网盘适合存东西，却不适合慢慢看东西。文件多了以后，你很难记住它们在哪里、叫什么、有没有看过、还能不能快速预览。这个项目做的是中间那一层：文件仍然留在原来的网盘里，但你可以用一个更像视频站的界面去搜索、筛选、预览和管理它们。

它不是另一个网盘客户端，也不是内容平台。它更像是给你自己的视频收藏做一个入口：安静、集中、可控。

## 它能做什么

- **统一入口**：把 115、PikPak、夸克、联通沃盘、OneDrive、本地上传和可选的 91 爬虫源放在同一个站里浏览。
- **像视频站一样浏览**：首页推荐、最新视频、列表页、搜索、标签筛选、详情播放和相关推荐都已经接好。
- **自动生成预览**：后端会用 ffmpeg 在本地生成封面和短 teaser，扫到新视频后不用一条条手动整理。
- **保留网盘本身**：视频文件不需要搬家，播放时由后端按来源取链和代理。
- **后台可管理**：在管理后台添加网盘、扫描所有网盘、编辑视频信息、维护标签、切换主题。
- **首次部署更直接**：第一次访问时会要求设置管理员用户名和密码，设置后保存到本地配置文件。
- **适合长期运行**：扫描、预览、隐藏视频、标签归类这些重复工作，都尽量交给系统处理。

## 适合谁

如果你有一批视频散落在多个网盘里，想把它们整理成一个自己的私有站点，这个项目会比较合适。

如果你只是想临时播放单个文件，直接用网盘客户端更简单；如果你想做公开视频网站，这个项目也不是为那个场景设计的。它的重点是个人部署、个人管理、个人观看。

## 支持的来源

- 115 网盘
- PikPak
- 91 爬虫源
- 夸克网盘
- 联通沃盘
- OneDrive
- 本地上传

91 爬虫源是一种特殊存储来源，用来把爬虫抓到的视频和封面接入站内目录。它不是必须项；如果你只想管理自己的网盘，可以完全不启用。

## 快速开始

需要先准备：

- Node.js 18+
- Go 1.23+
- ffmpeg 和 ffprobe

启动项目：

```bash
npm install
./start.sh
```

默认访问地址：

- 前台：`http://127.0.0.1:9191/`
- 后台：`http://127.0.0.1:9191/admin`
- 后端：`127.0.0.1:9192`

第一次打开时，如果还没有设置管理员账号，页面会引导你创建用户名和密码。保存后会写入本地的 `backend/config.yaml`。

常用命令：

```bash
./start.sh --status
./start.sh --restart
./start.sh --stop
```

需要前端热更新时：

```bash
FRONTEND_MODE=dev ./start.sh --restart
```

## 新服务器一键安装

如果你只是想在一台 Ubuntu / Debian 服务器上尽快跑起来，推荐使用预编译安装脚本。普通用户不需要安装 Go、Node.js，也不需要自己编译；脚本会按服务器 CPU 架构下载 GitHub Release 里的预编译包，安装运行依赖，写入 systemd 服务并启动。

```bash
sudo apt update
sudo apt install -y curl ca-certificates
curl -fsSL https://raw.githubusercontent.com/nianzhibai/91/main/install.sh -o install.sh
sudo bash install.sh
```

部署完成后访问：

- 前台：`http://服务器IP:9191/`
- 后台：`http://服务器IP:9191/admin`

第一次打开后台会要求设置管理员用户名和密码。常用维护命令：

```bash
sudo bash install.sh status
sudo bash install.sh logs
sudo bash install.sh update
sudo bash install.sh restart
sudo bash install.sh stop
```

安装后会自动创建 `91` 指令，和 OpenList 的管理指令类似：

```bash
91          # 打开管理菜单
91 status   # 查看状态
91 logs     # 查看日志
91 update   # 更新
91 restart  # 重启
91 stop     # 停止
```

同时也保留 `video-site-91` 作为同等别名。

想换端口：

```bash
FRONTEND_PORT=8080 sudo -E bash install.sh
```

如果服务器还有云厂商安全组，请记得放行对应端口，默认是 `9191/tcp`。

如果你是项目维护者，要预先编译发布包：

```bash
scripts/build-release.sh
```

它会生成：

- `release/video-site-91-linux-amd64.tar.gz`
- `release/video-site-91-linux-arm64.tar.gz`

把这两个文件上传到 GitHub Release 后，`install.sh` 就能自动下载。仓库也带了 GitHub Actions：推送 `v*` 标签时会自动构建并上传这两个 Release 包。

源码部署仍然保留在 `deploy.sh`，适合你想在服务器上直接 clone、编译和调试时使用。

## 第一次使用

1. 打开 `http://127.0.0.1:9191/`，先完成管理员账号设置。
2. 进入 `/admin`，在网盘管理里新建一个来源。
3. 填入名称和对应凭证，保存。
4. 点击“扫描所有网盘”，等待视频入库。
5. 回到前台，用首页、搜索、标签和详情页浏览内容。

## 数据放在哪里

项目会把运行数据保存在本地：

- `backend/config.yaml`：本地配置、管理员账号、网盘凭证。
- `backend/data/video-site.db`：SQLite 数据库。
- `backend/data/previews/`：本地生成的封面和 teaser。

这些文件不应该提交到公开仓库。仓库里的 `backend/config.example.yaml` 只是模板，不应该放真实账号、Cookie、Token 或密码。

## 更多文档

根目录 README 只保留项目介绍和最短上手路径。更细的实现、接口、网盘字段和部署方式可以看：

- [backend/README.md](backend/README.md)
- [video-site-implementation-plan.md](video-site-implementation-plan.md)

## 开发验证

```bash
npm run lint
npm test
cd backend && go test ./... -count=1
```

## 使用边界

这个项目面向个人私有部署。请只接入你有权访问和管理的内容，并遵守对应网盘、站点服务条款以及所在地法律法规。
