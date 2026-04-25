import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <section className="shell empty-state">
      <h1>Không tìm thấy trang.</h1>
      <p>Đường dẫn này hiện chưa tồn tại trong cửa hàng. Hãy quay lại trang sản phẩm để tiếp tục xem máy.</p>
      <Link href="/products" className="button button--primary">
        Đi tới trang sản phẩm
      </Link>
    </section>
  )
}
