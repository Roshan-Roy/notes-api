const express = require("express")
const router = express.Router()
const {
    getAllNotes,
    getNote,
    createNote,
    updateNote,
    deleteNote,
    starNote,
    unstarNote
} = require("../controllers/notes")

router.route("/").get(getAllNotes).post(createNote)
router.route("/:id").get(getNote).patch(updateNote).delete(deleteNote)
router.route("/star/:id").patch(starNote)
router.route("/unstar/:id").patch(unstarNote)

module.exports = router