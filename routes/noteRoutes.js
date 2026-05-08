
import Note from '../models/note.js';
import express from 'express';
import protect from '../middleware.js/authMiddleware.js';

const router=express.Router();



// 'create'

router.post("/create", protect, async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = await Note.create({
      title: title?.trim(),
      content: content?.trim(),
      user: req.userId,
    });

    res.status(201).json({
      success: true,
      data: note,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    const search = String(req.query.search || "").trim();
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = 5;
    const skip = (page - 1) * limit;
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const searchQuery = {
      user: req.userId,
      $or: [
        {
          title: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
        {
          content: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
      ],
    };

    const totalNotes = await Note.countDocuments(searchQuery);
    const notes = await Note.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: notes,
      currentPage: page,
      totalPages: Math.ceil(totalNotes / limit),
      totalNotes,
    });
 
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


router.put("/edit/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const updatedNote = await Note.findOneAndUpdate(
      { _id: id, user: req.userId },
      { title, content },
      { new: true, runValidators: true }
    );

    if (!updatedNote) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    res.json({
      success: true,
      message: "Note updated",
      data: updatedNote,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


router.delete('/delete/:id',protect,async(req,res)=>{
  try{
    const {id}=req.params
   const deleted_product= await Note.findOneAndDelete({_id:id,user: req.userId })
    if(!deleted_product){
       return res.status(404).json({message:"Note not found or unauthorized"})
    }
     return res.status(200).json({message:"succefully deleted", note:deleted_product})
}catch (error){
    return res.status(500).json({message:"server error"})

}
})
export default router;
