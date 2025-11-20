/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      new URL('https://oldschool.runescape.wiki/images/**'),
      new URL('https://cdn.discordapp.com/avatars/**'),
    ],
  },
}

module.exports = nextConfig
