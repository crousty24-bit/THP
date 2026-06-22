import { useMemo, useState } from 'react'
import booksData from './books.json'
import './App.css'

const rawBooks = booksData.books.flat()

const initialBooks = rawBooks.map((book, index) => ({
  ...book,
  id: `${book.isbn || 'book'}-${index}`,
  isFav: Boolean(book.isFav),
  read: Boolean(book.read),
}))

function getDescription(book) {
  return (
    book.shortDescription ||
    book.longDescription ||
    'No description is available for this book.'
  )
}

function App() {
  const [books, setBooks] = useState(initialBooks)
  const [searchTerm, setSearchTerm] = useState('')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [showWishlistOnly, setShowWishlistOnly] = useState(false)

  const filteredBooks = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return books.filter((book) => {
      const matchesSearch = book.title.toLowerCase().includes(normalizedSearch)
      const matchesFavorite = !showFavoritesOnly || book.isFav
      const matchesWishlist = !showWishlistOnly || book.read

      return matchesSearch && matchesFavorite && matchesWishlist
    })
  }, [books, searchTerm, showFavoritesOnly, showWishlistOnly])

  const favoriteCount = books.filter((book) => book.isFav).length
  const wishlistCount = books.filter((book) => book.read).length

  function toggleBookState(bookId, key) {
    setBooks((currentBooks) =>
      currentBooks.map((book) =>
        book.id === bookId ? { ...book, [key]: !book[key] } : book,
      ),
    )
  }

  return (
    <main className="app-shell">
      <section className="page-heading" aria-labelledby="page-title">
        <p className="eyebrow">Librairie THP</p>
        <h1 id="page-title">Traqueur de lecture</h1>
        <p>
          Parcourez le catalogue, marquez vos favoris et composez votre liste de
          livres a lire.
        </p>
      </section>

      <section className="toolbar" aria-label="Recherche et filtres">
        <label className="search-field">
          <span>Rechercher par titre</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Ex: JavaScript, Android, React..."
          />
        </label>

        <div className="filter-actions">
          <button
            className={showFavoritesOnly ? 'filter-button is-active' : 'filter-button'}
            type="button"
            onClick={() => setShowFavoritesOnly((currentValue) => !currentValue)}
          >
            {showFavoritesOnly ? 'Retirer filtre favori' : 'Filtrer selon mes favoris'}
          </button>

          <button
            className={showWishlistOnly ? 'filter-button is-active' : 'filter-button'}
            type="button"
            onClick={() => setShowWishlistOnly((currentValue) => !currentValue)}
          >
            {showWishlistOnly ? 'Retirer filtre souhait' : 'Filtrer selon mes souhaits'}
          </button>
        </div>
      </section>

      <section className="results-summary" aria-live="polite">
        <strong>{filteredBooks.length}</strong>
        <span>livres affiches</span>
        <span>{favoriteCount} favoris</span>
        <span>{wishlistCount} souhaits de lecture</span>
      </section>

      {filteredBooks.length > 0 ? (
        <section className="books-grid" aria-label="Liste des livres">
          {filteredBooks.map((book) => (
            <article className="book-card" key={book.id}>
              <div className="book-cover">
                {book.thumbnailUrl ? (
                  <img src={book.thumbnailUrl} alt={`Couverture de ${book.title}`} />
                ) : (
                  <span>Aucune couverture</span>
                )}
              </div>

              <div className="book-content">
                <div>
                  <h2>{book.title}</h2>
                  {book.authors?.length > 0 && (
                    <p className="book-authors">
                      {book.authors.filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>

                <p className="book-description">{getDescription(book)}</p>

                <div className="book-actions">
                  <button
                    className={book.isFav ? 'toggle-button is-selected' : 'toggle-button'}
                    type="button"
                    aria-pressed={book.isFav}
                    onClick={() => toggleBookState(book.id, 'isFav')}
                  >
                    {book.isFav ? 'Retirer des favoris' : 'Ajouter en favoris'}
                  </button>

                  <button
                    className={book.read ? 'toggle-button is-selected' : 'toggle-button'}
                    type="button"
                    aria-pressed={book.read}
                    onClick={() => toggleBookState(book.id, 'read')}
                  >
                    {book.read ? 'Retirer des souhaits' : 'Je souhaite le lire'}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <p className="empty-state">Aucun livre ne correspond a ces criteres.</p>
      )}
    </main>
  )
}

export default App
