import Link from 'next/link'

export function SiteFooter() {
  const quickLinks = [
    { href: '/products', label: 'Điện thoại' },
    { href: '/trade-in', label: 'Thu cũ đổi mới' },
    { href: '/compare', label: 'So sánh' },
    { href: '/account', label: 'Tài khoản' },
  ]

  const assurances = [
    {
      title: 'Kiểm tra rõ tình trạng',
      text: 'Pin, ngoại hình và khả năng hoạt động được hiển thị rõ trước khi khách quyết định chốt máy.',
    },
    {
      title: 'Bảo hành 12 tháng',
      text: 'Mỗi máy đều có quyền lợi sau mua rõ ràng để khách yên tâm dùng lâu dài và dễ lên đời về sau.',
    },
    {
      title: 'Hỗ trợ nhanh mỗi ngày',
      text: 'Đội ngũ tư vấn hoạt động từ 09:00 đến 21:00 cho nhu cầu so sánh máy, thu cũ và thanh toán.',
    },
  ]

  return (
    <footer className="site-footer">
      <div className="shell site-footer__grid">
        <div className="site-footer__intro">
          <span className="section-heading__eyebrow">Máy cũ giá tốt</span>
          <h2>Điện thoại đã qua sử dụng, kiểm tra kỹ và báo giá rõ ràng.</h2>
          <p>
            Trang bán hàng ưu tiên đúng điều người mua thật sự quan tâm: pin, ngoại hình, bảo hành, thu cũ đổi mới và
            hỗ trợ chọn máy theo ngân sách.
          </p>

          <div className="site-footer__actions">
            <Link href="/products" className="button button--primary button--small">
              Xem điện thoại
            </Link>
            <Link href="/trade-in" className="button button--ghost button--small">
              Định giá máy cũ
            </Link>
          </div>
        </div>

        <div className="site-footer__nav">
          <h3>Đi nhanh</h3>
          <div className="footer-links">
            {quickLinks.map((link) => (
              <Link href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="footer-note">
          {assurances.map((item) => (
            <article className="footer-assurance" key={item.title}>
              <strong>{item.title}</strong>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </footer>
  )
}
