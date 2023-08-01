const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { MongoClient, ObjectId } = require("mongodb");
const https = require("https");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3000;
const mongoUrl = "mongodb://localhost:27017"; // Điều chỉnh URL của MongoDB tại đây
const dbName = "mydatabase"; // Điều chỉnh tên cơ sở dữ liệu tại đây
const secretKey = "yourSecretKey"; // Điều chỉnh khóa bí mật của bạn tại đây

app.use(bodyParser.json());

// Đăng ký tài khoản mới
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    try {
        const client = await MongoClient.connect(mongoUrl);
        const db = client.db(dbName);
        const users = db.collection("users");

        const existingUser = await users.findOne({ username });

        if (existingUser) {
            return res.status(409).json({ message: "Username already exists" });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await users.insertOne({ username, password: hashedPassword });

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Đăng nhập và trả về token JWT
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const client = await MongoClient.connect(mongoUrl);
        const db = client.db(dbName);
        const users = db.collection("users");

        const user = await users.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { _id: user._id, username: user.username },
            secretKey
        );

        res.status(200).json({ token });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Route bảo vệ - sử dụng token để xác thực
app.get("/protected", authenticateToken, (req, res) => {
    res.json({ message: "This is a protected route" });
});

// Middleware để xác thực token
function authenticateToken(req, res, next) {
    const token = req.headers["authorization"];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }
        req.user = user;
        next();
    });
}

// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });

// Đường dẫn đến chứng chỉ SSL
const privateKey = fs.readFileSync("./sslcert/key.pem", "utf8");
const certificate = fs.readFileSync("./sslcert/cert.pem", "utf8");
const credentials = { key: privateKey, cert: certificate };

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
    console.log(`Server is running on https://localhost:${port}`);
});
