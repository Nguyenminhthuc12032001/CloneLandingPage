import '../App.css'

const navItems = ['Destinations', 'Journeys', 'Stories', 'Concierge']

const metrics = [
  { value: '10M+', label: 'travelers served' },
  { value: '350+', label: 'curated routes' },
  { value: '25+', label: 'years of planning' },
]

const featuredTrips = [
  {
    title: 'Japan Blossom Edition',
    text: 'A calm itinerary through Tokyo, Kawaguchi and Kyoto with premium pacing and refined city-to-nature transitions.',
    meta: '5 days / Tokyo, Kyoto',
  },
  {
    title: 'Seoul Summer Light',
    text: 'A bright Korea journey focused on architecture, retail experiences and easy movement across signature landmarks.',
    meta: '4 days / Seoul, Nami',
  },
  {
    title: 'Alpine Europe Escape',
    text: 'A long-form route with mountain panoramas, clean hotel experiences and city stops designed for first-time Europe guests.',
    meta: '8 days / Zurich, Milan',
  },
]

const destinationGroups = [
  {
    title: 'Asia',
    items: ['Japan', 'Korea', 'China', 'Taiwan', 'Singapore', 'Thailand'],
  },
  {
    title: 'Europe',
    items: ['Italy', 'Switzerland', 'Austria', 'Germany', 'France', 'Portugal'],
  },
  {
    title: 'Signature',
    items: ['Pilgrimage', 'Private Tours', 'Family Trips', 'Luxury Retreats'],
  },
]

const experienceCards = [
  {
    eyebrow: 'Precision',
    title: 'A homepage built to feel calm, premium and obvious at first glance.',
    text: 'The layout removes noise, tightens hierarchy and pushes each decision toward clarity, spacing and elegant contrast.',
  },
  {
    eyebrow: 'Flow',
    title: 'Every block is arranged to read like a guided product story.',
    text: 'Hero, metrics, featured journeys and destinations are sequenced to create momentum without the clutter typical of travel sites.',
  },
]

const testimonials = [
  {
    name: 'Jessica Nguyen',
    role: 'Family traveler',
    quote: 'Everything felt considered. The page instantly tells me where to start, what is premium and why I should trust the brand.',
  },
  {
    name: 'Tuan Nguyen',
    role: 'Returning customer',
    quote: 'The visual system is cleaner and far easier to scan than a traditional tour homepage. It feels modern and expensive.',
  },
]

export function HomePage() {
  return (
    <div className="apple-page">
      <header className="apple-nav">
        <div className="apple-container apple-nav__inner">
          <a className="apple-logo" href="#top">
            eTravel Vietnam
          </a>

          <nav className="apple-nav__links" aria-label="Primary navigation">
            {navItems.map((item) => (
              <a href="#top" key={item}>
                {item}
              </a>
            ))}
          </nav>

          <a className="apple-button apple-button--ghost" href="#contact">
            Book a Call
          </a>
        </div>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="apple-container hero-section__layout">
            <div className="hero-copy">
              <span className="eyebrow">Travel, redesigned</span>
              <h1>Luxury travel planning with an Apple-like calm.</h1>
              <p>
                A premium homepage concept for a travel brand that replaces clutter with focus,
                generous spacing and confident storytelling.
              </p>

              <div className="hero-actions">
                <a className="apple-button apple-button--solid" href="#featured">
                  Explore journeys
                </a>
                <a className="apple-button apple-button--ghost" href="#destinations">
                  View destinations
                </a>
              </div>

              <div className="metric-grid">
                {metrics.map((item) => (
                  <article className="metric-card" key={item.label}>
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </article>
                ))}
              </div>
            </div>

            <div className="hero-visual" aria-hidden="true">
              <div className="hero-visual__orb hero-visual__orb--large" />
              <div className="hero-visual__orb hero-visual__orb--small" />
              <div className="hero-visual__glass">
                <span>Featured this season</span>
                <strong>Japan Blossom Edition</strong>
                <p>Curated routes, slower pacing, unforgettable color.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="apple-section" id="featured">
          <div className="apple-container">
            <div className="section-head">
              <span className="eyebrow">Featured journeys</span>
              <h2>Clean cards, restrained color and a premium product rhythm.</h2>
            </div>

            <div className="trip-grid">
              {featuredTrips.map((trip) => (
                <article className="trip-card" key={trip.title}>
                  <div className="trip-card__image" />
                  <div className="trip-card__body">
                    <span>{trip.meta}</span>
                    <h3>{trip.title}</h3>
                    <p>{trip.text}</p>
                    <a href="#contact">Discover more</a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="apple-section apple-section--soft">
          <div className="apple-container split-feature">
            {experienceCards.map((card) => (
              <article className="story-card" key={card.title}>
                <span className="eyebrow">{card.eyebrow}</span>
                <h2>{card.title}</h2>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="apple-section" id="destinations">
          <div className="apple-container">
            <div className="section-head">
              <span className="eyebrow">Destinations</span>
              <h2>Organized like a product catalog, not a crowded travel portal.</h2>
            </div>

            <div className="destination-grid">
              {destinationGroups.map((group) => (
                <article className="destination-card" key={group.title}>
                  <h3>{group.title}</h3>
                  <div className="destination-card__list">
                    {group.items.map((item) => (
                      <span className="destination-pill" key={item}>
                        {item}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="apple-section apple-section--dark">
          <div className="apple-container">
            <div className="section-head section-head--light">
              <span className="eyebrow">What people feel</span>
              <h2>A travel interface that feels more like a premium product launch.</h2>
            </div>

            <div className="testimonial-grid">
              {testimonials.map((item) => (
                <article className="testimonial-card" key={item.name}>
                  <p>{item.quote}</p>
                  <strong>{item.name}</strong>
                  <span>{item.role}</span>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="apple-footer" id="contact">
        <div className="apple-container apple-footer__inner">
          <div>
            <span className="eyebrow">Ready to continue</span>
            <h2>We can turn this direction into a full travel website system.</h2>
          </div>

          <div className="footer-actions">
            <a className="apple-button apple-button--solid" href="mailto:hello@etravel.vn">
              Start the project
            </a>
            <a className="apple-button apple-button--ghost" href="#top">
              Back to top
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
