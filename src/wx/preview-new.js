const { execSync } = require('child_process');

// 获取命令行参数
const args = process.argv.slice(2);
const b_env = args[0] || 'prod';
const b_mode = args[1] || 'mp-weixin';

// 获取git分支名和版本号
function getGitInfo() {
  try {
    const gitBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    let b_version = gitBranch.replace(/^.*?-/, ''); // 构建版本号
    b_version = b_version.replace(/^.*?\//, ''); // 构建版本号
    return { gitBranch, b_version };
  } catch (error) {
    console.error('获取git信息失败:', error.message);
    return { gitBranch: 'unknown', b_version: '1.0.0' };
  }
}

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
  
  // 执行预览脚本
  try {
    execSync(`node ./node_modules/@lr17/loader/src/wx/preview.js ${b_env} ${b_version}`, { stdio: 'inherit' });
  } catch (error) {
    console.error('预览失败:', error.message);
    process.exit(1);
  }
}

// 执行主函数
main(); 