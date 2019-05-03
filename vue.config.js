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
            '/test': {
                // target: 'http://192.168.0.106:8085',
                target: 'http://39.107.89.154:8000/commonservice-system',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                  '^/test': ''
                }
            }
        },
        before: app => { }
    },
}