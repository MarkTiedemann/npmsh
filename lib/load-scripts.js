const { readFileSync } = require('fs')
const { join } = require('path')

module.exports = () => {
  try {
    const file = join(process.cwd(), 'package.json')
    const content = readFileSync(file).toString()
    const scripts = JSON.parse(content).scripts || {}
    return Object.keys(scripts)
  } catch (e) {
    return {}
  }
}