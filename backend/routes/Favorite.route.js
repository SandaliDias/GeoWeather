const router = require("express").Router();
const Favorite = require("../models/Favorite.model.js");

// create a favorite
router.post("/create", async (req, res) => {
  const { city, lat, lng, userId } = req.body;
  try {
    const newFavorite = new Favorite({ city, lat, lng, userId });
    await newFavorite.save();
    res.status(201).json({ message: "Favorite Created" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// get favorites by userId
router.get("/", async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "userId query parameter is required" });
  }

  try {
    const data = await Favorite.find({ userId });
    res.status(200).json({ success: true, favorites: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// delete favorite
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params; // Corrected extraction of id

  if (!id) {
    return res.status(400).json({ error: "id parameter is required" });
  }

  try {
    const data = await Favorite.deleteOne({ _id: id });
    if (data.deletedCount > 0) {
      res.status(200).json({ success: true, message: "Favorite deleted successfully" });
    } else {
      res.status(400).json({ success: false, message: "Favorite not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
