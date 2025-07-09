// next.config.mjs (or if package.json has "type": "module")
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['picsum.photos', 'media.istockphoto.com'], // Add the domain for your mock images
  },
};

export default nextConfig; // <-- Change 'module.exports' to 'export default'