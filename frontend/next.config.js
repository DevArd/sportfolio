/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/marketplace',
                permanent: true,
            },
        ]
    },
}

module.exports = nextConfig
