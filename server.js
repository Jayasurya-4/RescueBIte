const express = require("express");
const app = express();
const db = require('./config/db');
const foodRoutes = require("./routes/api"); 

app.use(express.json()); // Ensure request body is parsed
app.use("/api", foodRoutes);
app.get('/api/food', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM food');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.delete('/api/food/:id', (req, res) => {
    const foodId = req.params.id;
    console.log(`🛑 Deleting food item with ID: ${foodId}`); // Debugging log

    const sql = 'DELETE FROM food WHERE id = ?';
    db.query(sql, [foodId], (err, result) => {
        if (err) {
            console.error(`❌ Error deleting: ${err.message}`); // Log error
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            console.warn(`⚠️ No food item found with ID: ${foodId}`); // Log warning
            return res.status(404).json({ message: 'Food item not found' });
        }

        console.log(`✅ Food item deleted successfully`); // Success log
        res.json({ message: 'Food item deleted successfully' });
    });
});


app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
