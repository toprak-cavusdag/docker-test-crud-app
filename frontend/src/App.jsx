// src/App.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast'; // Kütüphaneyi dahil ettik

// Backend URL'ini buraya sabitliyoruz
const API_URL = '/api/stocks';

function App() {
  const [stocks, setStocks] = useState([]);
  const [formData, setFormData] = useState({ name: '', quantity: '' });
  const [editingId, setEditingId] = useState(null);

  // 1. READ: Verileri getir
  const fetchStocks = async () => {
    try {
      const response = await axios.get(API_URL);
      setStocks(response.data);
    } catch (error) {
      console.error('Veri çekme hatası:', error);
      toast.error('Veriler sunucudan alınamadı.'); // Hata bildirimi
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  // 2. CREATE & UPDATE: Form Gönderimi
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Yükleniyor bildirimi başlatılabilir (opsiyonel, işlem hızlıysa gerek yok)
    const loadingToast = toast.loading('İşlem yapılıyor...');

    try {
      if (editingId) {
        // Güncelleme işlemi (PUT)
        await axios.put(`${API_URL}/${editingId}`, formData);
        toast.success('Stok başarıyla güncellendi!', { id: loadingToast }); // Başarılı bildirimi
      } else {
        // Yeni kayıt (POST)
        await axios.post(API_URL, formData);
        toast.success('Yeni ürün stoğa eklendi!', { id: loadingToast }); // Başarılı bildirimi
      }
      
      // Formu sıfırla ve listeyi güncelle
      setFormData({ name: '', quantity: '' });
      setEditingId(null);
      fetchStocks();
    } catch (error) {
      console.error('Kayıt hatası:', error);
      toast.error('İşlem sırasında bir hata oluştu.', { id: loadingToast }); // Hata bildirimi
    }
  };

  // 3. DELETE: Kayıt Silme
  const handleDelete = async (id) => {
    if (window.confirm('Bu stoğu silmek istediğinize emin misiniz?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        toast.success('Ürün stoklardan silindi.'); // Silme başarılı bildirimi
        fetchStocks();
      } catch (error) {
        console.error('Silme hatası:', error);
        toast.error('Silme işlemi başarısız oldu.'); // Silme hatası bildirimi
      }
    }
  };

  // Düzenleme modunu aktifleştirme
  const startEditing = (stock) => {
    setFormData({ name: stock.name, quantity: stock.quantity });
    setEditingId(stock._id);
  };

  // Düzenleme modundan çıkma
  const cancelEditing = () => {
    setFormData({ name: '', quantity: '' });
    setEditingId(null);
  };

  return (
    <div className="container mt-5">
      {/* Toaster bileşenini ekliyoruz. Ekranın sağ üst köşesinde çıkacak. */}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="row justify-content-center">
        <div className="col-md-8">
          
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>📦 Stok Takip Sistemi</h2>
            <span className="badge bg-secondary">Toplam Çeşit: {stocks.length}</span>
          </div>
          
          {/* FORM ALANI */}
          <div className="card shadow-sm mb-4 border-0 bg-light">
            <div className="card-body">
              <form onSubmit={handleSubmit} className="row g-3">
                <div className="col-md-5">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Ürün Adı (örn: Monitör)" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    required 
                  />
                </div>
                <div className="col-md-3">
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="Adet" 
                    min="0"
                    value={formData.quantity} 
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})} 
                    required 
                  />
                </div>
                <div className="col-md-4 d-flex gap-2">
                  <button type="submit" className={`btn w-100 ${editingId ? 'btn-success' : 'btn-primary'}`}>
                    {editingId ? 'Güncelle' : 'Ekle'}
                  </button>
                  {editingId && (
                    <button type="button" onClick={cancelEditing} className="btn btn-outline-danger w-100">
                      İptal
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* TABLO ALANI */}
          <div className="card shadow-sm border-0">
            <table className="table table-hover mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Ürün Adı</th>
                  <th>Stok Durumu</th>
                  <th className="text-end">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {stocks.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-muted">Henüz stok eklenmemiş.</td>
                  </tr>
                ) : (
                  stocks.map(stock => (
                    <tr key={stock._id}>
                      <td className="align-middle fw-medium">{stock.name}</td>
                      <td className="align-middle">
                        <span className={`badge ${stock.quantity < 10 ? 'bg-danger' : 'bg-success'}`}>
                          {stock.quantity} Adet
                        </span>
                      </td>
                      <td className="text-end">
                        <button 
                          onClick={() => startEditing(stock)} 
                          className="btn btn-sm btn-outline-primary me-2"
                        >
                          Düzenle
                        </button>
                        <button 
                          onClick={() => handleDelete(stock._id)} 
                          className="btn btn-sm btn-outline-danger"
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default App;