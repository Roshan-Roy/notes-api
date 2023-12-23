const { StatusCodes } = require("http-status-codes")
const { NotFoundError } = require("../errors")
const Note = require("../model/Note")

//get all notes
const getAllNotes = async (req, res) => {
    const userid = req.userid
    const queryObj = {}
    const { search, sort } = req.query
    if (search) {
        queryObj.title = { $regex: search, $options: "i" }
    }
    let allNotes = Note.find({ ...queryObj, createdBy: userid })
    if (sort) {
        const sortStr = sort.split(",").join(" ")
        allNotes = allNotes.sort(sortStr)
    }
    const page = Number(req.query.page)
    const limit = Number(req.query.limit)
    if (limit && limit > 0) {
        allNotes = allNotes.limit(limit)
        if (page && page > 0) {
            const skip = (page - 1) * limit
            allNotes = allNotes.skip(skip)
        }
    }
    allNotes = await allNotes
    res.status(StatusCodes.OK).send({ message: "success", data: allNotes, count: allNotes.length })
}

//get a note
const getNote = async (req, res) => {
    const userid = req.userid
    const { id } = req.params
    const note = await Note.findOne({
        _id: id,
        createdBy: userid
    })
    if (!note) {
        throw new NotFoundError(`no note found with id ${id}`)
    }
    res.status(StatusCodes.OK).json({ message: "success", data: note })
}

//create new note
const createNote = async (req, res) => {
    const userid = req.userid
    const { title, description,starred } = req.body
    const newNote = await Note.create({
        title,
        description,
        starred,
        createdBy: userid
    })
    res.status(StatusCodes.CREATED).json({ message: "note created", data: newNote })
}

//update note
const updateNote = async (req, res) => {
    const userid = req.userid
    const { id } = req.params
    const { title, description } = req.body
    const updatedNote = await Note.findOneAndUpdate({
        _id: id,
        createdBy: userid
    }, {
        title,
        description
    }, {
        new: true,
        runValidators: true
    })
    if (!updatedNote) {
        throw new NotFoundError(`no note found with id ${id}`)
    }
    res.status(StatusCodes.OK).json({ message: "note updated", data: updatedNote })
}

//delete note
const deleteNote = async (req, res) => {
    const userid = req.userid
    const { id } = req.params
    const deletedNote = await Note.findOneAndDelete({
        _id: id,
        createdBy: userid
    })
    if (!deletedNote) {
        throw new NotFoundError(`no note found with id ${id}`)
    }
    res.status(StatusCodes.OK).json({ message: "note deleted", data: deletedNote })
}

//star note
const starNote = async (req, res) => {
    const userid = req.userid
    const { id } = req.params
    const starredNote = await Note.findOneAndUpdate({
        _id: id,
        createdBy: userid
    }, {
        starred: true
    }, {
        timestamps: false,
        new: true
    })
    if (!starredNote) {
        throw new NotFoundError(`no note found with id ${id}`)
    }
    res.status(StatusCodes.OK).json({ message: "note starred", data: starredNote })

}

//unstar note
const unstarNote = async (req, res) => {
    const userid = req.userid
    const { id } = req.params
    const unstarredNote = await Note.findOneAndUpdate({
        _id: id,
        createdBy: userid
    }, {
        starred: false
    }, {
        timestamps: false,
        new: true
    })
    if (!unstarredNote) {
        throw new NotFoundError(`no note found with id ${id}`)
    }
    res.status(StatusCodes.OK).json({ message: "note unstarred", data: unstarredNote })

}

module.exports = {
    getAllNotes,
    getNote,
    createNote,
    updateNote,
    deleteNote,
    starNote,
    unstarNote
}