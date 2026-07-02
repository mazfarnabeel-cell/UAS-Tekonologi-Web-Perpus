let editId = null;

// Saat halaman dibuka
document.addEventListener("DOMContentLoaded", () => {
    tampilkanData();
});

// Form Simpan / Edit
document.getElementById("formBuku").addEventListener("submit", async function (e) {
    e.preventDefault();

    const data = {
        judul: document.getElementById("judul").value,
        penulis: document.getElementById("penulis").value,
        penerbit: document.getElementById("penerbit").value,
        tahun_terbit: document.getElementById("tahun").value,
        stok: document.getElementById("stok").value
    };

    let url = "/api/buku";
    let method = "POST";

    if (editId !== null) {
        url = `/api/buku/${editId}`;
        method = "PUT";
    }

    try {

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error("Gagal menyimpan data");
        }

        alert(editId === null ? "Data berhasil ditambahkan" : "Data berhasil diubah");

        document.getElementById("formBuku").reset();

        editId = null;

        tampilkanData();

    } catch (err) {

        console.error(err);
        alert("Terjadi kesalahan.");

    }

});

// =======================
// Menampilkan Data
// =======================

async function tampilkanData() {

    try {

        const response = await fetch("/api/buku");

        const data = await response.json();

        const tbody = document.getElementById("dataBuku");

        tbody.innerHTML = "";

        if (data.length === 0) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="7">Belum ada data</td>
                </tr>
            `;

            return;
        }

        data.forEach((buku, index) => {

            tbody.innerHTML += `
                <tr>

                    <td>${index + 1}</td>

                    <td>${buku.judul}</td>

                    <td>${buku.penulis}</td>

                    <td>${buku.penerbit}</td>

                    <td>${buku.tahun_terbit}</td>

                    <td>${buku.stok}</td>

                    <td>

                        <button onclick="editData(${buku.id})">
                            Edit
                        </button>

                        <button onclick="hapusData(${buku.id})">
                            Hapus
                        </button>

                    </td>

                </tr>
            `;

        });

    } catch (err) {

        console.log(err);

    }

}

// =======================
// Edit
// =======================

async function editData(id) {

    try {

        const response = await fetch("/api/buku");

        const data = await response.json();

        const buku = data.find(item => item.id == id);

        if (!buku) return;

        document.getElementById("judul").value = buku.judul;
        document.getElementById("penulis").value = buku.penulis;
        document.getElementById("penerbit").value = buku.penerbit;
        document.getElementById("tahun").value = buku.tahun_terbit;
        document.getElementById("stok").value = buku.stok;

        editId = id;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (err) {

        console.log(err);

    }

}

// =======================
// Hapus
// =======================

async function hapusData(id) {

    const yakin = confirm("Yakin ingin menghapus data ini?");

    if (!yakin) return;

    try {

        await fetch(`/api/buku/${id}`, {

            method: "DELETE"

        });

        tampilkanData();

    } catch (err) {

        console.log(err);

    }

}
