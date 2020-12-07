const fs = require('fs'),
  stat = fs.stat;
const chalk = require('chalk');
const log = content => console.log(chalk.red(content));

const copy = async (src, dst) => {
  // 读取目录中的所有文件/目录
  fs.readdir(src, (err, paths) => {
    if (err) {
      log('读取文件失败');
    }
    paths.forEach(async (path) => {
      // if (path === "node_modules") return;
      let _src = src + '/' + path,
        _dst = dst + '/' + path,
        readable,
        writable;
      stat(_src, async (err, st) => {
        if (err) {
          log('读取文件失败');
        }

        // 判断是否为文件
        if (st.isFile()) {
          // 创建读取流
          readable = fs.createReadStream(_src);
          // 创建写入流
          writable = fs.createWriteStream(_dst);
          // 通过管道来传输流
          readable.pipe(writable);
        } else if (st.isDirectory()) {
          // 如果是目录则递归调用自身
          exists(_src, _dst, copy);
        }
      });
    });
  })
}

const exists = async (src, dst, cb) => {
  fs.exists(dst, (exists) => {
    // 已存在
    if (exists) {
      cb(src, dst);
    }
    // 不存在
    else {
      fs.mkdir(dst, () => {
        cb(src, dst);
      });
    }
  });
};

const isDir = async (_src, _dst, path) => {
  return new Promise((resolve, reject) => {
    let readable,
      writable;
    fs.stat(path, (err, stats) => {
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
        resolve();
      } else if (stats.isDirectory()) {
        // 如果是目录则递归调用自身
        exists(_src, _dst, copy);
        resolve();
      }
    })
  })
}

module.exports.copy = async (src, dst) => {
  exists(src, dst, copy)
}
