document.addEventListener("DOMContentLoaded", () => {
  /* ===============================
     SPLASH SCREEN -> LOGIN
  =============================== */
  if (window.location.pathname.endsWith("index.html") || window.location.pathname.endsWith("/")) {
    const splashDuration = 2000;

    function redirectToLogin() {
      window.location.href = "login.html";
    }

    function startFadeOut() {
      document.body.classList.add("fade-out");
    }

    setTimeout(() => {
      startFadeOut();
      setTimeout(redirectToLogin, 500);
    }, splashDuration - 500);
  }

  /* ===============================
     NAVIGASI ANTAR HALAMAN
  =============================== */
  const navigateWithFade = (targetUrl) => {
    document.body.classList.add("fade-out");
    setTimeout(() => {
      window.location.href = targetUrl;
    }, 500);
  };

  // Login -> Register
  const registerLink = document.querySelector(".login-footer a");
  if (registerLink) {
    registerLink.addEventListener("click", (e) => {
      e.preventDefault();
      navigateWithFade("register.html");
    });
  }

  // Register -> Login
  const loginLink = document.querySelector(".register-footer a");
  if (loginLink) {
    loginLink.addEventListener("click", (e) => {
      e.preventDefault();
      navigateWithFade("login.html");
    });
  }

  // Home -> List (Mulai Belanja)
  const startShoppingBtn = document.querySelector("#btn-start-shopping");
  if (startShoppingBtn) {
    startShoppingBtn.addEventListener("click", (e) => {
      e.preventDefault();
      navigateWithFade("list.html");
    });
  }

  /* ===============================
     REGISTER LOGIC
  =============================== */
  const registerForm = document.querySelector(".register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const username = registerForm.username.value.trim();
      const email = registerForm.email.value.trim();
      const password = registerForm.password.value.trim();

      let users = JSON.parse(sessionStorage.getItem("users")) || [];

      if (users.some((u) => u.email === email)) {
        alert("Email sudah terdaftar!");
        return;
      }

      users.push({ username, email, password });
      sessionStorage.setItem("users", JSON.stringify(users));

      alert("Registrasi berhasil! Silakan login.");
      navigateWithFade("login.html");
    });
  }

  /* ===============================
     LOGIN LOGIC
  =============================== */
  const loginForm = document.querySelector(".login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = loginForm.email.value.trim();
      const password = loginForm.password.value.trim();

      let users = JSON.parse(sessionStorage.getItem("users")) || [];
      const found = users.find((u) => u.email === email && u.password === password);

      if (found) {
        sessionStorage.setItem("loggedInUser", JSON.stringify(found));
        alert(`Selamat datang, ${found.username}!`);
        navigateWithFade("home.html");
      } else {
        alert("Email atau password salah!");
      }
    });
  }

 // =======================================================
    // --- LOGIKA HALAMAN PROFIL ---
    // =======================================================
    const profilePage = document.querySelector('.profile-page');
    if (profilePage) {
        const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

        if (!loggedInUser) {
            alert("Anda harus login untuk mengakses halaman ini.");
            window.location.href = "login.html";
        } else {
            // Tampilkan data user
            document.getElementById("profile-username").textContent = loggedInUser.username;
            document.getElementById("profile-email").textContent = loggedInUser.email;

            // Buat Avatar Dinamis
            const getInitials = (name) => {
                const names = name.split(' ');
                let initials = names[0].substring(0, 1).toUpperCase();
                if (names.length > 1) {
                    initials += names[names.length - 1].substring(0, 1).toUpperCase();
                }
                return initials;
            };
            const userInitials = getInitials(loggedInUser.username);
            const avatarUrl = `https://ui-avatars.com/api/?name=${userInitials}&background=6a67ce&color=fff&size=128&bold=true`;
            document.getElementById("profile-avatar").src = avatarUrl;
        }

        // --- LOGIKA LOGOUT (DARI ANDA) ---
        const logoutBtn = document.querySelector(".logout-btn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", (e) => {
                e.preventDefault();
                sessionStorage.removeItem("loggedInUser");
                alert("Anda telah berhasil logout.");
                navigateWithFade("login.html");
            });
        }
    }

  /* ===============================
     TAB FILTER LIST
  =============================== */
  const tabs = document.querySelectorAll('.tab-item');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(item => item.classList.remove('active'));
      tab.classList.add('active');
      // nanti bisa tambahkan filter logic di sini
    });
  });

  /* ===============================
     FAB ADD LIST
  =============================== */
  const fabAddList = document.getElementById("fabAddList");
  if (fabAddList) {
    fabAddList.addEventListener("click", () => {
      alert("Buat daftar baru diklik!");
      // nanti bisa ganti jadi modal input daftar belanja
    });
  }

  /* ===============================
     ADD BELANJA PAGE
  =============================== */
  const addButtons = document.querySelectorAll('.btn-add');
  addButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      navigateWithFade("tambahbelanja.html");
    });
  });
});


// Letakkan di dalam event listener DOMContentLoaded

// =======================================================
// --- LOGIKA HALAMAN DETAIL DAFTAR (list-detail.html) ---
// =======================================================
const pendingItemsContainer = document.getElementById('pendingItemsContainer');
const completedItemsContainer = document.getElementById('completedItemsContainer');
const progressCountElement = document.getElementById('progressCount');
const progressBarFill = document.getElementById('progressBarFill');
const quickAddItemInput = document.getElementById('quickAddItemInput');
const addQuickItemBtn = document.getElementById('addQuickItemBtn');

// Hanya jalankan jika elemen-elemen ini ada di halaman
if (pendingItemsContainer && completedItemsContainer) {

    // --- FUNGSI UTAMA ---
    
    // 1. Fungsi untuk memperbarui progress bar dan hitungan
    const updateProgress = () => {
        const totalItems = document.querySelectorAll('.shopping-item').length;
        const completedItems = document.querySelectorAll('.shopping-item.completed').length;

        if (progressCountElement) {
            progressCountElement.textContent = `${completedItems} / ${totalItems} Item`;
        }

        if (progressBarFill) {
            const percentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
            progressBarFill.style.width = `${percentage}%`;
            progressBarFill.classList.toggle('done', percentage === 100);
        }
    };

    // 2. Fungsi untuk menambah item baru ke daftar "Perlu dibeli"
    const addItemToList = (name, details = '') => {
        const item = document.createElement('div');
        item.className = 'shopping-item';
        item.dataset.completed = 'false';
        item.innerHTML = `
            <div class="item-checkbox"></div>
            <div class="item-content">
                <span class="item-name">${name}</span>
                <span class="item-details">${details}</span>
            </div>
            <button class="item-edit-btn"><i class="fas fa-pen"></i></button>
        `;
        pendingItemsContainer.appendChild(item);
        updateProgress();
    };

    // 3. Fungsi untuk toggle status item (selesai/belum)
    const toggleItemCompletion = (itemElement) => {
        const isCompleted = itemElement.dataset.completed === 'true';
        const checkbox = itemElement.querySelector('.item-checkbox');

        itemElement.classList.toggle('completed', !isCompleted);
        itemElement.dataset.completed = !isCompleted;

        if (!isCompleted) { // Jika baru saja selesai
            checkbox.innerHTML = '<i class="fas fa-check"></i>';
            completedItemsContainer.appendChild(itemElement);
        } else { // Jika dibatalkan
            checkbox.innerHTML = '';
            pendingItemsContainer.appendChild(itemElement);
        }
        updateProgress();
    };


    // --- EVENT LISTENERS ---

    // 1. Event listener untuk klik pada item (checkbox)
    document.querySelector('.page-main-content').addEventListener('click', (event) => {
        const itemElement = event.target.closest('.shopping-item');
        const checkboxElement = event.target.closest('.item-checkbox');
        if (itemElement && checkboxElement) {
            toggleItemCompletion(itemElement);
        }
    });

    // 2. Event listener untuk Quick Add Bar
    if (addQuickItemBtn) {
        addQuickItemBtn.addEventListener('click', () => {
            const itemName = quickAddItemInput.value.trim();
            if (itemName) {
                addItemToList(itemName);
                quickAddItemInput.value = '';
                quickAddItemInput.focus();
            }
        });
        quickAddItemInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addQuickItemBtn.click();
            }
        });
    }
    
    // --- INISIALISASI ---
    
    // Contoh data awal (Anda bisa hapus ini jika data diambil dari database)
    addItemToList('Susu UHT Full Cream', '4 Pcs - Merek Diamond');
    addItemToList('Roti Tawar', '1 Bungkus');

    // Panggil updateProgress saat halaman dimuat
    updateProgress();

    
}