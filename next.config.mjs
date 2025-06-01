/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
          "images.unsplash.com", // required for your current placeholders
          "cdn.pixabay.com",      // optional: you can add more
          "placekitten.com" ,
          "source.unsplash.com"      // optional fun example
        ],
      },
};

export default nextConfig;
