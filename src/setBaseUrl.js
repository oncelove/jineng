let baseUrl = "";   //这里是一个默认的url，可以没有
switch (process.env.NODE_ENV) {
    case 'development':
        // baseUrl = "http://192.168.0.112:8080/commonservice-system"  //这里是本地的请求url
        baseUrl = "/api"  //这里是本地的请求url
        break
    case 'test':   // 注意这里的名字要和步骤二中设置的环境名字对应起来
        // baseUrl = "http://39.107.89.154:8000/commonservice-system"  //这里是测试环境中的url
        baseUrl = ""
        break
    case 'production':
        baseUrl = "http://39.107.89.154:8000/commonservice-system"   //生产环境url
        break
}

export default baseUrl;