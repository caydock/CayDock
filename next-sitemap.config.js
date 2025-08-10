const siteMetadata = require("./src/utils/siteMetaData");


module.exports = {
  siteUrl: siteMetadata.siteUrl,
  generateRobotsTxt: true,
  exclude: ['/admin'],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', disallow: ['/admin'] },
    ],
  },
}