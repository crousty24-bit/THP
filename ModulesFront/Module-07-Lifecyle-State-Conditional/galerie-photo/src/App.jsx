import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'

const DEFAULT_QUERY = 'JavaScript'
const PHOTOS_PER_PAGE = 20
const UTM_SOURCE = 'thp_galerie_photo'
const API_TIMEOUT_MS = 15000

function getApiKey() {
  return globalThis.UNSPLASH_CONFIG?.apiKey?.trim() ?? ''
}

function normalizePhoto(photo) {
  return {
    id: photo.id,
    width: photo.width,
    height: photo.height,
    color: photo.color,
    alt: photo.alt_description || photo.description || 'Untitled photo',
    description: photo.description || photo.alt_description || 'No description provided.',
    urls: photo.urls,
    user: {
      name: photo.user?.name || 'Unknown photographer',
      firstName: photo.user?.first_name || '',
      lastName: photo.user?.last_name || '',
      profileUrl: photo.user?.links?.html || 'https://unsplash.com',
    },
  }
}

function getPhotographerName(user) {
  const fullName = `${user.firstName} ${user.lastName}`.trim()
  return fullName || user.name
}

function getAttributionUrl(profileUrl) {
  const separator = profileUrl.includes('?') ? '&' : '?'
  return `${profileUrl}${separator}utm_source=${UTM_SOURCE}&utm_medium=referral`
}

async function parseUnsplashResponse(response) {
  const responseText = await response.text()

  try {
    return JSON.parse(responseText)
  } catch {
    return { errors: responseText ? [responseText] : [] }
  }
}

function App() {
  const [apiKey] = useState(() => getApiKey())
  const hasLoadedInitialPhotos = useRef(false)
  const [searchInput, setSearchInput] = useState(DEFAULT_QUERY)
  const [widthInput, setWidthInput] = useState('')
  const [query, setQuery] = useState(DEFAULT_QUERY)
  const [minimumWidth, setMinimumWidth] = useState(0)
  const [photos, setPhotos] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [status, setStatus] = useState(apiKey ? 'idle' : 'missing-key')
  const [error, setError] = useState('')
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  const hasMore = apiKey && page < totalPages
  const isLoading = status === 'loading'
  const isLoadingMore = status === 'loading-more'

  const fetchPhotos = useCallback(
    async ({ nextQuery, nextMinimumWidth, nextPage, append }) => {
      if (!apiKey) {
        setStatus('missing-key')
        return
      }

      setStatus(append ? 'loading-more' : 'loading')
      setError('')

      const params = new URLSearchParams({
        query: nextQuery,
        page: String(nextPage),
        per_page: String(PHOTOS_PER_PAGE),
      })

      try {
        const response = await fetch(`https://api.unsplash.com/search/photos?${params}`, {
          headers: {
            Authorization: `Client-ID ${apiKey}`,
          },
          signal: AbortSignal.timeout(API_TIMEOUT_MS),
        })
        const data = await parseUnsplashResponse(response)

        if (!response.ok) {
          const message =
            response.status === 403
              ? 'Unsplash rejected the request. Check the API rate limit for your demo app.'
              : data.errors?.join(' ') || 'Unsplash request failed.'
          throw new Error(message)
        }

        const matchingPhotos = data.results
          .map(normalizePhoto)
          .filter((photo) => photo.width > nextMinimumWidth)

        setPhotos((currentPhotos) =>
          append ? [...currentPhotos, ...matchingPhotos] : matchingPhotos,
        )
        setPage(nextPage)
        setTotalPages(data.total_pages || 0)
        setStatus('success')
      } catch (requestError) {
        const message =
          requestError.name === 'TimeoutError'
            ? 'Unsplash did not respond within 15 seconds. Try again in a moment.'
            : requestError.message

        setError(message)
        setStatus('error')
      }
    },
    [apiKey],
  )

  useEffect(() => {
    if (hasLoadedInitialPhotos.current) {
      return
    }

    hasLoadedInitialPhotos.current = true

    // The exercise requires a default Unsplash search on first render.
    fetchPhotos({
      nextQuery: DEFAULT_QUERY,
      nextMinimumWidth: 0,
      nextPage: 1,
      append: false,
    })
  }, [fetchPhotos])

  useEffect(() => {
    if (!selectedPhoto) {
      return undefined
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setSelectedPhoto(null)
      }
    }

    document.body.classList.add('modal-open')
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.classList.remove('modal-open')
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedPhoto])

  function handleSubmit(event) {
    event.preventDefault()

    const cleanQuery = searchInput.trim() || DEFAULT_QUERY
    const cleanMinimumWidth = Math.max(0, Number(widthInput) || 0)

    setQuery(cleanQuery)
    setMinimumWidth(cleanMinimumWidth)
    fetchPhotos({
      nextQuery: cleanQuery,
      nextMinimumWidth: cleanMinimumWidth,
      nextPage: 1,
      append: false,
    })
  }

  function handleSeeMore() {
    fetchPhotos({
      nextQuery: query,
      nextMinimumWidth: minimumWidth,
      nextPage: page + 1,
      append: true,
    })
  }

  return (
    <main className="app-shell">
      <section className="gallery-hero" aria-labelledby="page-title">
        <div>
          <h1 id="page-title">Galerie photo</h1>
          <p>
            Search Unsplash by theme, filter by minimum image width, and inspect
            selected photos in a focused modal view.
          </p>
        </div>
      </section>

      <section className="search-panel" aria-label="Search photos">
        <form className="search-form" onSubmit={handleSubmit}>
          <label>
            <span>Theme</span>
            <input
              type="text"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="JavaScript"
            />
          </label>

          <label>
            <span>Minimum width</span>
            <input
              type="number"
              min="0"
              value={widthInput}
              onChange={(event) => setWidthInput(event.target.value)}
              placeholder="0"
            />
          </label>

          <button type="submit" disabled={isLoading || isLoadingMore}>
            Search
          </button>
        </form>
      </section>

      <section className="results-section" aria-live="polite">
        <div className="results-heading">
          <div>
            <h2>{query}</h2>
            <p>
              {photos.length} photo{photos.length > 1 ? 's' : ''} wider than{' '}
              {minimumWidth}px
            </p>
          </div>
        </div>

        {status === 'missing-key' && (
          <StatusMessage
            title="Unsplash API key missing"
            message="Create unsplash-config.js from the example file and add your access key."
          />
        )}

        {status === 'error' && (
          <StatusMessage title="Unable to load photos" message={error} />
        )}

        {isLoading && <StatusMessage title="Loading photos" message="Searching Unsplash..." />}

        {status === 'success' && photos.length === 0 && (
          <StatusMessage
            title="No matching photos"
            message="Try another theme or lower the minimum width."
          />
        )}

        {photos.length > 0 && (
          <div className="photos-grid">
            {photos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                onSelect={() => setSelectedPhoto(photo)}
              />
            ))}
          </div>
        )}

        {status === 'success' && hasMore && (
          <div className="more-actions">
            <button type="button" onClick={handleSeeMore} disabled={isLoadingMore}>
              {isLoadingMore ? 'Loading...' : 'See more'}
            </button>
          </div>
        )}
      </section>

      {selectedPhoto && (
        <PhotoModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
      )}
    </main>
  )
}

function StatusMessage({ title, message }) {
  return (
    <div className="status-message" role="status">
      <strong>{title}</strong>
      <span>{message}</span>
    </div>
  )
}

function PhotoCard({ photo, onSelect }) {
  const photographerName = getPhotographerName(photo.user)

  return (
    <article className="photo-card">
      <button type="button" className="photo-button" onClick={onSelect}>
        <img
          src={photo.urls.small}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          loading="lazy"
        />
      </button>
      <div className="photo-meta">
        <h3>
          Photo by{' '}
          <a href={getAttributionUrl(photo.user.profileUrl)} target="_blank" rel="noreferrer">
            {photographerName}
          </a>
        </h3>
        <p>{photo.description}</p>
      </div>
    </article>
  )
}

function PhotoModal({ photo, onClose }) {
  const photographerName = getPhotographerName(photo.user)

  return (
    <div className="photo-modal" role="dialog" aria-modal="true" aria-label={photo.alt}>
      <button type="button" className="modal-backdrop" onClick={onClose} aria-label="Close modal" />
      <div className="modal-content">
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close modal">
          x
        </button>
        <img src={photo.urls.regular} alt={photo.alt} />
        <div className="modal-caption">
          <strong>{photo.description}</strong>
          <a href={getAttributionUrl(photo.user.profileUrl)} target="_blank" rel="noreferrer">
            {photographerName} on Unsplash
          </a>
        </div>
      </div>
    </div>
  )
}

export default App
