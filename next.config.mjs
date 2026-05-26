import nextra from 'nextra'

const withNextra = nextra({
  // Nextra-specific options
})

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
}

export default withNextra(nextConfig)
