import { getFeaturedProducts } from '@/controllers/catalogController'
import type { AccountOrder, CustomerProfile, StoredOrder } from '@/models/order'
import { listOrders } from '@/server/ordersRepository'

function toAccountOrder(order: StoredOrder): AccountOrder {
  return {
    orderNumber: order.orderNumber,
    status: order.status,
    createdAt: order.createdAt,
    total: order.totals.total,
    items: order.items,
  }
}

export async function getAccountDashboard() {
  const orders = await listOrders()
  const latestOrder = orders[0]
  const customer: CustomerProfile = {
    name: latestOrder?.customer.fullName ?? 'Khách hàng',
    email: latestOrder?.customer.email ?? 'Chưa có email đơn hàng',
    tier: orders.length >= 3 ? 'Chăm sóc Concierge' : 'Thành viên Renewed',
    nextCheckIn: latestOrder
      ? new Intl.DateTimeFormat('vi-VN').format(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000))
      : 'Chưa có lịch',
    availableTradeInCredit: Math.round(
      orders.reduce((total, order) => total + order.totals.total, 0) * 0.03,
    ),
  }

  return {
    customer,
    orders: orders.map(toAccountOrder),
    savedRecommendations: await getFeaturedProducts(3),
    serviceStats: [
      {
        label: 'Tổng đơn hàng',
        value: orders.length.toString(),
        detail: orders.length > 0 ? 'Đọc từ kho đơn hàng thật.' : 'Chưa có đơn hàng trong hệ thống.',
      },
      {
        label: 'Đơn đã giao',
        value: orders.filter((order) => order.status === 'Đã giao').length.toString(),
        detail: 'Tính theo trạng thái đơn hiện tại.',
      },
      {
        label: 'Đang xử lý',
        value: orders.filter((order) => order.status !== 'Đã giao').length.toString(),
        detail: 'Các đơn còn cần chăm sóc, giao nhận hoặc cài đặt.',
      },
    ],
  }
}
