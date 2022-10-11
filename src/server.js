import {app} from './app.js'

const porta = process.env.PORT || 8877

const server = app.listen(porta, ()=>console.log(`App on-line na porta ${porta}`))

process.on('SIGINT', ()=>{//fechar de vez a porta
    server.close()
    console.log("App finalizado")
})