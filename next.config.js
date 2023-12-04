const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true'
  })
  
  module.exports = withBundleAnalyzer({
    staticPageGenerationTimeout: 3000,
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '*',
        },
      ],
      unoptimized: true
    }
  })
  