const router = require('express').Router();
const { validatePatchCurrentUserBody } = require('../middlewares/validation');

const { getCurrentUser, patchCurrentUser } = require('../controllers/users');

router.get('/me', getCurrentUser);
router.patch('/me', validatePatchCurrentUserBody, patchCurrentUser);

module.exports = router;
