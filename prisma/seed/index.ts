import { db } from '../../src/lib/db'
import { Category, Product, ProductImage, ProductVariant } from '../../src/types'

async function main() {
  // Create categories
  const categories = await Promise.all([
    db.category.create({
      data: {
        name: 'Электроника',
        slug: 'electronics',
        description: 'Современная электроника и гаджеты'
      }
    }),
    db.category.create({
      data: {
        name: 'Одежда',
        slug: 'clothing',
        description: 'Модная одежда для всех'
      }
    }),
    db.category.create({
      data: {
        name: 'Дом и сад',
        slug: 'home-garden',
        description: 'Все для вашего дома и сада'
      }
    }),
    db.category.create({
      data: {
        name: 'Спорт и отдых',
        slug: 'sports-outdoors',
        description: 'Спортивные товары и оборудование'
      }
    }),
    db.category.create({
      data: {
        name: 'Книги',
        slug: 'books',
        description: 'Книги на любой вкус'
      }
    }),
    db.category.create({
      data: {
        name: 'Красота и здоровье',
        slug: 'beauty-health',
        description: 'Косметика и товары для здоровья'
      }
    })
  ])

  // Create products for each category
  const products = await Promise.all([
    // Electronics
    db.product.create({
      data: {
        name: 'Смартфон Pro Max',
        description: 'Последний флагманский смартфон с передовой камерой и процессором',
        price: 999.99,
        comparePrice: 1199.99,
        sku: 'PHONE-001',
        stock: 50,
        categoryId: categories[0].id,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop',
              altText: 'Смартфон Pro Max',
              isPrimary: true
            }
          ]
        },
        variants: {
          create: [
            { name: 'Цвет', value: 'Черный', stock: 20 },
            { name: 'Цвет', value: 'Белый', stock: 15 },
            { name: 'Цвет', value: 'Голубой', stock: 15 }
          ]
        }
      }
    }),
    db.product.create({
      data: {
        name: 'Ноутбук Ultra',
        description: 'Мощный ноутбук для работы и развлечений',
        price: 1299.99,
        sku: 'LAPTOP-001',
        stock: 30,
        categoryId: categories[0].id,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop',
              altText: 'Ноутбук Ultra',
              isPrimary: true
            }
          ]
        }
      }
    }),
    // Clothing
    db.product.create({
      data: {
        name: 'Футболка Premium',
        description: 'Качественная хлопковая футболка',
        price: 29.99,
        comparePrice: 39.99,
        sku: 'TSHIRT-001',
        stock: 100,
        categoryId: categories[1].id,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
              altText: 'Футболка Premium',
              isPrimary: true
            }
          ]
        },
        variants: {
          create: [
            { name: 'Размер', value: 'S', stock: 25 },
            { name: 'Размер', value: 'M', stock: 30 },
            { name: 'Размер', value: 'L', stock: 25 },
            { name: 'Размер', value: 'XL', stock: 20 }
          ]
        }
      }
    }),
    db.product.create({
      data: {
        name: 'Джинсы Classic',
        description: 'Классические джинсы из качественного денима',
        price: 79.99,
        sku: 'JEANS-001',
        stock: 80,
        categoryId: categories[1].id,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1542271021-7eecb283d060?w=300&h=300&fit=crop',
              altText: 'Джинсы Classic',
              isPrimary: true
            }
          ]
        }
      }
    }),
    // Home & Garden
    db.product.create({
      data: {
        name: 'Умная лампочка',
        description: 'LED лампочка с управлением через приложение',
        price: 19.99,
        comparePrice: 29.99,
        sku: 'BULB-001',
        stock: 200,
        categoryId: categories[2].id,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=300&h=300&fit=crop',
              altText: 'Умная лампочка',
              isPrimary: true
            }
          ]
        }
      }
    }),
    db.product.create({
      data: {
        name: 'Набор садовых инструментов',
        description: 'Полный набор для ухода за садом',
        price: 49.99,
        sku: 'TOOLS-001',
        stock: 40,
        categoryId: categories[2].id,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1596478305367-1a134c4a9bb8?w=300&h=300&fit=crop',
              altText: 'Набор садовых инструментов',
              isPrimary: true
            }
          ]
        }
      }
    }),
    // Sports & Outdoors
    db.product.create({
      data: {
        name: 'Йога-мат Premium',
        description: 'Профессиональный йога-мат из экологичных материалов',
        price: 34.99,
        sku: 'YOGA-001',
        stock: 60,
        categoryId: categories[3].id,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop',
              altText: 'Йога-мат Premium',
              isPrimary: true
            }
          ]
        }
      }
    }),
    db.product.create({
      data: {
        name: 'Велосипед Mountain',
        description: 'Горный велосипед для экстремальных поездок',
        price: 599.99,
        comparePrice: 799.99,
        sku: 'BIKE-001',
        stock: 15,
        categoryId: categories[3].id,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=300&h=300&fit=crop',
              altText: 'Велосипед Mountain',
              isPrimary: true
            }
          ]
        }
      }
    })
  ])

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })