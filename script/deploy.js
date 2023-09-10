const fs = require('fs');
const path = require('path');
const Client = require('ftp');
const ignore = require('ignore');

// 配置信息
const config = {
  host: 'vhost276.cloudvhost.cn',
  port: 21,
  user: 'webmaster@HA675619',
  password: 'cay69090595',
  localRoot: './public/',      // 本地目录路径
  remoteRoot: 'WEB/',    // 远程目录路径
  blacklist: []
};

// 创建FTP客户端对象并连接到服务器
const client = new Client();
client.on('ready', traverseLocalFolder);
client.connect(config);

const ignoreRules = ignore();
ignoreRules.add(config.blacklist);


// 递归遍历本地文件夹，并上传每个文件到FTP服务器
function traverseLocalFolder() {
  traverseFolder(config.localRoot, config.remoteRoot)
    .then(() => {
      console.log("All files uploaded!");
      client.end();
    })
    .catch((err) => {
      console.error("Error uploading files:", err);
      client.end();
    });
}

// 递归遍历本地文件夹，并上传每个文件到FTP服务器
function traverseFolder(localPath, remotePath) {
  return new Promise((resolve, reject) => {
    fs.readdir(localPath, { withFileTypes: true }, (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      for (const file of files) {
        const fileName = file.name;
        const localFilePath = path.join(localPath, fileName);
        const remoteFilePath = path.join(remotePath, fileName);
        if (!ignoreRules.ignores(localFilePath)) {
          if (file.isDirectory()) {
            client.mkdir(remoteFilePath, err => {
              traverseFolder(localFilePath, remoteFilePath)
                .then(() => {
                  resolve();
                })
                .catch((err) => {
                  reject(err);
                });
            });
          } else {
            uploadFileToServer(localFilePath, remoteFilePath)
              .then(() => {
                console.log("File uploaded:", remoteFilePath);
                resolve();
              })
              .catch((err) => {
                reject(err);
              });
          }
        };
      }

      if (files.length === 0) {
        resolve();
      }
    });
  });
}



// 上传文件到FTP服务器
function uploadFileToServer(localPath, remotePath) {
  return new Promise((resolve, reject) => {
    client.put(localPath, remotePath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
