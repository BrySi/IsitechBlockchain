const express = require('express')
const Blockchain = require('./Blockchain')
const socketListener = require('./socketListener')

const PORT = 3001

const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const client = require('socket.io-client')
const cFetch = require('cross-fetch')

app.use(express.json())

const bryanChain = new Blockchain(io)

app.get('/blocks', (req, res) => {
    res.json(bryanChain.blockchain)
})

app.post('/mine', (req, res) => {
    const {sender, receiver, qty} = req.body
    io.emit('mine', sender, receiver, qty)
    res.redirect('/blocks')
})

app.post('/nodes', (req, res) => {
    const {host, port} = req.body
    const {callback} = req.query
    const node = `http://${host}:${port}`
    const socketNode = socketListener(client(node), bryanChain)
    bryanChain.addNewNode(socketNode)

    if(callback === 'true') {
        console.info(`Node ${node} added via callback`)
        res.json({status: 'Added node', node: node, callback: true})
    } else {
        cFetch.fetch(`${node}/nodes?callback=true`, {
            method: 'POST',
            headers: {
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body: JSON.stringify({host: req.hostname, port: PORT})
        })
        console.info(`Node ${node} added via callback`)
        res.json({status: 'Added node', node: node, callback: false})
    }
})

app.get('/nodes', (req, res) => {
    res.json({count:bryanChain.nodes.length})
    console.log(bryanChain.nodes)
})

io.on('connection', (socket) => {
    console.info(`Socket connected ${socket.id}`)
    socket.on('disconnect', () => {
        console.info(`Socket disconnected ${socket.id}`)
    })
})

bryanChain.addNewNode(socketListener(client`http://localhost:${PORT}`, bryanChain))

http.listen(PORT, () => {
    console.log('Listening on port ', PORT)
})