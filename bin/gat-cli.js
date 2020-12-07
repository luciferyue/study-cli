#!/usr/bin/env node
const program = require('commander');

//版本号
program.version(require('../package.json').version);


program.command('init <name>')
  .description('init project')
  .action(require('../lib/init'));

//process当前进程 ，argv执行当前进程的参数
program.parse(process.argv)
