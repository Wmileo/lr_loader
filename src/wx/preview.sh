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

npx cross-env VITE_ENV="${b_env}" LR_COVER=1 LR_TYPE=build uni build -p "${b_mode}"

echo "LR: 构建完成"

node ./node_modules/@lr17/loader/src/wx/preview.js ${b_env} ${b_version}
