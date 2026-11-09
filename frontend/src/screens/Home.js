import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/Card';
import { apiRequest } from '../api';

function Home() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [foodCat, setFoodCat] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [status, setStatus] = useState('loading');

  const loadData = async () => {
    setStatus('loading');
    try {
      const data = await apiRequest('/api/foodData');
      if (!Array.isArray(data)) throw new Error('Unexpected response');
      setFoodItems(data[0] || []);
      setFoodCat(data[1] || []);
      setStatus('ready');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const query = search.trim().toLowerCase();
  const visibleCategories = useMemo(
    () =>
      foodCat
        .filter((cat) => activeCategory === 'All' || cat.CategoryName === activeCategory)
        .map((cat) => ({
          ...cat,
          items: foodItems.filter(
            (item) => item.CategoryName === cat.CategoryName && item.name.toLowerCase().includes(query)
          ),
        }))
        .filter((cat) => cat.items.length > 0),
    [foodCat, foodItems, activeCategory, query]
  );

  return (
    <>
      <Navbar />
      <main>
        <section className="bc-hero">
          <div className="container py-5">
            <h1 className="display-5 text-white mb-2">Hungry? We&apos;ve got you.</h1>
            <p className="lead text-white-50 mb-4">Biryani, starters and pizza, made fresh and ready when you are.</p>
            <form className="bc-search" role="search" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="food-search" className="visually-hidden">
                Search dishes
              </label>
              <input
                id="food-search"
                className="form-control form-control-lg"
                type="search"
                placeholder="Search dishes, e.g. paneer"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>
          </div>
        </section>

        <div className="container py-4">
          {status === 'loading' && (
            <div className="text-center py-5" role="status">
              <div className="spinner-border text-success mb-3" aria-hidden="true"></div>
              <div className="text-body-secondary">Loading the menu…</div>
            </div>
          )}

          {status === 'error' && (
            <div className="alert alert-danger d-flex flex-wrap justify-content-between align-items-center gap-2 my-4">
              <span>We couldn&apos;t load the menu. Is the API running?</span>
              <button type="button" className="btn btn-sm btn-outline-light" onClick={loadData}>
                Try again
              </button>
            </div>
          )}

          {status === 'ready' && (
            <>
              {foodCat.length > 0 && (
                <div className="d-flex flex-wrap gap-2 mb-4" aria-label="Filter by category">
                  {['All', ...foodCat.map((c) => c.CategoryName)].map((name) => (
                    <button
                      key={name}
                      type="button"
                      className={`bc-chip ${activeCategory === name ? 'active' : ''}`}
                      aria-pressed={activeCategory === name}
                      onClick={() => setActiveCategory(name)}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}

              {visibleCategories.length === 0 && (
                <div className="text-center py-5 text-body-secondary">
                  {foodItems.length === 0
                    ? 'The menu is empty. Run `npm run seed` in backend/ to load sample dishes.'
                    : `No dishes match “${search}”.`}
                </div>
              )}

              {visibleCategories.map((cat) => (
                <section key={cat._id} className="mb-5">
                  <div className="d-flex align-items-baseline gap-2 mb-3">
                    <h2 className="h4 bc-section-title mb-0">{cat.CategoryName}</h2>
                    <span className="text-body-secondary small">{cat.items.length} dishes</span>
                  </div>
                  <div className="row g-4">
                    {cat.items.map((item) => (
                      <div key={item._id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                        <Card
                          id={item._id}
                          foodName={item.name}
                          description={item.description}
                          options={item.options}
                          imgSrc={item.img}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Home;
