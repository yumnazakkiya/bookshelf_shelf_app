// ============================
// Ambil elemen dari HTML (pastikan ID cocok dengan HTML kamu!)
// ============================
const bookForm = document.getElementById("bookForm"); // <form id="bookForm">
const incompleteShelf = document.getElementById("incompleteBookshelfList");
const completeShelf = document.getElementById("completeBookshelfList");

// ============================
// Data awal buku disimpan di array
// ============================
let books = [];

// ============================
// Fungsi: Tambah Buku Baru
// ============================
function addBook(event) {
  event.preventDefault();

  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = document.getElementById("bookFormYear").value;
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const newBook = {
    id: Date.now(),
    title: title,
    author: author,
    year: year,
    isComplete: isComplete,
  };

  books.push(newBook);
  saveBooks();
  renderBooks();
  bookForm.reset();
}

// ============================
// Fungsi: Simpan ke localStorage
// ============================
function saveBooks() {
  localStorage.setItem("books", JSON.stringify(books));
}

// ============================
// Fungsi: Load dari localStorage
// ============================
function loadBooks() {
  const storedBooks = localStorage.getItem("books");
  if (storedBooks) {
    books = JSON.parse(storedBooks);
  }
  renderBooks();
}

// ============================
// Fungsi: Render Semua Buku
// ============================
function renderBooks() {
  incompleteShelf.innerHTML = "";
  completeShelf.innerHTML = "";

  if (books.length === 0) {
    incompleteShelf.innerHTML = "<p>Belum ada buku di rak.</p>";
    completeShelf.innerHTML = "<p>Belum ada buku di rak.</p>";
    return;
  }

  books.forEach((book) => {
    const bookElement = document.createElement("div");
    bookElement.classList.add("book-item");
    bookElement.setAttribute("data-bookid", book.id);

    bookElement.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      <div>
        <button data-testid="bookItemIsCompleteButton">
          ${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}
        </button>
        <button data-testid="bookItemDeleteButton">Hapus</button>
        <button data-testid="bookItemEditButton">Edit</button>
      </div>
    `;

    // Tombol pindah rak
    bookElement
      .querySelector('[data-testid="bookItemIsCompleteButton"]')
      .addEventListener("click", () => toggleBookStatus(book.id));

    // Tombol hapus
    bookElement
      .querySelector('[data-testid="bookItemDeleteButton"]')
      .addEventListener("click", () => deleteBook(book.id));

    // Tombol edit
    bookElement
      .querySelector('[data-testid="bookItemEditButton"]')
      .addEventListener("click", () => editBook(book.id));

    if (book.isComplete) {
      completeShelf.appendChild(bookElement);
    } else {
      incompleteShelf.appendChild(bookElement);
    }
  });
}

// ============================
// Fungsi: Pindah Rak Buku
// ============================
function toggleBookStatus(id) {
  const book = books.find((b) => b.id === id);
  if (book) {
    book.isComplete = !book.isComplete;
    saveBooks();
    renderBooks();
  }
}

// ============================
// Fungsi: Hapus Buku
// ============================
function deleteBook(id) {
  books = books.filter((b) => b.id !== id);
  saveBooks();
  renderBooks();
}

// ============================
// Fungsi: Edit Buku
// ============================
function editBook(id) {
  const book = books.find((b) => b.id === id);
  if (!book) return;

  const newTitle = prompt("Judul baru:", book.title);
  const newAuthor = prompt("Penulis baru:", book.author);
  const newYear = prompt("Tahun baru:", book.year);

  if (newTitle && newAuthor && newYear) {
    book.title = newTitle;
    book.author = newAuthor;
    book.year = newYear;
    saveBooks();
    renderBooks();
  }
}

// ============================
// Event Listener
// ============================
bookForm.addEventListener("submit", addBook);

// ============================
// Fungsi: Pencarian Buku
// ============================
function searchBooks(event) {
  event.preventDefault();
  const query = document
    .getElementById("searchBookTitle")
    .value.toLowerCase()
    .trim();

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(query)
  );

  // Render hasil pencarian
  renderFilteredBooks(filteredBooks);
}

function renderFilteredBooks(filteredBooks) {
  incompleteShelf.innerHTML = "";
  completeShelf.innerHTML = "";

  if (filteredBooks.length === 0) {
    incompleteShelf.innerHTML = "<p>Tidak ada buku ditemukan.</p>";
    completeShelf.innerHTML = "<p>Tidak ada buku ditemukan.</p>";
    return;
  }

  filteredBooks.forEach((book) => {
    const bookElement = document.createElement("div");
    bookElement.classList.add("book-item");
    bookElement.setAttribute("data-bookid", book.id);

    bookElement.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      <div>
        <button data-testid="bookItemIsCompleteButton">
          ${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}
        </button>
        <button data-testid="bookItemDeleteButton">Hapus</button>
        <button data-testid="bookItemEditButton">Edit</button>
      </div>
    `;

    // Event listener tombol (supaya tetap berfungsi)
    bookElement
      .querySelector('[data-testid="bookItemIsCompleteButton"]')
      .addEventListener("click", () => toggleBookStatus(book.id));

    bookElement
      .querySelector('[data-testid="bookItemDeleteButton"]')
      .addEventListener("click", () => deleteBook(book.id));

    bookElement
      .querySelector('[data-testid="bookItemEditButton"]')
      .addEventListener("click", () => editBook(book.id));

    if (book.isComplete) {
      completeShelf.appendChild(bookElement);
    } else {
      incompleteShelf.appendChild(bookElement);
    }
  });
}

// Tambahkan event listener untuk form pencarian
const searchForm = document.getElementById("searchBook");
searchForm.addEventListener("submit", searchBooks);

// Jalankan fungsi loadBooks() saat halaman dibuka
document.addEventListener("DOMContentLoaded", loadBooks);
