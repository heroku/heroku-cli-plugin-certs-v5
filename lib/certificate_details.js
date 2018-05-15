'use strict'

let cli = require('heroku-cli-util')
let formatDate = require('./format_date.js')

module.exports = function (cert, message) {
  let now = new Date()
  let auto_renews_at = new Date(cert.ssl_cert.expires_at)
  auto_renews_at.setMonth(auto_renews_at.getMonth() - 1)

  if (auto_renews_at > now) {
    cli.log(`Renewal scheduled for ${cli.color.green(formatDate(auto_renews_at))}.\n`)
  }

  let logMessage = message || 'Certificate details:'
  cli.log(logMessage)
  cli.styledObject({
    'Common Name(s)': cert.ssl_cert.cert_domains,
    'Expires At': formatDate(cert.ssl_cert.expires_at),
    'Issuer': cert.ssl_cert.issuer,
    'Starts At': formatDate(cert.ssl_cert.starts_at),
    'Subject': cert.ssl_cert.subject
  })

  if (cert.ssl_cert['ca_signed?']) {
    cli.log('SSL certificate is verified by a root authority.')
  } else if (cert.ssl_cert.issuer === cert.ssl_cert.subject) {
    cli.log('SSL certificate is self signed.')
  } else {
    cli.log('SSL certificate is not trusted.')
  }
}
