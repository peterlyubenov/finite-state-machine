const express = require('express');
const app = express();

const stateMachine = require('./binaryStateMachine');
stateMachine.init();

app.use(express.static('static'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.get('/api/evaluate/:word', (req, res) => {
    res.send(stateMachine.run(req.params.word));
});

app.listen(8001, () => {
    console.log('Listening on :8001');
});