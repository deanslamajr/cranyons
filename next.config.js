/** @type {import('next').NextConfig} */
const nextConfig = {
  // for docker image builds, as described in official README: https://github.com/vercel/next.js/tree/canary/examples/with-docker
  output: "standalone",
};

module.exports = nextConfig;
