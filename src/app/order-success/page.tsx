'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, ShoppingBag, Truck, Home } from 'lucide-react'

export default function OrderSuccessPage() {
  useEffect(() => {
    // Clear any remaining cart data if needed
    const timer = setTimeout(() => {
      // Additional cleanup if needed
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-green-600">Заказ успешно оформлен!</CardTitle>
          <p className="text-gray-600">
            Спасибо за ваш заказ. Мы приняли его и начали обработку.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="flex items-center">
              <ShoppingBag className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <p className="font-medium">Номер заказа</p>
                <p className="text-sm text-gray-600">#12345</p>
              </div>
            </div>
            <div className="flex items-center">
              <Truck className="h-5 w-5 text-purple-600 mr-3" />
              <div>
                <p className="font-medium">Ожидаемая доставка</p>
                <p className="text-sm text-gray-600">2-5 рабочих дней</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Что дальше?</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Вы получите email с подтверждением заказа</li>
              <li>• Мы свяжемся с вами для уточнения деталей доставки</li>
              <li>• Вы можете отслеживать статус заказа в личном кабинете</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Link href="/products" className="block">
              <Button className="w-full">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Продолжить покупки
              </Button>
            </Link>
            <Link href="/" className="block">
              <Button variant="outline" className="w-full">
                <Home className="mr-2 h-4 w-4" />
                Вернуться на главную
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}