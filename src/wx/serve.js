const { execSync } = require('child_process');
const path = require('path');
const { getWxToolPath } = require('./utils');

// 获取命令行参数
const args = process.argv.slice(2);
const b_cover = args[0] || 'none';
const b_mode = args[1] || 'mp-weixin';

// 主函数
function main() {
  // 获取微信开发者工具路径
  const { cli } = getWxToolPath();
  
  // 打开项目
  const projectPath = path.resolve('./dist/dev/mp-weixin');
  
  try {
    execSync(`"${cli}" open --project "${projectPath}"`, { stdio: 'inherit' });
  } catch (error) {
    console.error('打开项目失败:', error.message);
  }
  
  // 构建项目
  let buildCommand;
  if (b_cover === 'cover') {
    buildCommand = `npx cross-env VITE_ENV=dev LR_COVER=1 LR_TYPE=dev uni -p "${b_mode}"`;
  } else {
    buildCommand = `npx cross-env VITE_ENV=dev LR_TYPE=dev uni -p "${b_mode}"`;
  }
  
  try {
    execSync(buildCommand, { stdio: 'inherit' });
  } catch (error) {
    console.error('构建失败:', error.message);
    process.exit(1);
  }
}

// 执行主函数
main(); 