const kategoriHalaman = document.body.dataset.category || 'makanan';
const subkategoriMinuman = ['coffee', 'non coffee', 'tea'];

// Ambil data dari Supabase
async function fetchData(category, subcategory = null) {
    let query = supabaseClient.from('produk').select('*').eq('kategori', category);
    if (subcategory) query = query.eq('sub_kategori', subcategory);
    const { data, error } = await query;
    if (error) {
        console.error('Supabase fetch error:', error);
        return [];
    }
    return data;
}

// Buat card HTML
function createCard(item) {
    return `
    <div class="col mb-3">
        <div class="card h-100" onclick="showDetail(
            '${encodeURIComponent(item.nama)}',
            '${encodeURIComponent(item.deskripsi || '')}',
            '${item.harga}',
            '${item.gambar}'
        )">
            ${item.favorit ? '<div class="favorite-star">★</div>' : ''}
            <img src="${item.gambar}" class="card-img-top" alt="${item.nama}">
            <div class="card-body">
                <h5 class="card-title text-center">${item.nama}</h5>
                <p class="card-text">${item.deskripsi || ''}</p>
                <p class="fw-bold text-center">Rp ${Number(item.harga).toLocaleString('id-ID')}</p>
            </div>
        </div>
    </div>
    `;
}

// Modal
function showDetail(nama, deskripsi, harga, gambar) {
    document.getElementById('modalTitle').innerText = decodeURIComponent(nama);
    document.getElementById('modalDescription').innerText = decodeURIComponent(deskripsi);
    document.getElementById('modalPrice').innerText = 'Rp ' + Number(harga).toLocaleString('id-ID');
    document.getElementById('modalImage').src = gambar;
    document.getElementById('modalImage').alt = decodeURIComponent(nama);
    const modal = new bootstrap.Modal(document.getElementById('detailModal'));
    modal.show();
}

// Render kategori tanpa subkategori: makanan, mie, cemilan
async function renderKategoriTanpaSub(category, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const data = await fetchData(category);
    if (!data || data.length === 0) {
        container.innerHTML = '<p class="text-center">Belum ada produk di kategori ini.</p>';
        return;
    }
    container.innerHTML = data.map(item => createCard(item)).join('');
}

// Render minuman per subkategori
async function renderMinumanSections() {
    for (let sub of subkategoriMinuman) {
        const containerId = sub.replace(' ', '').toLowerCase() + '-container';
        const container = document.getElementById(containerId);
        if (!container) continue;

        const data = await fetchData('minuman', sub);
        container.innerHTML = !data || data.length === 0
            ? '<p class="text-center">Belum ada produk di subkategori ini.</p>'
            : data.map(item => createCard(item)).join('');
    }
}

// Jalankan render sesuai halaman
document.addEventListener('DOMContentLoaded', () => {
    switch(kategoriHalaman) {
        case 'makanan':
        case 'mie':
        case 'cemilan':
            // render semua section di halaman yang sama
            renderKategoriTanpaSub('makanan', 'makanan-container');
            renderKategoriTanpaSub('mie', 'mie-container');
            renderKategoriTanpaSub('cemilan', 'cemilan-container');
            break;
        case 'minuman':
            renderMinumanSections();
            break;
    }
});
