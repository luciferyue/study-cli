const { promisify } = require('util');
const chalk = require('chalk');
const log = content => console.log(chalk.red(content));

module.exports.clone = async (repo, desc) => {
  //repo 地址 ， desc 放的位置
  const download = promisify(require('download-git-repo'));
  const ora = require('ora');
  const process = ora(`下载... ${repo} ${desc}`);
  process.start();
  await download(repo, desc);
  process.succeed('下载成功');
}