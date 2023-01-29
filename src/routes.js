const { Router } = require('express');
const obsController = require('./observations/observations.controller');

const router = Router();
router.get("/", (req, res) => {
    res.send("Welcome to the Covid Observations API!");
});

router.get('/data', obsController.getAllData);
router.get('/loadCSV', obsController.loadCSV);
router.get('/top/confirmed', obsController.topConfirmed);
router.post('/create/', obsController.create);
router.put('/update/:id', obsController.update);
router.delete('/delete/:id', obsController.remove);

module.exports = router;