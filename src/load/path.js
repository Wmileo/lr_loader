export default function plugin(opt) {
  return {
    name: 'tmp',
    enforce: 'pre',
    transform(code, path) {
      if (opt.paths) {
        opt.paths.some(dir => {
          let ok = path.replace(/\\/g, '/').indexOf('/src/' + dir) > 0
          if (ok) {
            code = code.replace(/__com/g, `@/${dir}/__com`)
          }
          return ok
        })
      } else if (opt.dir && opt.com) {
        if (path.replace(/\\/g, '/').indexOf(`/${opt.dir}/`) > 0) {
          code = code.replace(/__com/g, `${opt.dir}/${opt.com}`)
        }
      }
      return code
    }
  }
}