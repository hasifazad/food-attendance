const { db } = require("../models/db");
const jwt = require("jsonwebtoken");


const bcrypt = require("bcrypt")

const JWT_SECRET = process.env.JWT_SECRET



module.exports = {

    signupAdmin: async (req, res) => {
        console.log(req.body);

        const { email, mobile, password } = req.body;

        if (!email || !mobile || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        try {
            // Check if admin already exists
            db.get(
                "SELECT * FROM admins WHERE email = ? OR mobile = ?",
                [email, mobile],
                async (err, row) => {
                    if (err) return res.status(500).json({ error: "Database error" });
                    if (row) return res.status(400).json({ error: "Admin already exists" });

                    // Hash password before saving
                    const hashedPassword = await bcrypt.hash(password, 10);

                    db.run(
                        `INSERT INTO admins (email, mobile, password) VALUES (?, ?, ?)`,
                        [email, mobile, hashedPassword],
                        function (err) {
                            if (err) return res.status(500).json({ error: "Failed to register" });
                            res.status(201).json({
                                message: "Admin registered successfully",
                                adminId: this.lastID,
                            });
                        }
                    );
                }
            );
        } catch (error) {
            console.log(error);

            res.status(500).json({ error: "Something went wrong" });
        }
    },

    loginAdmin: async (req, res) => {
        const { mobile, password } = req.body;

        if (!mobile || !password) {
            return res.status(400).json({ error: "Mobile and password are required" });
        }

        try {
            db.get("SELECT * FROM admins WHERE mobile = ?", [mobile], async (err, user) => {
                if (err) return res.status(500).json({ error: "Database error" });
                if (!user) return res.status(400).json({ error: "Invalid mobile or password" });

                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch)
                    return res.status(400).json({ error: "Invalid mobile or password" });

                // ✅ Generate JWT token
                const token = jwt.sign(
                    { id: user.id, email: user.email, mobile: user.mobile },
                    JWT_SECRET,
                    { expiresIn: "1d" }
                );

                res.json({
                    message: "Login successful",
                    token,
                    admin: {
                        id: user.id,
                        email: user.email,
                        mobile: user.mobile,
                    },
                });
            });
        } catch (error) {
            console.log(error);

            res.status(500).json({ error: "Something went wrong" });
        }
    },



    addUser: function addUser(req, res) {
        const { name, mobile, adminId: admin_id } = req.body;

        console.log(req.body);


        if (!name || !mobile || !admin_id) {
            return res.status(400).json({ error: "Name, mobile, and admin_id are required" });
        }

        // Step 1: Check if user already exists
        db.get("SELECT * FROM users WHERE mobile = ?", [mobile], (err, row) => {
            if (err) return res.status(500).json({ error: "Database error" });
            if (row) return res.status(400).json({ error: "User with this mobile already exists" });

            // Step 2: Generate random password
            const generatePassword = () => {
                const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                let pass = "";
                for (let i = 0; i < 6; i++) {
                    pass += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                return pass;
            };

            // const password = generatePassword();
            const password = '123456';

            // Step 3: Insert user
            const query = `INSERT INTO users (name, mobile, password, admin_id) VALUES (?, ?, ?, ?)`;

            db.run(query, [name, mobile, password, admin_id], function (err) {
                if (err) {
                    console.error("Insert error:", err);
                    return res.status(500).json({ error: "Failed to add user" });
                }

                res.status(201).json({
                    message: "User added successfully",
                    user: {
                        id: this.lastID,
                        name,
                        mobile,
                        password, // you may hide this in production
                        admin_id,
                    },
                });
            });
        });
    },

    getAllUsersWithAdminId: (req, res) => {
        console.log(req.query);
        
        const { admin_id, date } = req.query;
        const query = `
        SELECT 
            users.id,
            users.name,
            users.mobile,
            users.room_no,
            users.created_at,
            food_status.breakfast,
            food_status.lunch,
            food_status.dinner
        FROM users
        LEFT JOIN food_status 
        ON users.id = food_status.user_id 
        AND food_status.date = ?
        WHERE users.admin_id = ?
        ORDER BY users.id DESC
        `;

        db.all(query, [date, admin_id], (err, rows) => {
            if (err) return res.status(500).json({ error: "Failed to fetch users" });

            res.json({
                message: "Users fetched successfully",
                users: rows,
            });
        });
    }
}




