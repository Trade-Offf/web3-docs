import type { Metadata } from 'next'
import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import Script from 'next/script'
import 'nextra-theme-docs/style.css'

export const metadata: Metadata = {
  title: {
    default: 'web3happened docs',
    template: '%s · web3happened docs',
  },
  description: 'ZMX 前端团队内部知识库，记录工程规范、技术方案与最佳实践。',
  metadataBase: new URL('https://web3happened.com'),
  openGraph: {
    siteName: 'web3happened docs',
  },
}

const navbar = (
  <Navbar
    logo={
      <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em' }}>
        web3happened
        <span style={{ color: '#7c6af7', marginLeft: 6 }}>docs</span>
      </span>
    }
    projectLink="https://github.com/riccardo-li/web3happened-docs"
  />
)

const footer = (
  <Footer>
    <span style={{ fontSize: 13, color: '#888' }}>
      ZMX 前端团队内部文档 · {new Date().getFullYear()}
    </span>
  </Footer>
)

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh" dir="ltr" suppressHydrationWarning>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>
      <body>
        <Layout
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/riccardo-li/web3happened-docs/blob/main"
          footer={footer}
          darkMode
          nextThemes={{ defaultTheme: 'dark' }}
          sidebar={{ defaultMenuCollapseLevel: 1, toggleButton: true }}
          toc={{ backToTop: '回到顶部' }}
          editLink="在 GitHub 上编辑此页"
          feedback={{ content: null }}
        >
          {children}
        </Layout>
        {/* Cloudflare Web Analytics — 部署后将 token 替换为实际值 */}
        <Script
          defer
          strategy="afterInteractive"
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "REPLACE_WITH_CF_ANALYTICS_TOKEN"}'
        />
      </body>
    </html>
  )
}
