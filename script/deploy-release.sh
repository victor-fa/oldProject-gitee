#!/bin/bash
set -e				# 遇到错误就退出
# cd "$(dirname "$0")"

username="root"
ip="139.224.53.23"

pemFilePath="./script/ssh-key/vw-website.pem"
tarPath=$(find . -name "public.tar.gz")
appFolder="chewrobot-website-release"

echo ${appFolder}

restartScriptPath="./script/restart-release.sh"

# chmod pem
chmod 400 ${pemFilePath}

# ssh to create folder if not exsit
ssh -o StrictHostKeyChecking=no -i ${pemFilePath} ${username}@${ip} "mkdir -p /root/${appFolder};pwd;ls"

echo "scp -o StrictHostKeyChecking=no -i ${pemFilePath} ${tarPath} ${username}@${ip}:~/${appFolder}"
# scp tar file to hosts ( runing nginx docker image)
scp -o StrictHostKeyChecking=no -i ${pemFilePath} ${tarPath} ${username}@${ip}:~/${appFolder}



# ssh to thoses hosts and run 'restart.sh' // ssh root@MachineB 'bash -s' < local_script.sh
ssh -t -o StrictHostKeyChecking=no -i ${pemFilePath} ${username}@${ip} 'bash -s' -- < ${restartScriptPath} ${appFolder}


