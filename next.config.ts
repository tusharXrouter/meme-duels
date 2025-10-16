import { NextConfig } from 'next';

/** @type {import("next").NextConfig} */
const baseConfig: NextConfig = {
	typescript: {
		ignoreBuildErrors: false,
	},
	eslint: {
		ignoreDuringBuilds: false,
	},
	// Simplified webpack configuration
	webpack: (config, { isServer, webpack }) => {
		// SVGR support for both server and client
		config.module.rules.push({
			test: /\.svg$/,
			issuer: /\.[jt]sx?$/,
			use: ['@svgr/webpack'],
		});

		if (!isServer) {
			// Essential polyfills only
			config.resolve.fallback = {
				...config.resolve.fallback,
				buffer: require.resolve('buffer'),
				crypto: require.resolve('crypto-browserify'),
				stream: require.resolve('stream-browserify'),
				fs: false,
				net: false,
				tls: false,
			};

			// Essential global polyfills
			config.plugins.push(
				new webpack.ProvidePlugin({
					Buffer: ['buffer', 'Buffer'],
				})
			);
		}
		return config;
	},
	reactStrictMode: true,
	compress: true,
	images: {
		remotePatterns: [
			{ protocol: 'https', hostname: '**.coingecko.com' },
			{ protocol: 'https', hostname: '**.coinmarketcap.com' },
			{ protocol: 'http', hostname: '**' },
			{ protocol: 'https', hostname: '**' },
		],
		localPatterns: [
			{ pathname: '/images/**', search: '' },
			{ pathname: '/src/assets/**', search: '' },
			{ pathname: '/meme-avatars/**', search: '' },
			{ pathname: '/*.png', search: '' },
		],
		deviceSizes: [640, 750, 828, 1080, 1200],
		imageSizes: [16, 32, 48, 64, 96],
		formats: ['image/webp'],
		minimumCacheTTL: 60,
		dangerouslyAllowSVG: false,
		contentDispositionType: 'attachment',
		contentSecurityPolicy: "default-src 'self'; img-src 'self' data: https:;",
	},

	experimental: {
		serverActions: {
			bodySizeLimit: '10mb',
		},
		// Enable CSS optimization for better performance
		optimizeCss: true,
		optimizePackageImports: ['@radix-ui/react-slot', 'lucide-react'],
	},

	poweredByHeader: false,
	transpilePackages: [],
};

export default baseConfig;
