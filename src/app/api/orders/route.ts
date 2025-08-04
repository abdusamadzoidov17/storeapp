import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `ORD-${timestamp}-${random}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      items,
      shipping,
      payment,
      subtotal,
      tax,
      shipping: shippingCost,
      total,
      userId
    } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Order items are required' },
        { status: 400 }
      )
    }

    if (!shipping || !payment) {
      return NextResponse.json(
        { error: 'Shipping and payment information are required' },
        { status: 400 }
      )
    }

    // Check stock availability
    for (const item of items) {
      const product = await db.product.findUnique({
        where: { id: item.productId },
        include: { variants: true }
      })

      if (!product) {
        return NextResponse.json(
          { error: `Product with ID ${item.productId} not found` },
          { status: 404 }
        )
      }

      if (item.variantId) {
        const variant = product.variants?.find(v => v.id === item.variantId)
        if (!variant) {
          return NextResponse.json(
            { error: `Variant with ID ${item.variantId} not found` },
            { status: 404 }
          )
        }
        if (variant.stock < item.quantity) {
          return NextResponse.json(
            { error: `Not enough stock for variant ${item.variantId}` },
            { status: 400 }
          )
        }
      } else {
        if (product.stock < item.quantity) {
          return NextResponse.json(
            { error: `Not enough stock for product ${item.productId}` },
            { status: 400 }
          )
        }
      }
    }

    // Create or find address
    let address = null
    if (userId) {
      address = await db.address.create({
        data: {
          street: shipping.street,
          city: shipping.city,
          state: shipping.state,
          zipCode: shipping.zipCode,
          country: shipping.country,
          userId,
          isDefault: false
        }
      })
    }

    // Generate order number
    const orderNumber = generateOrderNumber()

    // Create order
    const order = await db.order.create({
      data: {
        orderNumber,
        status: 'PENDING',
        subtotal,
        tax,
        shipping: shippingCost,
        total,
        userId,
        addressId: address?.id,
        paymentMethod: payment.method,
        notes: shipping.notes,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
                images: {
                  where: {
                    isPrimary: true
                  },
                  take: 1
                }
              }
            },
            variant: true
          }
        },
        address: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    })

    // Update stock
    for (const item of items) {
      if (item.variantId) {
        await db.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } }
        })
      }
      await db.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    // For authenticated users, get their orders
    const session = await getServerSession(authOptions)
    
    const where: any = {}
    if (session?.user?.id) {
      where.userId = session.user.id
    }
    if (status) where.status = status

    const orders = await db.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
                images: {
                  where: {
                    isPrimary: true
                  },
                  take: 1
                }
              }
            },
            variant: true
          }
        },
        address: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}