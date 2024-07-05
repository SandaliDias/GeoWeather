const router = require("express").Router();
const Favorite = require("../models/Favorite.model.js");

//create a favorite
router.post("/create", async (req, res) => {
  const { city, lat, lng, userId } = req.body;
  try {
    const newFavorite = new Favorite({  city, lat, lng, userId });
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

module.exports = router;