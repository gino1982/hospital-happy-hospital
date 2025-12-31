import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
    ],
    // 圖片優化設定
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  // webpack 代碼分割優化
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization?.splitChunks,
          cacheGroups: {
            ...(typeof config.optimization?.splitChunks === 'object' 
              ? config.optimization.splitChunks.cacheGroups 
              : {}),
            // 分離 React 框架代碼 - 很少變動，可長期快取
            framework: {
              name: 'framework',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler|next)[\\/]/,
              priority: 50,
              enforce: true,
            },
            // 分離 UI 元件庫 - radix-ui 等
            lib: {
              name: 'lib',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](@radix-ui|class-variance-authority|clsx|tailwind-merge)[\\/]/,
              priority: 40,
              enforce: true,
            },
            // 分離動畫庫 - framer-motion 較大
            animation: {
              name: 'animation',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](framer-motion|motion)[\\/]/,
              priority: 35,
              enforce: true,
            },
            // 分離資料處理相關
            data: {
              name: 'data',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](@tanstack|date-fns|zod)[\\/]/,
              priority: 30,
              enforce: true,
            },
          },
        },
      };
    }
    return config;
  },
  // 實驗性功能：啟用更好的 tree shaking
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
};

export default nextConfig;
