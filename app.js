const inputCatatan = document.getElementById("input-catatan");
const btnTambah = document.getElementById("btn-tambah");
const daftarCatatan = document.getElementById("daftar-catatan");

const STORAGE_KEY = "catatan_saku_items_v1";
let items = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

function simpanDanRender() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  render();
}

function render() {
  daftarCatatan.innerHTML = "";
  items.forEach((teks, index) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = teks;

    const btnHapus = document.createElement("button");
    btnHapus.textContent = "Hapus";
    btnHapus.className = "hapus";
    btnHapus.addEventListener("click", () => {
      items.splice(index, 1);
      simpanDanRender();
    });

    li.appendChild(span);
    li.appendChild(btnHapus);
    daftarCatatan.appendChild(li);
  });
}

function tambahCatatan() {
  const teks = inputCatatan.value.trim();
  if (!teks) return;
  items.push(teks);
  inputCatatan.value = "";
  simpanDanRender();
}

btnTambah.addEventListener("click", tambahCatatan);
inputCatatan.addEventListener("keydown", (e) => {
  if (e.key === "Enter") tambahCatatan();
});

render();
