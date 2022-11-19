const path = require('path');
const ci = require('miniprogram-ci')

let parm = process.argv.slice(2)
let env = parm[0]
let version = parm[1]
let robot = 1
let { appid } = require(path.resolve('./src/manifest.json'))["mp-weixin"]

console.log('机器人为：', robot)

const project = new ci.Project({
  appid,
  type: 'miniProgram',
  projectPath: path.resolve('./dist/build/mp-weixin'),
  privateKeyPath: path.resolve(`./private.${appid}.key`),
  // ignores: ['node_modules/**/*'],
})

ci.upload({
  project,
  version,
  desc: `环境： ${env}`,
  robot,
  setting: {
    es6: true,
    minify: true,
    codeProtect: true,
    autoPrefixWXSS: true
  },
  // onProgressUpdate: console.log,
}).then(res => {
  console.log('上传成功')
}).catch(err => {
  if (err.errCode == -1) {
    console.log('上传成功')
  } else {
    console.log('上传失败')
  }
  console.log(err)
  process.exit(-1)
})
