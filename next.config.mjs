/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'cdn.pixabay.com',
      'placekitten.com',
      'source.unsplash.com',
      'res.cloudinary.com' // ✅ add this line
    ]
  }
}

export default nextConfig;
