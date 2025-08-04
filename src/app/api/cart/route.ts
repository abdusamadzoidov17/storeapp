import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    const userId = searchParams.get('userId')

    if (!sessionId && !userId) {
      return NextResponse.json(
        { error: 'Session ID or User ID is required' },
        { status: 400 }
      )
    }

    const where: any = {}
    if (userId) {
      where.userId = userId
    } else {
      where.sessionId = sessionId
    }

    const cartItems = await db.cartItem.findMany({
      where,
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
    })

    return NextResponse.json(cartItems)
  } catch (error) {
    console.error('Error fetching cart items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cart items' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, variantId, quantity, userId, sessionId } = body

    if (!productId || !quantity) {
      return NextResponse.json(
        { error: 'Product ID and quantity are required' },
        { status: 400 }
      )
    }

    if (!userId && !sessionId) {
      return NextResponse.json(
        { error: 'User ID or Session ID is required' },
        { status: 400 }
      )
    }

    // Check if product exists and has enough stock
    const product = await db.product.findUnique({
      where: { id: productId },
      include: { variants: true }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    if (variantId) {
      const variant = product.variants?.find(v => v.id === variantId)
      if (!variant) {
        return NextResponse.json(
          { error: 'Variant not found' },
          { status: 404 }
        )
      }
      if (variant.stock < quantity) {
        return NextResponse.json(
          { error: 'Not enough stock for this variant' },
          { status: 400 }
        )
      }
    } else {
      if (product.stock < quantity) {
        return NextResponse.json(
          { error: 'Not enough stock' },
          { status: 400 }
        )
      }
    }

    // Check if item already exists in cart
    const where: any = { productId }
    if (userId) where.userId = userId
    if (sessionId) where.sessionId = sessionId
    if (variantId) where.variantId = variantId

    const existingItem = await db.cartItem.findFirst({ where })

    if (existingItem) {
      // Update quantity
      const updatedItem = await db.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      })
      return NextResponse.json(updatedItem)
    } else {
      // Create new cart item
      const newItem = await db.cartItem.create({
        data: {
          productId,
          variantId,
          quantity,
          userId,
          sessionId
        },
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
      })
      return NextResponse.json(newItem)
    }
  } catch (error) {
    console.error('Error adding item to cart:', error)
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    )
  }
}