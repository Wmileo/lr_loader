export default function plugin(opt) {
  return {
    name: 'tmp',
    enforce: 'pre',
    transform(code, path) {
      opt.dirs.some(dir => {
        let ok = path.replace(/\\/g, '/').indexOf('/src/' + dir) > 0 //兼容window
        if (ok) {
          code = code.replace(/__com/g, `${dir}/__com`)
        }
        return ok
      })
      return code
    }
  }
}