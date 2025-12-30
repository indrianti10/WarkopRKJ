document.addEventListener("DOMContentLoaded", loadBestSeller);

function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID").format(Number(angka));
}

let bestSellerSwiper;

async function loadBestSeller() {
  const { data, error } = await supabaseClient
    .from("produk")
    .select("nama, deskripsi, harga, gambar");

  if (error) {
    console.error("Supabase error:", error);
    return;
  }

  const wrapper = document.getElementById("bestSellerWrapper");
  if (!wrapper) {
    console.error("bestSellerWrapper tidak ditemukan");
    return;
  }

  wrapper.innerHTML = "";

  // =============================
  // RENDER CARD
  // =============================
  data.forEach(item => {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";

    slide.innerHTML = `
      <div class="card menu-card h-100 clickable-card"
           data-nama="${item.nama}"
           data-deskripsi="${item.deskripsi}"
           data-harga="${item.harga}"
           data-gambar="${item.gambar}">

        <div class="ratio ratio-4x3">
          <img
            src="${item.gambar}"
            class="card-img-top"
            alt="${item.nama}"
            loading="lazy">
        </div>

        <div class="card-body d-flex flex-column text-center">
          <h6 class="card-title mb-1">${item.nama}</h6>
          <p class="card-text text-clamp-2">${item.deskripsi}</p>
          <div class="price mt-auto fw-semibold">
            Rp ${formatRupiah(item.harga)}
          </div>
        </div>
      </div>
    `;

    wrapper.appendChild(slide);
  });

  // =============================
  // INIT SWIPER (MARQUEE STYLE)
  // =============================
  bestSellerSwiper = new Swiper(".bestSellerSwiper", {
    loop: true,
    slidesPerView: 4,
    spaceBetween: 20,

    speed: 9000,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
    },

    freeMode: true,
    freeModeMomentum: false,
    allowTouchMove: false,

    breakpoints: {
      0:   { slidesPerView: 1 },
      576: { slidesPerView: 2 },
      768: { slidesPerView: 3 },
      992: { slidesPerView: 4 }
    }
  });

  // =============================
  // KLIK CARD → MODAL
  // =============================
  document.querySelectorAll(".clickable-card").forEach(card => {
    card.addEventListener("click", () => {
      document.getElementById("modalNama").innerText =
        card.dataset.nama;

      document.getElementById("modalDeskripsi").innerText =
        card.dataset.deskripsi;

      document.getElementById("modalHarga").innerText =
      "Rp " + formatRupiah(card.dataset.harga);

      document.getElementById("modalGambar").src =
        card.dataset.gambar;

      const modal = new bootstrap.Modal(
        document.getElementById("produkModal")
      );
      modal.show();
    });
  });

  // =============================
  // MODAL CONTROL — FIX FREEZE TOTAL
  // =============================
  const produkModalEl = document.getElementById("produkModal");

  // Pause saat modal terbuka
  produkModalEl.addEventListener("shown.bs.modal", () => {
    if (bestSellerSwiper?.autoplay) {
      bestSellerSwiper.autoplay.stop();
    }
  });

  // WAJIB: bangunkan ulang swiper saat modal ditutup
  produkModalEl.addEventListener("hidden.bs.modal", () => {
    if (!bestSellerSwiper) return;

    // 🔥 reset internal state swiper
    bestSellerSwiper.update();

    bestSellerSwiper.slideToLoop(
      bestSellerSwiper.realIndex,
      0,
      false
    );

    // 🔥 start ulang autoplay (delay kecil penting)
    setTimeout(() => {
      bestSellerSwiper.autoplay.start();
    }, 100);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const jamData = [
    {
      hari: "Selasa – Jumat",
      jam: "16.00 – 22.00 | Close Order • Clear Area 23.00"
    },
    {
      hari: "Sabtu – Minggu",
      jam: "15.00 – 23.00 | Close Order • Clear Area 24.00"
    },
    {
      hari: "Senin",
      jam: "Libur"
    }
  ];

  const list = document.getElementById("jamOperasional");

  jamData.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="hari">${item.hari}</div>
      <div class="jam">${item.jam}</div>
    `;
    list.appendChild(li);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  loadMenuFavorit("makanan");
});

// Load menu favorit sesuai kategori
async function loadMenuFavorit(kategori) {
  const { data, error } = await supabaseClient
    .from("produk")
    .select("*")
    .eq("kategori", kategori)
    .eq("favorit", true);

  if (error) {
    console.error(error);
    return;
  }

  const wrapper = document.getElementById("menuFavoritWrapper");
  wrapper.innerHTML = "";

  if (!data.length) {
    wrapper.innerHTML = `<p class="text-center w-100">Belum ada produk favorit di kategori ini.</p>`;
    return;
  }

  data.forEach(item => {
    const card = document.createElement("div");
    card.className = "menu-card";
    card.innerHTML = `
      <img src="${item.gambar}" alt="${item.nama}">
      <div class="card-body">
        <h6 class="card-title">${item.nama}</h6>
        <p class="card-text">${item.deskripsi}</p>
        <div class="price mt-auto fw-semibold">
          Rp ${formatRupiah(item.harga)}
        </div>
      </div>
    `;
    wrapper.appendChild(card);
  });
}

// Update link See More sesuai kategori
function updateSeeMoreLink(kategori) {
  const seeMoreLink = document.getElementById("seeMoreLink");
  seeMoreLink.href = `/menu/${kategori}`;
}

// Event kategori
document.querySelectorAll("#menuKategoriNav .nav-link").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#menuKategoriNav .nav-link").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const kategori = btn.dataset.kategori;
    loadMenuFavorit(kategori);
    updateSeeMoreLink(kategori);
  });
});

// Inisialisasi default
document.addEventListener("DOMContentLoaded", () => {
  loadMenuFavorit("makanan");
  updateSeeMoreLink("makanan");
});





// ============================
// NAV KATEGORI CLICK
// ============================
// document.querySelectorAll("#menuKategoriNav .nav-link")
//   .forEach(btn => {
//     btn.addEventListener("click", () => {
//       document
//         .querySelectorAll("#menuKategoriNav .nav-link")
//         .forEach(b => b.classList.remove("active"));

//       btn.classList.add("active");

//       loadMenuFavorit(btn.dataset.kategori);
//       updateSeeMoreLink(btn.dataset.kategori);
//     });
//   });

// document.addEventListener("DOMContentLoaded", () => {
//   loadMenuFavorit("makanan");
//   updateSeeMoreLink("makanan");
// });
