const fs = require('fs');
const os = require('os');
const { execSync } = require('child_process');

// 获取微信开发者工具路径
function getWxToolPath() {
  try {
    const toolPath = fs.readFileSync('./node_modules/@lr17/loader/src/wx/wxpath', 'utf8').trim();
    const platform = os.platform();
    
    if (platform === 'darwin') { // macOS
      return {
        cli: `${toolPath}/Contents/MacOS/cli`,
        open: 'open'
      };
    } else { // Windows
      let wxPath = toolPath;
      if (fs.existsSync('./wxpath.txt')) {
        wxPath = fs.readFileSync('./wxpath.txt', 'utf8').trim();
      } else {
        console.log('\n ❌ ❌ window系统请创建wxpath.txt文件，内容为微信开发工具安装位置\n');
        console.log('任意按键关闭窗口');
        process.stdin.read();
        process.exit(1);
      }
      return {
        cli: `${wxPath}/cli.bat`,
        open: 'start'
      };
    }
  } catch (error) {
    console.error('获取微信开发者工具路径失败:', error.message);
    process.exit(1);
  }
}

// 获取git分支名和版本号
function getGitInfo() {
  try {
    const gitBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    let b_version = gitBranch.replace(/^.*?-/, ''); // 构建版本号
    b_version = b_version.replace(/^.*?\//, ''); // 构建版本号
    console.log('b_version', b_version);
    return { gitBranch, b_version };
  } catch (error) {
    console.error('获取git信息失败:', error.message);
    return { gitBranch: 'unknown', b_version: '1.0.0' };
  }
}

module.exports = {
  getWxToolPath,
  getGitInfo
}; 