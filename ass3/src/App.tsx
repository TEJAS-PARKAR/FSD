import { useMemo, useState } from 'react'
import './App.css'

type Product = {
  id: string
  name: string
  category: string
  price: number
  image: string
  description: string
}

const products: Product[] = [
  {
    id: 'p1',
    name: 'Luxe Satin Dress',
    category: 'Women',
    price: 89,
    image: 'https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=900&q=80',
    description: 'Elegant evening dress with soft satin finish and flattering silhouette.',
  },
  {
    id: 'p2',
    name: 'Tailored Blazer',
    category: 'Men',
    price: 110,
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80',
    description: 'Sharp suiting jacket for polished office or weekend styling.',
  },
  {
    id: 'p3',
    name: 'Weekend Joggers',
    category: 'Men',
    price: 54,
    image: 'https://images.unsplash.com/photo-1512436991641-6b07d6cdb172?auto=format&fit=crop&w=900&q=80',
    description: 'Comfortable joggers with modern fit and premium stretch fabric.',
  },
  {
    id: 'p4',
    name: 'Chic Crossbody Bag',
    category: 'Accessories',
    price: 42,
    image: 'https://images.unsplash.com/photo-1512436991641-7d51d31a83b2?auto=format&fit=crop&w=900&q=80',
    description: 'Compact leather bag for daily essentials with gold hardware.',
  },
  {
    id: 'p5',
    name: 'Floral Summer Top',
    category: 'Women',
    price: 36,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80',
    description: 'Bright printed top with a lightweight and breathable design.',
  },
  {
    id: 'p6',
    name: 'Statement Sneakers',
    category: 'Men',
    price: 78,
    image: 'https://images.unsplash.com/photo-1512436991641-6356b03ea923?auto=format&fit=crop&w=900&q=80',
    description: 'Bold sneakers with cushioned support for every day.',
  },
]

const categories = ['All', 'Women', 'Men', 'Accessories']

function App() {
  const [cart, setCart] = useState<Record<string, number>>({})
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [search, setSearch] = useState('')

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, search])

  const totalItems = Object.values(cart).reduce((sum, value) => sum + value, 0)
  const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = products.find((item) => item.id === id)
    return product ? sum + product.price * qty : sum
  }, 0)

  const handleAddToCart = (productId: string) => {
    setCart((currentCart) => ({
      ...currentCart,
      [productId]: (currentCart[productId] || 0) + 1,
    }))
  }

  const handleRemoveFromCart = (productId: string) => {
    setCart((currentCart) => {
      const updated = { ...currentCart }
      if (updated[productId] > 1) {
        updated[productId] -= 1
      } else {
        delete updated[productId]
      }
      return updated
    })
  }

  return (
    <div className="app-shell">
      <header className="navbar navbar-expand-lg navbar-dark bg-dark px-4 py-3">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold" href="#top">
            ModaMarket
          </a>
          <div className="d-flex align-items-center gap-3 ms-auto">
            <span className="text-muted">Fashion & Lifestyle</span>
            <button className="btn btn-outline-light btn-sm">
              Cart <span className="badge bg-warning text-dark">{totalItems}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container py-5">
        <section className="hero rounded-4 p-5 mb-5 text-white text-center position-relative overflow-hidden">
          {/* <div className="hero-overlay"></div> */}
          <div className="hero-content position-relative">
            <h1 className="display-5 fw-bold mb-3">Discover Your New Style</h1>
            <p className="lead mb-4">
              Shop premium fashion picks, trending accessories, and wardrobe essentials.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              {categories.slice(1).map((category) => (
                <button
                  key={category}
                  className="btn btn-light btn-sm text-uppercase"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="row gx-4">
          <div className="col-lg-8">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 gap-3">
              <div>
                <h2 className="mb-1">Trending Collection</h2>
                <p className="text-muted mb-0">Browse the latest looks across fashion categories.</p>
              </div>
              <div className="input-group w-100 w-sm-auto">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search" />
                </span>
                <input
                  type="search"
                  className="form-control border-start-0"
                  placeholder="Search products"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="row row-cols-1 row-cols-md-2 g-4">
              {filteredProducts.map((product) => (
                <div className="col" key={product.id}>
                  <div className="card product-card h-100 shadow-sm">
                    <img src={product.image} className="card-img-top" alt={product.name} />
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <span className="badge bg-primary text-uppercase small">{product.category}</span>
                        <span className="text-success fw-bold">${product.price}</span>
                      </div>
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text text-muted">{product.description}</p>
                      <button className="btn btn-dark mt-auto" onClick={() => handleAddToCart(product.id)}>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-12">
                  <div className="alert alert-warning text-center mb-0">
                    No products match your search. Try another keyword or category.
                  </div>
                </div>
              )}
            </div>
          </div>

          <aside className="col-lg-4">
            <div className="card bg-light shadow-sm sticky-top top-4">
              <div className="card-body">
                <h4 className="card-title mb-3">Your Cart</h4>
                {totalItems === 0 ? (
                  <p className="text-muted">Your bag is empty. Add items to see them here.</p>
                ) : (
                  <div className="list-group mb-3">
                    {Object.entries(cart).map(([productId, qty]) => {
                      const product = products.find((item) => item.id === productId)
                      return (
                        product && (
                          <div key={productId} className="list-group-item d-flex justify-content-between align-items-center py-3">
                            <div>
                              <strong>{product.name}</strong>
                              <div className="text-muted small">Qty: {qty}</div>
                            </div>
                            <div className="text-end">
                              <div className="fw-bold">${product.price * qty}</div>
                              <button className="btn btn-sm btn-outline-secondary mt-2" onClick={() => handleRemoveFromCart(productId)}>
                                Remove
                              </button>
                            </div>
                          </div>
                        )
                      )
                    })}
                  </div>
                )}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="fw-semibold">Total</span>
                  <span className="fs-5 fw-bold">${totalPrice.toFixed(2)}</span>
                </div>
                <button className="btn btn-primary w-100" disabled={totalItems === 0}>
                  Checkout Now
                </button>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  )
}

export default App
