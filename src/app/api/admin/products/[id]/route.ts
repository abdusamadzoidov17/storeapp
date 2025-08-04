import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Доступ запрещен" },
        { status: 403 }
      )
    }

    const product = await db.product.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        images: true,
        variants: true,
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: "Товар не найден" },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json(
      { error: "Произошла ошибка при получении товара" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Доступ запрещен" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      name,
      description,
      price,
      comparePrice,
      sku,
      stock,
      categoryId,
      isActive,
    } = body

    // Check if SKU already exists for other products
    if (sku) {
      const existingProduct = await db.product.findFirst({
        where: {
          sku,
          NOT: { id: params.id },
        },
      })

      if (existingProduct) {
        return NextResponse.json(
          { error: "Товар с таким SKU уже существует" },
          { status: 400 }
        )
      }
    }

    const product = await db.product.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price && { price }),
        ...(comparePrice !== undefined && { comparePrice }),
        ...(sku && { sku }),
        ...(stock !== undefined && { stock }),
        ...(categoryId && { categoryId }),
        ...(isActive !== undefined && { isActive }),
      },
      include: {
        category: true,
        images: true,
        variants: true,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json(
      { error: "Произошла ошибка при обновлении товара" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Доступ запрещен" },
        { status: 403 }
      )
    }

    // Check if product exists
    const product = await db.product.findUnique({
      where: { id: params.id },
      include: {
        orderItems: true,
        cartItems: true,
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: "Товар не найден" },
        { status: 404 }
      )
    }

    // Check if product has orders or cart items
    if (product.orderItems.length > 0) {
      return NextResponse.json(
        { error: "Невозможно удалить товар, который есть в заказах" },
        { status: 400 }
      )
    }

    // Delete related data first
    await db.productImage.deleteMany({
      where: { productId: params.id },
    })

    await db.productVariant.deleteMany({
      where: { productId: params.id },
    })

    await db.cartItem.deleteMany({
      where: { productId: params.id },
    })

    // Delete the product
    await db.product.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Товар успешно удален" })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json(
      { error: "Произошла ошибка при удалении товара" },
      { status: 500 }
    )
  }
}