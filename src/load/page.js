const path = require('path');
var fs = require('fs')
var stat = fs.stat

function copy(src, dst) {
  fs.readdir(src, function(err, paths) { // 读取目录中的所有文件/目录
    if (err) {
      console.log('⚠️  ', err.message);
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
          console.log('load', _dst)
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

function tryCopy(src, dst) {
  file(dst, () => {
    copy(src, dst)
  })
}

function file(src, cb) {
  exist(src, cb, () => {
    console.log('create', src)
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

function loadPages(from, pages, cover) {
  console.log('🚗  ------------------------')
  console.log(`🚗  开始加载 ${from} `)
  let d = path.resolve(`./src/pages_com`)

  function _copy() {
    pages.forEach(page => {
      let src = path.resolve(`./node_modules/${from}/${page}`)
      let dst = path.resolve(`./src/pages_com/${page}`)
      console.log(src, '=>', dst)
      tryCopy(src, dst)
    })
  }

  exist(d, () => {
    if (cover) {
      console.log('🚗  目录 pages_com 已存在，将进行覆盖 ！！！！')
      _copy()
    } else {
      console.log(`🚗  目录 pages_com 已存在，如需更新，请确保代码已提交 ${from} 后删除该目录并重新运行 ！！！！`)
    }
    console.log('🚗  ------------------------')
  }, () => {
    fs.mkdirSync(d)
    _copy()
  })
}

function loadComponents(from, dirs, cover) {
  console.log('🚗  ------------------------')
  console.log(`🚗  开始加载 ${from} `)
  dirs.forEach(dir => {
    let name = `${dir}/__com`
    let d = path.resolve(`./src/${name}`)

    function _copy() {
      let src = path.resolve(`./node_modules/${from}`)
      console.log(src, '=>', d)
      tryCopy(src, d)
    }

    exist(d, () => {
      if (cover) {
        console.log(`🚗  目录 ${name} 已存在，将进行覆盖 ！！！！`)
        _copy()
      } else {
        console.log(`🚗  目录 ${name} 已存在，如需更新，请确保代码已提交 ${from} 后删除该目录并重新运行 ！！！！`)
      }
      console.log('🚗  ------------------------')
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
  let cover = process.env.VITE_ENV == 'prod' || process.env.LR_TYPE == 'package' || process.env.LR_COVER == '1'
  if (opt.page) {
    loadPages(opt.page.from, opt.page.paths, cover)
  }
  if (opt.component) {
    loadComponents(opt.component.from, opt.component.paths, cover)
  }
}

module.exports = {
  load,
  dirs
}
