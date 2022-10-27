#!/bin/sh
#######################################

log="$(git pull)"

echo $log

if [ "$log" != "Already up to date." ];then
  echo "⚠️ ⚠️ ⚠️ ⚠️  请先确认是否有代码冲突️ ⚠️ ⚠️ ⚠️ ⚠️ "
  echo "确认无误后重试"
  exit
fi

yarn publish

git add .

msg="update"
if [[ -n $1 ]] && [[ -n $2 ]] && [[ $1 == "-m" ]]; then
  msg=$2
fi

git commit -m $msg
git push
