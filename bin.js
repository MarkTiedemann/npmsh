#!/usr/bin/env node

const readline = require('readline')
const { spawn, execSync } = require('child_process')
const { join } = require('path')

const { cmdList, aliases, shorthands, affordances } = require(join(
  execSync('npm config get prefix').toString().trim(),
  'node_modules/npm/lib/config/cmd-list'
))

const buildInCmds = cmdList.concat(
  ...[aliases, affordances, shorthands]
  .map(o => Object.keys(o))
)

const pkg = require(join(
  process.cwd(), 'package.json'
))

const scripts = Object.keys(pkg.scripts || {})

const unique = array => Array.from(new Set(array))

const completions = unique(
  ['exit', 'clear']
  .concat(buildInCmds, scripts)
  .sort((a, b) => a.localeCompare(b))
)

const completer = line => {
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

  const npmArgs = !scripts.includes(bin) && buildInCmds.includes(bin)
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

rl.prompt()

rl.on('line', line => {
  const cmds = line.trim()
  switch (cmds) {
    case 'exit':
      return rl.close()

    case 'clear':
      readline.cursorTo(process.stdout, 0, 0)
      readline.clearScreenDown(process.stdout)
      return rl.prompt()

    case '':
      return rl.prompt()

    default: run(
      cmds.split('&&')
      .map(cmd => cmd.trim())
      .filter(cmd => !!cmd)
    )
  }
})
