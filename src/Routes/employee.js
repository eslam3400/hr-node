const router = require('express').Router();

router.get('/', (req, res) => res.send('Employee home page'))

module.exports = router