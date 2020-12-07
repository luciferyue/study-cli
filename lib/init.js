const { promisify } = require('util');
const figlet = promisify(require('figlet'));
const { clone } = require('./download');
const exec = require("child_process").exec;
const spawn = async (...args) => {
  const { spawn } = require('child_process');
  return new Promise(resolve => {
    const proc = spawn(...args);
    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);
    proc.on('close', () => {
      resolve();
    })
  })
}

const open = require('open');
const clear = require('clear');
const chalk = require('chalk');
const log = content => console.log(chalk.green(content));

module.exports = async name => {
  //打印欢迎页面
  clear();
  const data = await figlet('Welcome GAT Cli');
  log(data);
  log(`🚀创建项目: ${name}`);

  //初始化项目
  await clone('github:luciferyue/react-tel#develop', name);
  // await clone('gitlab:gitlab.wuxingdev.cn:bfe/gatling/gatling-cli', name);

  //安装依赖
  log(`安装依赖`);
  // await spawn('npm', ['i'], {
  //   cwd: `./${name}`
  // });

  //安装完成
  log(chalk.green(
    `👌安装完成:
    To get Start: ===========================
    cd ${name}
        npm run start
    ===========================`
  ));

  //打开
  // open('http://localhost:8888/');
  // await spawn('npm', ['start'], {
  //   cwd: `./${name}`
  // });
}