'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  ShoppingCart, 
  Users, 
  Package, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Eye,
  Edit,
  MoreHorizontal
} from 'lucide-react'

interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  totalCustomers: number
  recentOrders: any[]
  topProducts: any[]
  revenueChange: number
  ordersChange: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      // Mock data for now - in real app, this would fetch from API
      const mockStats: DashboardStats = {
        totalRevenue: 45231.89,
        totalOrders: 1234,
        totalProducts: 156,
        totalCustomers: 892,
        recentOrders: [
          { id: '1', orderNumber: 'ORD-001', customer: 'Иван Иванов', total: 156.99, status: 'DELIVERED', date: '2024-01-15' },
          { id: '2', orderNumber: 'ORD-002', customer: 'Мария Петрова', total: 89.50, status: 'PROCESSING', date: '2024-01-15' },
          { id: '3', orderNumber: 'ORD-003', customer: 'Алексей Сидоров', total: 234.00, status: 'SHIPPED', date: '2024-01-14' },
          { id: '4', orderNumber: 'ORD-004', customer: 'Елена Козлова', total: 67.25, status: 'PENDING', date: '2024-01-14' },
          { id: '5', orderNumber: 'ORD-005', customer: 'Дмитрий Смирнов', total: 445.80, status: 'CONFIRMED', date: '2024-01-13' }
        ],
        topProducts: [
          { id: '1', name: 'Смартфон Pro Max', sales: 234, revenue: 233766 },
          { id: '2', name: 'Ноутбук Ultra', sales: 156, revenue: 202794 },
          { id: '3', name: 'Футболка Premium', sales: 89, revenue: 2669 },
          { id: '4', name: 'Джинсы Classic', sales: 67, revenue: 5359 },
          { id: '5', name: 'Умная лампочка', sales: 45, revenue: 899 }
        ],
        revenueChange: 12.5,
        ordersChange: 8.2
      }
      
      setStats(mockStats)
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-500'
      case 'PROCESSING': return 'bg-blue-500'
      case 'SHIPPED': return 'bg-purple-500'
      case 'PENDING': return 'bg-yellow-500'
      case 'CONFIRMED': return 'bg-indigo-500'
      case 'CANCELLED': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'Доставлен'
      case 'PROCESSING': return 'В обработке'
      case 'SHIPPED': return 'Отправлен'
      case 'PENDING': return 'Ожидает'
      case 'CONFIRMED': return 'Подтвержден'
      case 'CANCELLED': return 'Отменен'
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Ошибка загрузки данных</h1>
          <Button onClick={fetchDashboardStats}>Попробовать снова</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Панель администратора</h1>
              <p className="text-gray-600 mt-1">Обзор вашего интернет-магазина</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">Экспорт отчета</Button>
              <Button>Обновить данные</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Общая выручка</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                {stats.revenueChange > 0 ? (
                  <>
                    <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                    <span className="text-green-600">+{stats.revenueChange}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
                    <span className="text-red-600">{stats.revenueChange}%</span>
                  </>
                )}
                {' '}за последний месяц
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Заказы</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                {stats.ordersChange > 0 ? (
                  <>
                    <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                    <span className="text-green-600">+{stats.ordersChange}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
                    <span className="text-red-600">{stats.ordersChange}%</span>
                  </>
                )}
                {' '}за последний месяц
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Товары</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalProducts} активных товаров
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Клиенты</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalCustomers} зарегистрированных клиентов
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Последние заказы</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div>
                          <p className="font-medium">{order.orderNumber}</p>
                          <p className="text-sm text-gray-600">{order.customer}</p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusText(order.status)}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${order.total}</p>
                      <p className="text-sm text-gray-600">{order.date}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline" className="w-full">
                  Посмотреть все заказы
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Популярные товары</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.sales} продаж</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${product.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline" className="w-full">
                  Посмотреть все товары
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}