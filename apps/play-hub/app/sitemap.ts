import { routing } from '@/core/i18n/routing'
import { games } from '@/config/games'
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://games.tool.tokyo'
  
  // 生成所有可能的路由组合
  const routes: MetadataRoute.Sitemap = []

  // 为每个语言生成主页路由
  routing.locales.forEach((locale) => {
    // 主页
    routes.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    })

    // 游戏页面
    games.forEach((game) => {
      routes.push({
        url: `${baseUrl}/${locale}${game.link}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    })
  })

  return routes
} 