
module.exports = {
    devServer: {
        proxy: {
            '/api': {
                // target: 'http://impc.aoqikc.com:8000/commonservice-system',
                // target: 'http://192.168.0.112:8082/system/',
                // target: 'http://192.168.0.112:8082/',
                target: 'http://impc.aoqikc.com:8000/',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
            '/catch': {
                // target: 'http://192.168.0.112:8085',
                target: 'http://192.168.0.112:8082/hardware/',
                // target: 'http://impc.aoqikc.com:8000',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/catch': ''
                }
            },
            '/test': {
                // target: 'http://192.168.0.111:8085',
                // target: 'http://impc.aoqikc.com:8000',
                target: 'http://192.168.0.112:8082/hardware/',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                  '^/test': ''
                }
            },
            '/mode': {
                // target: 'http://192.168.0.111:8084',
                target: 'http://192.168.0.112:8082/operation/',
                // target: 'http://impc.aoqikc.com:8000',
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