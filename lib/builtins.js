const { execSync } = require('child_process')
const { join } = require('path')

const { cmdList, aliases, shorthands, affordances } = require(join(
  execSync('npm config get prefix').toString().trim(),
  'node_modules/npm/lib/config/cmd-list'
))

module.exports = cmdList.concat(
  ...[aliases, affordances, shorthands]
  .map(Object.keys)
)
