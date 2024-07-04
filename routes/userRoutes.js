//const { default: SetAvatar } = require("../../public/src/pages/SetAvatar");
const {register, login, setAvatar, getAllusers} = require("../controllers/userControllers");
const router = require("express").Router();
router.post("/Register", register);
router.post("/Login", login);
router.post("/setAvatar/:id", setAvatar);
router.get('/allusers/:id', getAllusers);
module.exports = router;    