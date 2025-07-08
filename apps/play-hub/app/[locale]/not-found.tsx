import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <h2 className="text-2xl font-semibold">页面未找到</h2>
      <p>抱歉，您访问的页面不存在。</p>
      <Link
        href="/"
        className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
      >
        返回首页
      </Link>
    </div>
  )
} 