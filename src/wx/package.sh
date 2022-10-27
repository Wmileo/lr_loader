#!/bin/sh
####################################### project
b_method="production"
b_env="prod" #构建环境
b_next="upload" #构建后续操作
r_num=1 #机器人编号

git_name="$(git rev-parse --abbrev-ref HEAD)"
b_version="${git_name#*-}" #构建版本号
b_version="${b_version#*/}" #构建版本号

echo "打包版本为 ${b_version}"

if [[ -n $2 ]]; then
  b_env=$2
fi

if [[ -n $1 ]]; then
  b_method=$1
fi

if [[ $b_method == "development" ]]; then # 开发版
  b_next="preview"
fi

if [[ $b_env == "test" ]]; then
  r_num=2
elif [[ $b_env == "dev" ]]; then
  r_num=3
fi

####################################### build

if [[ $b_method == "production" ]] && [[ $b_env == "prod" ]]; then
yarn cross-env LR_TYPE=package VITE_ENV="${b_env}" uni -p mp-weixin-prod
else 
yarn cross-env LR_TYPE=package VITE_ENV="${b_env}" uni -p mp-weixin
fi

node ./node_modules/@lr17/loader/src/wx/"${b_next}".js ${b_env} ${b_version} ${r_num}
