import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Get total revenue
    const ordersResult = await db.order.aggregate({
      _sum: { total: true },
      _count: { id: true },
      where: {
        status: {
          not: 'CANCELLED'
        }
      }
    })

    // Get total products
    const totalProducts = await db.product.count({
      where: { isActive: true }
    })

    // Get total customers
    const totalCustomers = await db.user.count({
      where: { role: 'CUSTOMER' }
    })

    // Get recent orders
    const recentOrders = await db.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    // Get top products by sales
    const topProducts = await db.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      _count: { id: true },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: 5
    })

    // Get product details for top products
    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await db.product.findUnique({
          where: { id: item.productId },
          select: {
            id: true,
            name: true,
            price: true
          }
        })
        return {
          ...product,
          sales: item._sum.quantity || 0,
          orders: item._count.id
        }
      })
    )

    // Get orders from last month for comparison
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    
    const currentMonthOrders = await db.order.count({
      where: {
        createdAt: {
          gte: lastMonth
        }
      }
    })

    const previousMonthOrders = await db.order.count({
      where: {
        createdAt: {
          lt: lastMonth,
          gte: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1)
        }
      }
    })

    const ordersChange = previousMonthOrders > 0 
      ? ((currentMonthOrders - previousMonthOrders) / previousMonthOrders) * 100
      : 0

    // Calculate revenue change
    const currentMonthRevenue = await db.order.aggregate({
      _sum: { total: true },
      where: {
        createdAt: {
          gte: lastMonth
        },
        status: {
          not: 'CANCELLED'
        }
      }
    })

    const previousMonthRevenue = await db.order.aggregate({
      _sum: { total: true },
      where: {
        createdAt: {
          lt: lastMonth,
          gte: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1)
        },
        status: {
          not: 'CANCELLED'
        }
      }
    })

    const revenueChange = previousMonthRevenue._sum.total && previousMonthRevenue._sum.total > 0
      ? ((currentMonthRevenue._sum.total || 0) - previousMonthRevenue._sum.total) / previousMonthRevenue._sum.total * 100
      : 0

    const dashboardStats = {
      totalRevenue: ordersResult._sum.total || 0,
      totalOrders: ordersResult._count.id,
      totalProducts,
      totalCustomers,
      recentOrders: recentOrders.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customer: order.user?.name || order.user?.email || 'Гость',
        total: order.total,
        status: order.status,
        date: order.createdAt.toISOString().split('T')[0]
      })),
      topProducts: topProductsWithDetails.map(product => ({
        id: product.id,
        name: product.name,
        sales: product.sales,
        revenue: (product.price || 0) * (product.sales || 0)
      })),
      revenueChange: Math.round(revenueChange * 10) / 10,
      ordersChange: Math.round(ordersChange * 10) / 10
    }

    return NextResponse.json(dashboardStats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}