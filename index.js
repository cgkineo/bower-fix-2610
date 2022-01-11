const Mod = require('module')
// Monkey patch global require function
const o = Mod.prototype.require
Mod.prototype.require = function () {
  const module = o.apply(this, arguments)
  const name = arguments[0]
  // Check for require('child_process')
  if (name !== 'child_process') return module
  // Monkey patch spawn function
  const p = module.spawn
  module.spawn = function () {
    const cmd = arguments[0]
    const args = arguments[1]
    // Check that arguments begin ['git', ['ls-remote', ...]]
    if (typeof cmd !== 'string' || cmd !== 'git' || !Array.isArray(args) || args[0] !== 'ls-remote') return p.apply(this, arguments)
    arguments[1] = args.map(function (arg) {
      if (typeof arg !== 'string') return arg
      // Replace git://github.com with https://github.com
      return arg.replace(/git:\/\/github.com/, 'https://github.com')
    })
    return p.apply(this, arguments)
  }
  return module
}
