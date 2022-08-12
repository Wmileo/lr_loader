#!/bin/sh
####################################### project
project_path="$(cd "$(dirname "$0")";pwd)/../../../../../dist/build/mp-weixin" # 工程绝对路径
echo "${project_path}"

git_name="$(git rev-parse --abbrev-ref HEAD)"
b_version="${git_name#*-}" #构建版本号
b_version="${b_version#*/}" #构建版本号

b_env="prod" #构建环境
if [[ -n $1 ]]; then
  b_env=$1
fi

####################################### tool cli
tool_path=$(cat ./node_modules/@lr17/loader/src/mp/wxpath)
os=`uname  -a`
if [[ $os =~ "Darwin" ]]; then # mac
  cli="${tool_path}/Contents/MacOS/cli"
  open="open"
else # window
  if [[ -f "./wxpath" ]]; then
    tool_path=$(cat ./wxpath)
  else
    echo "\n window系统请创建wxpath文件，内容为微信开发工具安装位置\n"
  fi
  cli="${tool_path}/cli.bat"
  open="start"
fi
####################################### build
yarn

if [[ $b_env == "prod" ]]; then
yarn cross-env VITE_ENV="${b_env}" uni build -p mp-weixin-prod
else 
yarn cross-env VITE_ENV="${b_env}" uni build -p mp-weixin
fi

"${cli}" upload --project "${project_path}" -v "${b_version}" -d "自动打包 - ${b_env}"

"${cli}" open --project "${project_path}"

echo "\n 🎉 🎉 🎉   Done  请前往 https://mp.weixin.qq.com/ 提交审核\n \n"

"${open}" https://mp.weixin.qq.com/

sleep 1m
