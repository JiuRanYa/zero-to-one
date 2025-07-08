import { NextResponse } from 'next/server'

// 定义LLMs配置的类型
interface LLMsConfig {
  rules: {
    userAgent: string;
    allow: string[];
    disallow: string[];
    crawlDelay: number;
  };
  allowedPurposes: string[];
  disallowedPurposes: string[];
  license: {
    url: string;
    terms: string[];
  };
  lastUpdated: string;
  owner: {
    name: string;
    url: string;
    email: string;
  };
  preferredFormat: {
    type: string;
    encoding: string;
    language: string[];
  };
}

// 生成llms.txt内容
function generateLLMsContent(): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://games.tool.tokyo'
  
  const config: LLMsConfig = {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/games/',
        '/zh/',
        '/en/',
      ],
      disallow: [
        '/api/',
        '/admin/',
        '/_next/',
        '/_vercel/',
        '/user/',
      ],
      crawlDelay: 10,
    },
    allowedPurposes: [
      'research',
      'education',
      'search',
    ],
    disallowedPurposes: [
      'commercial-training',
      'commercial-reproduction',
      'disinformation',
      'harassment',
    ],
    license: {
      url: `${baseUrl}/license`,
      terms: [
        'attribution-required',
        'no-commercial-use',
        'no-derivatives',
      ],
    },
    lastUpdated: new Date().toISOString(),
    owner: {
      name: 'PlayHub',
      url: baseUrl,
      email: 'siyuantong7@gmail.com',
    },
    preferredFormat: {
      type: 'html',
      encoding: 'utf-8',
      language: ['zh', 'en'],
    },
  }

  // 转换配置为文本格式
  return `# AI Crawler Rules
User-Agent: ${config.rules.userAgent}
${config.rules.allow.map(path => `Allow: ${path}`).join('\n')}
${config.rules.disallow.map(path => `Disallow: ${path}`).join('\n')}
Crawl-Delay: ${config.rules.crawlDelay}

# Allowed Purposes
Allowed-Purposes: ${config.allowedPurposes.join(', ')}

# Disallowed Purposes
Disallowed-Purposes: ${config.disallowedPurposes.join(', ')}

# License
License-URL: ${config.license.url}
License-Terms: ${config.license.terms.join(', ')}

# Site Information
Last-Updated: ${config.lastUpdated}
Owner-Name: ${config.owner.name}
Owner-URL: ${config.owner.url}
Owner-Email: ${config.owner.email}

# Content Format
Preferred-Format: ${config.preferredFormat.type}
Content-Encoding: ${config.preferredFormat.encoding}
Content-Language: ${config.preferredFormat.language.join(', ')}
`
}

// GET 处理函数
export async function GET() {
  const content = generateLLMsContent()
  
  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600', // 1小时缓存
    },
  })
} 