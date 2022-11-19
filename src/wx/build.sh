#!/bin/sh
####################################### 环境变量
git_name="$(git rev-parse --abbrev-ref HEAD)"
b_version="${git_name#*-}" #构建版本号
b_version="${b_version#*/}" #构建版本号

b_env="prod" #构建环境
if [[ -n $1 ]]; then
  b_env=$1
fi

b_mode="mp-weixin" 
if [[ -n $2 ]]; then
  b_mode=$2
fi

####################################### build
echo "LR: 开始构建"

yarn
yarn cross-env VITE_ENV="${b_env}" LR_COVER=1 uni build -p "${b_mode}"

echo "LR: 构建完成"

####################################### tool cli
tool_path=$(cat ./node_modules/@lr17/loader/src/wx/wxpath)
os=`uname  -a`
if [[ $os =~ "Darwin" ]]; then # mac
  cli="${tool_path}/Contents/MacOS/cli"
  open="open"
else # window
  if [[ -f "./wxpath" ]]; then
    tool_path=$(cat ./wxpath)
  else
    echo "\n ❌ ❌ window系统请创建wxpath文件，内容为微信开发工具安装位置\n"
    echo "任意按键关闭窗口"
    read -n 1
    exit 1
  fi
  cli="${tool_path}/cli.bat"
  open="start"
fi

####################################### 上传
project_path="$(cd "$(dirname "$0")";pwd)/../../../../../dist/build/mp-weixin" # 工程绝对路径

"${cli}" upload --project "${project_path}" -v "${b_version}" -d "自动打包 - ${b_env}"
"${cli}" open --project "${project_path}"

echo "\n 🎉 🎉 🎉   Done  请前往 https://mp.weixin.qq.com/ 提交审核\n \n"
"${open}" https://mp.weixin.qq.com/

if [[ $os =~ "Darwin" ]]; then # mac
  exit 0
else # window
  echo "任意按键关闭窗口"
  read -n 1
  exit 0
fi