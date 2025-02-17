const app = require('./src/app')

const { app: { port } } = require('./src/configs/config.mongodb')

const server = app.listen(port, () => {
    console.log(`App start using port: ${port}`);
})

process.on('SIGINT', () => {
    server.close(() => {
        console.log('Exit server express');
    })
})
