const { execSync } = require('child_process');
const path = require('path');
const os = require('os');
const { getWxToolPath, getGitInfo } = require('./utils');

// 获取命令行参数
const args = process.argv.slice(2);
const b_env = args[0] || 'prod';
const b_mode = args[1] || 'mp-weixin';

// 主函数
function main() {
  const { b_version } = getGitInfo();
  
  console.log('LR: 开始构建');
  
  // 执行构建命令
  try {
    execSync(`npx cross-env VITE_ENV="${b_env}" LR_COVER=1 LR_TYPE=build uni build -p "${b_mode}"`, { stdio: 'inherit' });
    console.log('LR: 构建完成');
  } catch (error) {
    console.error('构建失败:', error.message);
    process.exit(1);
  }
  
  // 获取微信开发者工具路径
  const { cli, open } = getWxToolPath();
  
  // 上传和打开项目
  const projectPath = path.resolve('./dist/build/mp-weixin');
  
  try {
    execSync(`"${cli}" upload --project "${projectPath}" -v "${b_version}" -d "自动打包 - ${b_env}"`, { stdio: 'inherit' });
    execSync(`"${cli}" open --project "${projectPath}"`, { stdio: 'inherit' });
  } catch (error) {
    console.error('上传或打开项目失败:', error.message);
  }
  
  console.log('\n 🎉 🎉 🎉   Done  请前往 https://mp.weixin.qq.com/ 提交审核\n \n');
  
  // 打开微信公众平台
  try {
    execSync(`${open} https://mp.weixin.qq.com/`);
  } catch (error) {
    console.error('打开浏览器失败:', error.message);
  }
  
  if (os.platform() === 'darwin') {
    process.exit(0);
  } else {
    console.log('任意按键关闭窗口');
    process.stdin.read();
    process.exit(0);
  }
}

// 执行主函数
main(); 