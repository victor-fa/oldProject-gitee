#!/usr/bin/env bash

set -e				# 遇到错误就退出

echo helloworld
echo ${USER}


appFolder="$1"
containerName="${appFolder}"
# exeName="account"

subNetworkName="vw"
subNetworkIp="172.168.0.230"

# go to app folder
cd ${appFolder}
tarPath=$(find . -name "*.tar.gz")

# untar
tar -zxvf ${tarPath}

# create soft link file
# ln -sf ${jarPath} ./${exeName}

# restart nginx docker
# delete container if exsit
if [ "$(docker ps -a -q -f name=${containerName})" ]; then
	# stop api docker images
	docker ps -aq --no-trunc --filter "name=${containerName}" \
	| xargs docker stop

	# start api docker images
	docker ps -aq --no-trunc --filter "name=${containerName}" \
	| xargs docker rm
fi

defaultConf="server {
    listen       80;
    server_name  localhost;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }

    error_page  404              /index.html;

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}"

echo "$defaultConf" > default.conf

# re run a new container
docker run --name ${containerName} -d \
	--net ${subNetworkName} \
	--ip ${subNetworkIp} \
	--restart=always \
	-v `pwd`/dist:/usr/share/nginx/html:ro \
	-v `pwd`/default.conf:/etc/nginx/conf.d/default.conf \
	-d nginx

