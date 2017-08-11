#!/usr/bin/env node

const flags = process.argv.slice(2)

if (flags.includes('-v') || flags.includes('--version'))
  return console.log('v' + require('./package.json').version)

const readline = require('readline')
const { spawn } = require('child_process')
const crossClear = require('cross-clear')
const unique = require('lodash.uniq')
const builtins = require('./lib/builtins')
const loadScripts = require('./lib/load-scripts')
const stripPrefix = require('./lib/strip-prefix')

let scripts = loadScripts()

const reload = () => {
  scripts = loadScripts()
  rl.prompt()
}

const getCompletions = () => unique(
  ['exit', 'clear']
  .concat(builtins, scripts)
  .sort()
)

const completer = line => {
  const completions = getCompletions()
  const hits = completions.filter(c => c.startsWith(line))
  return [hits.length ? hits : completions, line]
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'λ ',
  completer
})

function run (cmds) {
  const [bin, ...rest] = cmds.shift().split(' ')

  const npmBin = process.platform === 'win32'
    ? 'npm.cmd'
    : 'npm'

  const npmArgs = !scripts.includes(bin) && builtins.includes(bin)
    ? [bin, ...rest]
    : ['run', bin, '--', ...rest]

  spawn(npmBin, npmArgs, { stdio: 'inherit' })
  .on('close', code => {
    process.stdout.write('\n')
    code || !cmds.length
      ? rl.prompt()
      : run(cmds)
  })
}

const prepareCmds = cmds =>
  cmds.split('&&')
  .map(cmd => cmd.trim())
  .map(stripPrefix('npm run '))
  .map(stripPrefix('npm '))
  .filter(Boolean)

const clear = () => {
  crossClear()
  rl.prompt()
}

rl.prompt()

rl.on('line', line => {
  const cmds = line.trim()
  switch (cmds) {
    case 'exit': return rl.close()
    case 'clear': return clear()
    case 'reload': return reload()
    case '': return rl.prompt()
    default: run(prepareCmds(cmds))
  }
})
