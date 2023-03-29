
pipeline {
    agent any

    stages {
        
        stage('git pull') {
            steps {
                // 拉取git最新代码
                git credentialsId: '0b01fc98-8ce1-4477-8528-3247ce649132', url: 'https://gitee.com/xxx/jjds-xxx-react.git'
            }
        }

        stage('dotnet publish && 7z') {
            steps {
                // 执行本机PowerShell命令
                powershell '''
                echo 'node version'
                node -v
                echo 'npm version'
                npm -v
                echo 'yarn version'
                yarn -v
                echo 'clear build folder'
                (Test-Path .\\build)-eq $true -and (rd -r -Path build)                
                echo 'install node_modules'
                yarn
                echo 'make production package '
                yarn run build:pro
                echo 'run 7z'
                cd build
                E:\\Software\\7-Zip\\7z.exe a publish.7z .
                echo 'is exist publish.7z ?'
                Test-Path publish.7z
                '''
            }
        }

        stage('stop app && delete remote file') {
            steps {
                // 执行远程命令 (服务器IP,密钥ID)
                sshCommand remote: GetRemoteServerInfo("1.117.xxx.xxx", 'e788e1f7-dde1-47d9-aacf-3a36564b1fa0'), command: '''
                    echo 'stop nginx'
                    docker stop nginx
                    echo 'clear jjds folder'
                    rm -r -f /data/nginx/html/jjds
                 '''
            }
        }

        stage('push 7z to remote service && start app') {
            steps {
                sshPublisher(publishers: [
                        sshPublisherDesc(
                                // 在 Config System 中配置ip,账号密码等(!! 不可以有中文,否则找不到)
                                configName: 'tx-centos7',
                                transfers: [
                                        sshTransfer(
                                                // 欲上传的本机目录或文件(省略星号就上传不了,很奇怪,只能加上星号通配符,估计是bug)
                                                sourceFiles: '**\\build\\publish.7z',
                                                // 移除前缀,如果不填,则会自动生成sourceFiles的前缀目录
                                                removePrefix: '\\build\\',
                                                // 远程服务器目录
                                                remoteDirectory: '/data/nginx/html/',
                                                // 清空远程目录
                                                cleanRemote: false,                           
                                                // 上传完后,执行远程命令
                                                execCommand: 'cd /data/nginx/html/ && 7z x publish.7z -o./jjds && chmod 777 -R /data/nginx/html/jjds/ && docker start nginx && rm -r -f /data/nginx/html/publish.7z', 
                                                excludes: '',                                                
                                                execTimeout: 120000,
                                                flatten: false,
                                                makeEmptyDirs: false,
                                                noDefaultExcludes: false,
                                                patternSeparator: '[, ]+',                                                
                                                remoteDirectorySDF: false,                                                
                                        )
                                ],
                                usePromotionTimestamp: false,
                                useWorkspaceInPromotion: false,
                                verbose: true
                        )
                ])
            }
        }

    }
}

//获取本机存储的凭据信息
def GetRemoteServerInfo(ip, credentials) {
    def remote = [:]
    remote.name = ip
    remote.host = ip
    remote.port = 22
    remote.allowAnyHosts = true
    //通过withCredentials调用Jenkins凭据中已保存的凭据
    withCredentials([usernamePassword(credentialsId: credentials, passwordVariable: 'password', usernameVariable: 'userName')]) {
        remote.user = "${userName}"
        remote.password = "${password}"
    }
    return remote
}


