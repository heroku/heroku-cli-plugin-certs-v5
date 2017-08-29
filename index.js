'use strict'

let _ = require('lodash')

exports.topics = [
  {
    name: 'certs',
    description: 'a topic for the ssl plugin',
    overview: `SSL is a cryptographic protocol that provides end-to-end encryption and integrity for all web requests. Apps that transmit sensitive data should enable SSL to ensure all information is transmitted securely.
To enable SSL on a custom domain, for example, www.example.com, use the SSL Endpoint add-on.
SSL Endpoint is a paid add-on service. Please keep this in mind when provisioning the service`},
  {name: '_certs', hidden: true}
]

let commands = [
  require('./commands/certs/index.js'),
  require('./commands/certs/add.js'),
  require('./commands/certs/chain.js'),
  require('./commands/certs/generate.js'),
  require('./commands/certs/info.js'),
  require('./commands/certs/key.js'),
  require('./commands/certs/remove.js'),
  require('./commands/certs/rollback.js'),
  require('./commands/certs/update.js')
]

let auto = [
  require('./commands/certs/auto.js'),
  require('./commands/certs/auto/enable.js'),
  require('./commands/certs/auto/disable.js'),
  require('./commands/certs/auto/refresh.js')
]

function deprecate (cmd) {
  let deprecatedRun = function (context) {
    let cli = require('heroku-cli-util')
    let topicAndCommand = _.select([cmd.topic, cmd.command]).join(':')
    cli.warn(`${cli.color.cmd(`heroku _${topicAndCommand}`)} has been deprecated. Please use ${cli.color.cmd(`heroku ${topicAndCommand}`)} instead.`)
    return cmd.run(context)
  }

  return Object.assign({}, cmd, {topic: '_certs', hidden: true, run: deprecatedRun})
}

exports.commands = commands.concat(commands.map((cmd) => deprecate(cmd))).concat(auto)
