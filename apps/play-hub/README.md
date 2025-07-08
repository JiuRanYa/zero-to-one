# PlayHub（玩趣集）

一个精心打造的经典网页游戏合集。项目使用 Next.js 15 构建，采用现代化的技术栈和优秀的用户界面设计，为玩家提供流畅的游戏体验。

## 游戏列表

### 数独（Sudoku）
- 支持多个难度级别（简单、中等、困难）
- 实时保存游戏进度
- 计时功能
- 排行榜系统
- 提示功能
- 解法预览
- 错误检查

### 2048
- 经典的 2048 玩法
- 支持键盘方向键和触摸滑动操作
- 平滑的合并动画效果
- 实时分数统计
- 最高分记录
- 响应式设计，支持各种屏幕尺寸

## 技术栈

- **框架**: Next.js 15 App Router
- **UI组件**: Radix UI Primitives
- **样式**: Tailwind CSS
- **图标**: [Lucide](https://lucide.dev)
- **主题**: 支持亮色/暗色模式 (next-themes)
- **代码质量**:
  - Tailwind CSS class 自动排序和合并
  - ESLint v9 代码检查
  - TypeScript 类型检查

## 开始使用

1. 克隆项目:
```bash
git clone [your-repository-url]
```

2. 安装依赖:
```bash
pnpm install
```

3. 启动开发服务器:
```bash
pnpm dev
```

4. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 构建部署

```bash
pnpm build
pnpm start
```

## 项目结构

```
web-games/
├── app/                # Next.js 应用目录
│   ├── [locale]/      # 国际化路由
│   └── games/         # 游戏页面
│       ├── sudoku/    # 数独游戏
│       └── 2048/      # 2048 游戏
├── components/        # React 组件
│   ├── ui/           # 通用 UI 组件
│   └── games/        # 游戏相关组件
│       ├── sudoku/   # 数独游戏组件
│       └── 2048/     # 2048 游戏组件
├── styles/           # 全局样式
└── public/           # 静态资源
```

## 开发计划

- [ ] 添加更多游戏
  - [x] 数独
  - [x] 2048
  - [ ] 贪吃蛇
  - [ ] 俄罗斯方块
- [ ] 完善国际化支持
- [ ] 添加用户系统
- [ ] 优化移动端体验
- [ ] 添加更多游戏统计数据
- [ ] 添加游戏教程
- [ ] 支持自定义主题

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License