#!/bin/sh
####################################### project

b_cover="none" #是否覆盖
if [[ -n $1 ]]; then
  b_cover=$1
fi

b_mode="mp-weixin"
if [[ -n $2 ]]; then
  b_mode=$2
fi

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
    echo "\n window系统请创建wxpath文件，内容为微信开发工具安装位置\n"
  fi
  cli="${tool_path}/cli.bat"
  open="start"
fi

####################################### open

project_path="$(cd "$(dirname "$0")";pwd)/../../../../../dist/dev/mp-weixin" # 工程绝对路径
"${cli}" open --project "${project_path}"

####################################### build

if [[ $b_cover == "cover" ]]; then
  npx cross-env VITE_ENV=dev LR_COVER=1 LR_TYPE=dev uni -p "${b_mode}"
else 
  npx cross-env VITE_ENV=dev LR_TYPE=dev uni -p "${b_mode}"
fi
