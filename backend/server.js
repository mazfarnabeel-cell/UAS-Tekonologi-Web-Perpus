const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 3000;

// =======================
// Middleware
// =======================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../publik")));

// =======================
// Database
// =======================

const db = new sqlite3.Database(
    path.join(__dirname, "../database/perpustakaan.db"),
    (err) => {

        if (err) {
            console.log(err.message);
        } else {
            console.log("Database berhasil terkoneksi");
        }

    }
);

// =======================
// Membuat tabel otomatis
// =======================

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS buku(

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            judul TEXT NOT NULL,

            penulis TEXT NOT NULL,

            penerbit TEXT NOT NULL,

            tahun_terbit INTEGER NOT NULL,

            stok INTEGER NOT NULL

        )
    `);

});

// =======================
// GET Semua Buku
// =======================

app.get("/api/buku", (req, res) => {

    db.all("SELECT * FROM buku ORDER BY id DESC", [], (err, rows) => {

        if (err) {

            return res.status(500).json(err);

        }

        res.json(rows);

    });

});

// =======================
// POST Tambah Buku
// =======================

app.post("/api/buku", (req, res) => {

    const {

        judul,
        penulis,
        penerbit,
        tahun_terbit,
        stok

    } = req.body;

    db.run(

        `INSERT INTO buku
        (judul,penulis,penerbit,tahun_terbit,stok)
        VALUES(?,?,?,?,?)`,

        [

            judul,
            penulis,
            penerbit,
            tahun_terbit,
            stok

        ],

        function(err){

            if(err){

                return res.status(500).json(err);

            }

            res.json({

                success:true,
                id:this.lastID

            });

        }

    );

});

// =======================
// PUT Edit Buku
// =======================

app.put("/api/buku/:id", (req, res) => {

    const {

        judul,
        penulis,
        penerbit,
        tahun_terbit,
        stok

    } = req.body;

    db.run(

        `UPDATE buku
        SET

        judul=?,
        penulis=?,
        penerbit=?,
        tahun_terbit=?,
        stok=?

        WHERE id=?`,

        [

            judul,
            penulis,
            penerbit,
            tahun_terbit,
            stok,
            req.params.id

        ],

        function(err){

            if(err){

                return res.status(500).json(err);

            }

            res.json({

                success:true

            });

        }

    );

});

// =======================
// DELETE Buku
// =======================

app.delete("/api/buku/:id", (req, res) => {

    db.run(

        "DELETE FROM buku WHERE id=?",

        [req.params.id],

        function(err){

            if(err){

                return res.status(500).json(err);

            }

            res.json({

                success:true

            });

        }

    );

});

// =======================
// Halaman Utama
// =======================

app.get("/", (req,res)=>{

    res.sendFile(path.join(__dirname,"../publik/index.html"));

});

// =======================
// Jalankan Server
// =======================

app.listen(PORT,()=>{

    console.log(`Server berjalan di http://localhost:${PORT}`);

});