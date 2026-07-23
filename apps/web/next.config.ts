import type { NextConfig } from 'next'
import path from 'path'

/**
 * Next.js config for the Glofi web app.
 * transpilePackages lets us import TypeScript from @glofi/sdk without a pre-build step.
 */
const nextConfig: NextConfig = {
  transpilePackages: ['@glofi/sdk'],
  reactStrictMode: true,
  // Monorepo: pin Turbopack root so nested lockfiles do not confuse the workspace
  turbopack: {
    root: path.join(__dirname, '../..'),
  },
}

export default nextConfig
