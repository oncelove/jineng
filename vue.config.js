module.exports = {
    devServer: {
        proxy: {
            '/api': {
                // target: 'http://39.107.89.154:8000/commonservice-system',
                target: 'http://192.168.0.112:8080/commonservice-system',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
            '/catch': {
                target: 'http://192.168.0.112:8085',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/catch': ''
                }
            },
            '/test': {
                target: 'http://192.168.0.111:8085',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                  '^/test': ''
                }
            },
            '/mode': {
                target: 'http://192.168.0.111:8084',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                  '^/mode': ''
                }
            },
        },
        before: app => { }
    },
}