const path = require('path');
var fs = require('fs')
var stat = fs.stat

function copy(src, dst) {
  fs.readdir(src, function(err, paths) { // 读取目录中的所有文件/目录
    if (err) {
      console.log('LR - error: ', src, dst);
      console.log('LR - error: ', err.message);
      throw err
    }
    paths.forEach(function(path) {
      let arr = path.split('.')
      let _dst = dst + '/' + path
      let _src = src + '/' + path
      stat(_src, function(err, st) {
        if (err) {
          throw err
        }
        if (st.isFile()) { // 判断是否为文件
          let readable = fs.createReadStream(_src) // 创建读取流
          let writable = fs.createWriteStream(_dst) // 创建写入流
          readable.pipe(writable) // 通过管道来传输流
        } else if (st.isDirectory()) { // 如果是目录则递归调用自身
          tryCopy(_src, _dst)
        }
      })
    })
  })
}

function deleteDir(dir) {
  var files = [];
  if (fs.existsSync(dir)) {
    files = fs.readdirSync(dir);
    files.forEach(function(file, index) {
      var curPath = dir + "/" + file;
      if (fs.statSync(curPath).isDirectory()) { // recurse
        deleteDir(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dir);
  }
}

function tryCopy(src, dst) {
  file(dst, () => {
    copy(src, dst)
  })
}

function file(src, cb) {
  exist(src, cb, () => {
    fs.mkdirSync(src)
    cb()
  })
}

function exist(src, yes, no) {
  if (fs.existsSync(src)) { // 已存在
    yes()
  } else { // 不存在
    no()
  }
}

function build(from, to, dirs) {
  console.log(`LR: --------------------`)
  console.log(`LR: 开始构建`)
  console.log(`LR: 开始清空 ${to}`)
  deleteDir(path.resolve(to))
  if (dirs) {
    function _copy() {
      console.log('LR: 开始复制', dirs?.toString() ?? '')
      dirs.forEach(p => {
        tryCopy(path.resolve(`${from}/${p}`), path.resolve(`${to}/${p}`))
      })
    }
    file(path.resolve(to), _copy)
  } else {
    tryCopy(path.resolve(from), path.resolve(to))
  }
}

function loadPages(from, pages, cover) {
  console.log(`LR: --------------------`)
  console.log(`LR: 开始加载页面 ${from} `)
  let d = path.resolve(`./src/pages_com`)
  console.log('LR: 开始复制页面', pages.toString())

  function _copy() {
    pages.forEach(p => {
      tryCopy(path.resolve(`${from}/${p}`), path.resolve(`./src/pages_com/${p}`))
    })
  }

  exist(d, () => {
    if (cover) {
      console.log('LR: 目录 pages_com 已存在，将进行覆盖 ！！！！')
      _copy()
    } else {
      console.log(`LR: 目录 pages_com 已存在，如需更新，请确保代码已提交 ${from} 后删除该目录并重新运行 ！！！！`)
    }
  }, () => {
    fs.mkdirSync(d)
    _copy()
  })
}

function loadComponents(from, dirs, cover) {
  console.log(`LR: --------------------`)
  console.log(`LR: 开始加载组件 ${from} `)
  dirs.forEach(dir => {
    let name = `${dir}/__com`
    let d = path.resolve(`./src/${name}`)
    console.log('LR: 开始复制组件到', name)

    function _copy() {
      tryCopy(path.resolve(`${from}`), d)
    }

    exist(d, () => {
      if (cover) {
        console.log(`LR: 目录 ${name} 已存在，将进行覆盖 ！！！！`)
        _copy()
      } else {
        console.log(`LR: 目录 ${name} 已存在，如需更新，请确保代码已提交 ${from} 后删除该目录并重新运行 ！！！！`)
      }
    }, () => {
      _copy()
    })
  })
}

function dirs(pages, ext) {
  return [...pages.map(item => {
    return 'pages_com/' + item
  }), ...ext]
}

function load(opt) {
  let cover = process.env.LR_COVER == '1'
  if (opt.page) {
    loadPages(opt.page.from, opt.page.paths, cover)
  }
  if (opt.component) {
    loadComponents(opt.component.from, opt.component.paths, cover)
  }
  if (opt.build) {
    build(opt.build.from, opt.build.to, opt.build.dirs)
  }
}

module.exports = {
  load,
  dirs
}
