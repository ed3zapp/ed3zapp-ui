const path = require('path')

module.exports = {
  trailingSlash: true,
  reactStrictMode: false,
  experimental: {
    esmExternals: false,
    jsconfigPaths: true // enables it for both jsconfig.json and tsconfig.json
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  future: {
    webpack5: true, 
  },
  webpack: config => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };

    config.module.rules.push({
      test: /\.svg$/,
      issuer: { and: [/\.(js|ts)x?$/] },
      use: ["@svgr/webpack"],
    });

    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }

    return config
  },
  publicRuntimeConfig: {
    AssessmentPassPercentage: 50
  },
  env: {
    WEB3_STORAGE_TOKEN: process.env.WEB3_STORAGE_TOKEN,
    NFT_PORT_API_KEY: process.env.NFT_PORT_API_KEY,
    ADMIN_DB_ACCOUNT_KEY: process.env.ADMIN_DB_ACCOUNT_KEY
    },
}
