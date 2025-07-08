import { NavItem } from '@/types/nav'

export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: '玩趣集',
  description: '在线小游戏，让你在摸鱼的同时也能享受游戏的乐趣',
  mainNav: [
    {
      title: 'Home',
      href: '/',
    },
    // {
    //   title: '2048',
    //   href: '/games/2048',
    // },
    // {
    //   title: '数独',
    //   href: '/games/sudoku',
    // },
  ] as NavItem[],
  links: {
    twitter: 'https://twitter.com/JiuRanYa',
    github: 'https://github.com/JiuRanYa/web-games',
    docs: 'https://ui.shadcn.com',
  },
}
