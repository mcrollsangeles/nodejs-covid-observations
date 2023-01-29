const express = require('express');
const observationRoutes = require('./src/routes');

const app = express();
const port = 3044;

app.use(express.json());

app.use('/observations', observationRoutes);
app.get('*', (req, res) => {
    res.send('API Not Found', 404);
});
app.post('*', (req, res) => {
    res.send('API Not Found', 404);
});
app.put('*', (req, res) => {
    res.send('API Not Found', 404);
});
app.delete('*', (req, res) => {
    res.send('API Not Found', 404);
});

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
})