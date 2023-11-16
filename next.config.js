const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true'
  })
  
  module.exports = withBundleAnalyzer({
    staticPageGenerationTimeout: 3000,
    images: {
      domains: [
        'www.notion.so',
        'notion.so',
        'images.unsplash.com',
        'pbs.twimg.com'
      ],
      formats: ['image/avif', 'image/webp']
    }
  })
  