const router = require('express').Router();
const token = require('../middlewares/token');
const { validatePassword, validateEmail } = require('../middlewares/validateParams');

router.post(
  '/', // Rota raíz
  validateEmail, // Primeiro middleware
  validatePassword, // Segundo middleware
  (_req, res) => res.status(200).json({ token }), // Terceiro middleware
);

module.exports = router;
