const fs = require('fs');
const { promisify } = require('util');
const exists = promisify(fs.exists);
const mkdir = promisify(fs.mkdir);

const chalk = require('chalk');
const log = content => console.log(chalk.red(content));

const copy = async (src, dst) => {
  // 读取目录中的所有文件/目录
  const paths = fs.readdirSync(src);
  paths.forEach(async (path) => {
    if (path === "node_modules") return;
    let _src = src + '/' + path,
      _dst = dst + '/' + path;
    await isDir(_src, _dst, path);
  });
}

const isDir = async (_src, _dst, path) => {
  return new Promise((resolve, reject) => {
    let readable,
      writable;
    fs.stat(_src, async (err, stats) => {
      if (err) {
        log('读取文件失败');
        reject(err);
      }
      // 判断是否为文件
      if (stats.isFile()) {
        // 创建读取流
        readable = fs.createReadStream(_src);
        // 创建写入流
        writable = fs.createWriteStream(_dst);
        // 通过管道来传输流
        readable.pipe(writable);
        resolve(true);
      } else if (stats.isDirectory()) {
        // 如果是目录则递归调用自身
        await Exists(_src, _dst, copy);
        resolve(true);
      }
    })
  })
}

const Exists = async (src, dst, cb) => {
  const res = await exists(dst);
  if (res) {
    await cb(src, dst)
  } else {
    await mkdir(dst);
    await cb(src, dst);
  }
}

module.exports.copy = async (src, dst) => {
  await Exists(src, dst, copy);
}