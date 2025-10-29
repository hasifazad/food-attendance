const { db } = require("../models/db");
const jwt = require("jsonwebtoken");



module.exports = {

    signupUser: async (req, res) => {
        try {
            const { name, email, password } = req.body;
            if (!name || !email || !password) return res.status(400).json({ message: "Missing fields" });
            const existing = await getAsync("SELECT id FROM admins WHERE email = ?", [email]);
            if (existing) return res.status(400).json({ message: "Email already registered" });

            const hashed = await bcrypt.hash(password, 10);
            const tenant_code = uuidv4().split("-")[0].toUpperCase(); // short code
            await runAsync("INSERT INTO admins (name, email, password, tenant_code) VALUES (?,?,?,?)", [name, email, hashed, tenant_code]);
            return res.json({ message: "Admin registered", tenant_code });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error" });
        }
    },

    loginUser: (req, res) => {
        const { mobile, password } = req.body;
        console.log(req.body);


        if (!mobile || !password) {
            return res.status(400).json({ error: "Mobile and password are required" });
        }

        const query = `SELECT id, name, email, mobile FROM users WHERE mobile = ?`;

        db.get(query, [mobile], (err, user) => {
            if (err) {
                console.error("Login error:", err);
                return res.status(500).json({ error: "Internal server error" });
            }

            if (!user) {
                return res.status(401).json({ error: "Invalid mobile or password" });
            }

            res.json({
                message: "Login successful",
                user,
            });
        });
    },

    addOrUpdateFoodStatus: (req, res) => {
        const { user_id, date, breakfast, lunch, dinner } = req.body;

        if (!user_id || !date) {
            return res.status(400).json({ error: "User ID and date are required" });
        }

        // Check if a record already exists for the user on the given date
        db.get(
            "SELECT id FROM food_status WHERE user_id = ? AND date = ?",
            [user_id, date],
            (err, row) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).json({ error: "Database error" });
                }

                if (row) {
                    // Update existing record
                    db.run(
                        `
          UPDATE food_status 
          SET breakfast = ?, lunch = ?, dinner = ?, updated_at = CURRENT_TIMESTAMP
          WHERE user_id = ? AND date = ?
          `,
                        [breakfast ? 1 : 0, lunch ? 1 : 0, dinner ? 1 : 0, user_id, date],
                        function (err) {
                            if (err) return res.status(500).json({ error: "Failed to update food status" });

                            res.json({
                                message: "Food status updated successfully",
                                user_id,
                                date,
                                breakfast,
                                lunch,
                                dinner,
                            });
                        }
                    );
                } else {
                    // Insert new record
                    db.run(
                        `
          INSERT INTO food_status (user_id, date, breakfast, lunch, dinner)
          VALUES (?, ?, ?, ?, ?)
          `,
                        [user_id, date, breakfast ? 1 : 0, lunch ? 1 : 0, dinner ? 1 : 0],
                        function (err) {
                            if (err) return res.status(500).json({ error: "Failed to add food status" });

                            res.status(201).json({
                                message: "Food status added successfully",
                                user_id,
                                date,
                                breakfast,
                                lunch,
                                dinner,
                            });
                        }
                    );
                }
            }
        );
    },

    // Fetch food status for a user on a specific date
    getFoodStatusByUserAndDate: (req, res) => {
        const { user_id, date } = req.query;

        if (!user_id || !date) {
            return res.status(400).json({ error: "user_id and date are required" });
        }

        const query = `
    SELECT breakfast, lunch, dinner
    FROM food_status
    WHERE user_id = ? AND date = ?
    LIMIT 1
  `;

        db.get(query, [user_id, date], (err, row) => {
            if (err) return res.status(500).json({ error: "Database error" });

            // If no record found, return default (all false)
            if (!row) {
                return res.json({
                    breakfast: false,
                    lunch: false,
                    dinner: false,
                });
            }

            res.json(row);
        });
    }
}




