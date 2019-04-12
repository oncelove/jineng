module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://192.168.0.112:8080/commonservice-system',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                  '^/api': ''
                }
            }
        },
        before: app => { }
    },
}