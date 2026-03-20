import '../App.css'

const navItems = [
  { label: 'Bộ sưu tập', href: '#featured' },
  { label: 'Ưu đãi', href: '#offers' },
  { label: 'Điểm đến', href: '#destinations' },
  { label: 'Thiết kế tour riêng', href: '#experience' },
  { label: 'Liên hệ', href: '#contact' },
]

const quickFilters = {
  departures: ['TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng'],
  destinations: ['Nhật Bản', 'Hàn Quốc', 'Châu Âu', 'Dubai', 'Úc'],
  timing: ['Tháng 4', 'Tháng 5', 'Mùa hè', 'Lễ 30/4'],
}

const featuredTours = [
  {
    title: 'Nhật Bản mùa hoa anh đào',
    description: 'Lộ trình tinh gọn qua Tokyo, Fuji và Kyoto với nhịp trải nghiệm vừa đủ sâu, vừa đủ thư thái.',
    image:
      'https://transviet.com.vn/Media/Uploads/gallery/JP04805/JP04805-Anh-avatar-tokyo-disneyland.jpg',
    days: '5 ngày',
    nights: '4 đêm',
    departure: 'TP. Hồ Chí Minh',
    code: 'JP048.05',
    oldPrice: '43.990.000đ',
    price: '37.990.000đ',
    href: 'https://transviet.com.vn/tour/tour-nhat-ban-dau-an-truyen-thong-va-hien-dai-3818',
    tone: 'Di sản và đương đại',
  },
  {
    title: 'Seoul - Nami mùa nắng đẹp',
    description: 'Giao diện tour được cấu trúc lại để khách hàng xem nhanh điểm nổi bật, chi phí và mức độ phù hợp.',
    image: 'https://transviet.com.vn/Media/Uploads/gallery/KR01104/KR01104-Anh-avatar.jpg',
    days: '4 ngày',
    nights: '3 đêm',
    departure: 'TP. Hồ Chí Minh',
    code: 'KR011.04',
    oldPrice: '19.990.000đ',
    price: '16.490.000đ',
    href: 'https://transviet.com.vn/tour/du-lich-seoul--nami-vi-vu-mua-he-xu-han-3914',
    tone: 'Nhẹ nhàng và trẻ trung',
  },
  {
    title: 'Busan - Gyeongju miền di sản',
    description: 'Tăng cảm giác cao cấp bằng hình ảnh lớn, khoảng thở rộng và CTA được ưu tiên rõ ràng.',
    image: 'https://transviet.com.vn/Media/Uploads/gallery/KR05505/KR05505-Anh-avatar.jpg',
    days: '5 ngày',
    nights: '4 đêm',
    departure: 'TP. Hồ Chí Minh',
    code: 'KR055.05',
    oldPrice: '26.990.000đ',
    price: '20.990.000đ',
    href: 'https://transviet.com.vn/tour/du-lich-busan-gyeongju-ve-mien-di-san-3804',
    tone: 'Ấm áp và chỉn chu',
  },
]

const curatedOffers = [
  {
    title: 'Ưu đãi Nhật Bản chọn lọc',
    description: 'Tập trung nhóm tour có tỷ lệ chuyển đổi cao với cách trình bày súc tích, dễ so sánh.',
    image: 'https://transviet.com.vn/Media/Uploads/gallery/JP03905/JP03905-avatar.jpg',
    label: 'Giảm đến 6 triệu',
    href: 'https://transviet.com.vn/tour/tour-nhat-ban-dac-sac-van-hoa-truyen-thong-3354',
  },
  {
    title: 'Trung Quốc mùa đẹp',
    description: 'Các gói tour ngắn ngày được ưu tiên cho nhóm khách cần quyết định nhanh trên mobile.',
    image: 'https://transviet.com.vn/Media/Uploads/gallery/CN02106/CN02106-Anh%20avatar.jpg',
    label: 'Khởi hành liên tục',
    href: 'https://transviet.com.vn/tour/thuong-hai-3380',
  },
]

const destinations = [
  {
    region: 'Châu Á',
    title: 'Những hành trình năng động, dễ chốt',
    items: ['Tokyo', 'Osaka', 'Seoul', 'Busan', 'Đài Bắc', 'Singapore'],
    accent: 'destination-card--asia',
  },
  {
    region: 'Châu Âu',
    title: 'Tuyến premium cho khách muốn chiều sâu',
    items: ['Pháp', 'Ý', 'Thụy Sĩ', 'Đức', 'Áo', 'Hà Lan'],
    accent: 'destination-card--europe',
  },
  {
    region: 'Châu Úc',
    title: 'Nhịp đi vừa phải, hợp gia đình',
    items: ['Sydney', 'Melbourne', 'Canberra', 'Gold Coast'],
    accent: 'destination-card--oceania',
  },
]

const serviceModes = [
  {
    title: 'Tour trọn gói',
    text: 'Lịch trình có sẵn, điểm đến nổi bật và dịch vụ đồng bộ cho nhóm khách muốn lựa chọn nhanh.',
  },
  {
    title: 'Thiết kế tour riêng',
    text: 'Tối ưu theo ngân sách, thời gian và phong cách trải nghiệm cho gia đình, doanh nghiệp hoặc nhóm riêng.',
  },
  {
    title: 'Ưu tiên tư vấn',
    text: 'Dễ để lại nhu cầu, dễ được gợi ý tuyến phù hợp và dễ chốt phương án khởi hành.',
  },
]

const travelMoments = [
  { label: 'Khởi hành linh hoạt', value: 'Lịch đi đa dạng' },
  { label: 'Điểm đến nổi bật', value: 'Á - Âu - Úc - Mỹ' },
  { label: 'Tư vấn riêng', value: 'Theo nhu cầu thực tế' },
]

const reasons = [
  {
    value: '01',
    title: 'Kinh nghiệm',
    text: 'Đồng hành cùng hàng triệu lượt khách qua nhiều năm, mỗi hành trình đều được chuẩn bị với độ chín nghề và sự am hiểu điểm đến.',
  },
  {
    value: '02',
    title: 'Chuyên nghiệp',
    text: 'Từ khâu tư vấn, lựa chọn lịch trình đến cách tổ chức tour, mọi điểm chạm đều hướng đến sự rõ ràng và tận tâm.',
  },
  {
    value: '03',
    title: 'An toàn và uy tín',
    text: 'Khách hàng luôn là trung tâm của mỗi chuyến đi, với tiêu chuẩn vận hành chỉn chu để tạo cảm giác an tâm xuyên suốt.',
  },
]

const testimonials = [
  {
    name: 'Mai Anh',
    role: 'Brand Manager',
    quote: 'Trang mới tạo cảm giác thương hiệu trưởng thành hơn nhiều, nhìn là thấy đáng tin và dễ mua.',
  },
  {
    name: 'Minh Quân',
    role: 'Performance Lead',
    quote: 'Trang cho cảm giác xem rất nhanh trên mobile, CTA rõ ràng và thông tin không bị chồng chéo.',
  },
]

const trustMetrics = [
  { value: '10M+', label: 'khách hàng đã phục vụ' },
  { value: '25+', label: 'năm kinh nghiệm lữ hành' },
  { value: '350+', label: 'điểm đến đang khai thác' },
]

function SectionHead({
  eyebrow,
  title,
  description,
  light = false,
}: {
  eyebrow: string
  title: string
  description?: string
  light?: boolean
}) {
  return (
    <div className={`section-head ${light ? 'section-head--light' : ''}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  )
}

function Rating() {
  return (
    <div className="rating" aria-label="Đánh giá 5 sao">
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index}>★</span>
      ))}
    </div>
  )
}

export function HomePage() {
  return (
    <div className="travel-page">
      <header className="travel-nav">
        <div className="container travel-nav__inner">
          <a className="travel-brand" href="#hero">
            eTravel Vietnam
          </a>

          <nav className="travel-nav__links" aria-label="Điều hướng chính">
            {navItems.map((item) => (
              <a href={item.href} key={item.label}>
                {item.label}
              </a>
            ))}
          </nav>

          <a className="pill-button pill-button--ghost" href="#contact">
            Tư vấn riêng
          </a>
        </div>
      </header>

      <main>
        <section className="hero" id="hero">
          <div className="container hero__layout">
            <div className="hero__copy">
              <span className="eyebrow">Top 10 doanh nghiệp lữ hành hàng đầu Việt Nam</span>
              <h1>Khám phá những hành trình trong nước và quốc tế cùng TransViet Travel.</h1>
              <p>
                Từ tour theo lịch trình có sẵn đến thiết kế tour riêng, mọi lựa chọn đều được sắp xếp rõ ràng để
                bạn dễ dàng tìm thấy chuyến đi phù hợp với thời gian, ngân sách và cảm hứng của mình.
              </p>

              <div className="hero__actions">
                <a className="pill-button pill-button--solid" href="#featured">
                  Xem tour cho bạn
                </a>
                <a className="pill-button pill-button--secondary" href="#experience">
                  Thiết kế tour riêng
                </a>
              </div>

              <div className="trust-row" aria-label="Các chỉ số thương hiệu">
                {trustMetrics.map((metric) => (
                  <article className="trust-card" key={metric.label}>
                    <strong>{metric.value}</strong>
                    <span>{metric.label}</span>
                  </article>
                ))}
              </div>

              <div className="moment-strip" aria-label="Các điểm nổi bật của dịch vụ">
                {travelMoments.map((item) => (
                  <article className="moment-pill" key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </article>
                ))}
              </div>
            </div>

            <div className="hero__visual">
              <article className="hero__feature-card">
                <div className="hero__feature-image">
                  <img
                    alt="Khách du lịch ngắm hoa anh đào tại Nhật Bản"
                    src="https://transviet.com.vn/Media/Uploads/Web-seo/PR%20SK/Bia%20Hoa%20Anh%20Dao/COVER-HOA-ANH-%C4%90%C3%80O_WEB_PC_1.jpg"
                  />
                </div>

                <div className="hero__feature-content">
                  <div>
                    <span className="overline">Tour theo lịch trình có sẵn</span>
                    <h2>Những điểm đến nổi bật được tuyển chọn cho mùa du lịch sắp tới.</h2>
                  </div>

                  <div className="hero__feature-meta">
                    <div>
                      <span>Trải nghiệm</span>
                      <strong>Đa dạng điểm đến, lịch trình rõ ràng, dịch vụ chỉn chu</strong>
                    </div>
                    <div>
                      <span>Ưu tiên</span>
                      <strong>Dễ xem tour, dễ so sánh và dễ để lại nhu cầu tư vấn</strong>
                    </div>
                  </div>
                </div>
              </article>

              <aside className="hero__search-card" aria-label="Bộ lọc tour nổi bật">
                <div className="search-card__header">
                  <div>
                    <span className="overline">Travel planner</span>
                    <h2>Tìm hành trình phù hợp</h2>
                  </div>
                  <span className="search-card__status">Thiết kế tour riêng</span>
                </div>

                <div className="filter-block">
                  <span>Nơi khởi hành</span>
                  <div className="chip-list">
                    {quickFilters.departures.map((item) => (
                      <button key={item} type="button">
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-block">
                  <span>Điểm đến</span>
                  <div className="chip-list">
                    {quickFilters.destinations.map((item) => (
                      <button key={item} type="button">
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-block">
                  <span>Thời điểm đi</span>
                  <div className="chip-list">
                    {quickFilters.timing.map((item) => (
                      <button key={item} type="button">
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="section section--floating">
          <div className="container editorial-strip">
            <div>
              <span className="eyebrow">TransViet selection</span>
              <p>
                Điểm đến, thời điểm đi và loại hình tour được sắp xếp mạch lạc để người xem nhanh chóng tiếp cận
                đúng nhóm hành trình mình quan tâm, từ tour phổ biến đến những nhu cầu thiết kế riêng.
              </p>
            </div>
            <a className="text-link" href="#experience">
              Xem thiết kế tour riêng
            </a>
          </div>
        </section>

        <section className="section section--compact">
          <div className="container service-band">
            {serviceModes.map((item) => (
              <article className="service-band__card" key={item.title}>
                <span className="overline">Dịch vụ</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section container" id="featured">
          <SectionHead
            eyebrow="Tour cho bạn"
            title="Những hành trình nổi bật được nhiều khách hàng quan tâm."
            description="Thông tin khởi hành, mã tour và giá từ được trình bày trực quan để dễ dàng so sánh và lựa chọn."
          />

          <div className="tour-grid">
            {featuredTours.map((tour) => (
              <article className="tour-card" key={tour.code}>
                <a className="tour-card__image" href={tour.href} target="_blank" rel="noreferrer">
                  <img alt={tour.title} src={tour.image} />
                  <div className="tour-card__overlay">
                    <span>{tour.tone}</span>
                    <div className="tour-badge">
                      <span>{tour.days}</span>
                      <span>{tour.nights}</span>
                    </div>
                  </div>
                </a>

                <div className="tour-card__body">
                  <div className="tour-card__topline">
                    <span className="tour-card__code">{tour.code}</span>
                    <Rating />
                  </div>

                  <a className="tour-card__title" href={tour.href} target="_blank" rel="noreferrer">
                    {tour.title}
                  </a>

                  <p>{tour.description}</p>

                  <div className="tour-card__bottom">
                    <dl className="tour-card__meta">
                      <div>
                        <dt>Khởi hành</dt>
                        <dd>{tour.departure}</dd>
                      </div>
                      <div>
                        <dt>Giá cũ</dt>
                        <dd className="old-price">{tour.oldPrice}</dd>
                      </div>
                    </dl>

                    <div className="tour-card__footer">
                      <div>
                        <span className="price-label">Giá từ</span>
                        <strong>{tour.price}</strong>
                      </div>
                      <a className="pill-button pill-button--solid" href={tour.href} target="_blank" rel="noreferrer">
                        Xem chi tiết
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section section--soft" id="offers">
          <div className="container">
            <SectionHead
              eyebrow="Giá tốt hôm nay"
              title="Ưu đãi dành cho những hành trình đang được tìm kiếm nhiều."
              description="Giữ nhịp mua tour rõ ràng với các lựa chọn nổi bật, giá tốt và lịch khởi hành hấp dẫn."
            />

            <div className="offer-grid">
              {curatedOffers.map((offer) => (
                <article className="offer-card" key={offer.title}>
                  <div className="offer-card__image">
                    <img alt={offer.title} src={offer.image} />
                  </div>

                  <div className="offer-card__body">
                    <span className="offer-badge">{offer.label}</span>
                    <h3>{offer.title}</h3>
                    <p>{offer.description}</p>
                    <a className="text-link" href={offer.href} target="_blank" rel="noreferrer">
                      Mở chi tiết tour
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section container" id="destinations">
          <SectionHead
            eyebrow="Điểm đến phổ biến"
            title="Khám phá những điểm đến được yêu thích tại TransViet Travel."
            description="Từ Châu Á, Châu Âu đến Châu Úc, mỗi nhóm điểm đến đều mở ra một sắc thái trải nghiệm riêng."
          />

          <div className="destination-grid">
            {destinations.map((group) => (
              <article className={`destination-card ${group.accent}`} key={group.region}>
                <div className="destination-card__image" aria-hidden="true">
                  <div className="destination-card__glow" />
                  <div className="destination-card__orb" />
                </div>
                <span className="destination-card__region">{group.region}</span>
                <h3>{group.title}</h3>
                <div className="destination-list">
                  {group.items.map((item) => (
                    <span className="destination-pill" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section section--dark" id="experience">
          <div className="container experience-layout">
            <div className="experience-copy">
              <SectionHead
                eyebrow="Thiết kế tour riêng"
                title="Dịch vụ phù hợp cho khách hàng cần một hành trình được cá nhân hóa kỹ hơn."
                description="Từ đoàn gia đình, doanh nghiệp đến nhóm khách có lịch trình đặc biệt, mọi yêu cầu đều có thể được tư vấn riêng."
                light
              />
            </div>

            <div className="strength-grid">
              {reasons.map((item) => (
                <article className="strength-card" key={item.value}>
                  <span>{item.value}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>

            <div className="private-tour-panel">
              <div>
                <span className="eyebrow">Thiết kế tour riêng</span>
                <h3>Phù hợp cho đoàn gia đình, nhóm doanh nghiệp và những lịch trình cần mức độ linh hoạt cao.</h3>
              </div>
              <p>
                Từ lựa chọn đường bay, thời lượng lưu trú đến nhịp trải nghiệm tại từng điểm đến, mọi chi tiết đều
                có thể được tinh chỉnh theo nhu cầu thực tế.
              </p>
              <a className="pill-button pill-button--ghost-light" href="#contact">
                Gửi nhu cầu tư vấn
              </a>
            </div>
          </div>
        </section>

        <section className="section section--pattern">
          <div className="container">
            <SectionHead
              eyebrow="Cảm nhận khách hàng"
              title="Những chia sẻ sau hành trình là minh chứng rõ nhất cho chất lượng dịch vụ."
              description="Sự thoải mái, an tâm và cảm giác được đồng hành tận tình là điều khách hàng luôn kỳ vọng ở mỗi chuyến đi."
            />

            <div className="testimonial-grid">
              {testimonials.map((item) => (
                <article className="testimonial-card" key={item.name}>
                  <Rating />
                  <p>{item.quote}</p>
                  <strong>{item.name}</strong>
                  <span>{item.role}</span>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="footer" id="contact">
        <div className="container footer__inner">
          <div className="footer__copy">
            <span className="eyebrow">Liên hệ</span>
            <h2>Liên hệ với chúng tôi để nhận tư vấn tour phù hợp nhất cho kế hoạch sắp tới.</h2>
            <p>
              TP.HCM: 82 Võ Văn Tần, Phường Xuân Hòa, TP.HCM. Hà Nội: 9 Đào Duy Anh, Phường Kim Liên, Hà Nội. Hotline:
              (028)7305 7939 và (024)7305 7939.
            </p>
          </div>

          <div className="footer__actions">
            <a className="pill-button pill-button--solid" href="mailto:dulich.sgn@transviet.com">
              Nhận tư vấn ngay
            </a>
            <a className="pill-button pill-button--ghost-light" href="#hero">
              Lên đầu trang
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
