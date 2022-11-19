const path = require('path');
const ci = require('miniprogram-ci')
var fs = require('fs')

let parm = process.argv.slice(2)
let env = parm[0]
let version = parm[1]
let robot = 2
let {
  appid
} = require(path.resolve('./src/manifest.json'))["mp-weixin"]

console.log('机器人为：', robot)

let d = path.resolve(`./pack`)
fs.exists(d, (e) => {
  if (!e) { // 已存在
    fs.mkdir(d, () => {
      console.log('创建目录', d)
    })
  }
})

const project = new ci.Project({
  appid,
  type: 'miniProgram',
  projectPath: path.resolve('./dist/build/mp-weixin'),
  privateKeyPath: path.resolve(`./private.${appid}.key`),
  // ignores: ['node_modules/**/*'],
})
ci.preview({
  project,
  desc: `${version} - ${env}`, // 此备注将显示在“小程序助手”开发版列表中
  robot,
  setting: {
    es6: true,
    minify: true,
    autoPrefixWXSS: true
  },
  qrcodeFormat: 'image',
  qrcodeOutputDest: path.resolve('./pack/qrcode.jpg'),
  // onProgressUpdate: console.log,
  // pagePath: 'pages/index/index', // 预览页面
  // searchQuery: 'a=1&b=2',  // 预览参数 [注意!]这里的`&`字符在命令行中应写成转义字符`\&`
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
