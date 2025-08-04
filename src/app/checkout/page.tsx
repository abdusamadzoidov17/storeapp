'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { ShoppingCart, Truck, CreditCard, Shield, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cart'

type CheckoutStep = 'shipping' | 'payment' | 'review'

interface ShippingFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  notes?: string
}

interface PaymentFormData {
  method: 'card' | 'cash' | 'bank'
  cardNumber?: string
  cardExpiry?: string
  cardCvc?: string
  cardName?: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping')
  const [loading, setLoading] = useState(false)
  const [shippingData, setShippingData] = useState<ShippingFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Россия',
    notes: ''
  })
  const [paymentData, setPaymentData] = useState<PaymentFormData>({
    method: 'card'
  })

  if (items.length === 0) {
    router.push('/cart')
    return null
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentStep('payment')
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentStep('review')
  }

  const handlePlaceOrder = async () => {
    setLoading(true)
    try {
      // TODO: Implement order creation API call
      console.log('Placing order:', {
        shipping: shippingData,
        payment: paymentData,
        items,
        total: getTotalPrice()
      })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      clearCart()
      router.push('/order-success')
    } catch (error) {
      console.error('Error placing order:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStepIndicator = () => {
    const steps: CheckoutStep[] = ['shipping', 'payment', 'review']
    const stepLabels = {
      shipping: 'Доставка',
      payment: 'Оплата',
      review: 'Подтверждение'
    }

    return (
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                currentStep === step
                  ? 'bg-blue-600 text-white border-blue-600'
                  : steps.indexOf(currentStep) > index
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-gray-100 text-gray-400 border-gray-300'
              }`}
            >
              {steps.indexOf(currentStep) > index ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <span className={`ml-2 font-medium ${
              currentStep === step ? 'text-blue-600' : steps.indexOf(currentStep) > index ? 'text-green-600' : 'text-gray-400'
            }`}>
              {stepLabels[step]}
            </span>
            {index < steps.length - 1 && (
              <div className={`w-16 h-0.5 mx-4 ${
                steps.indexOf(currentStep) > index ? 'bg-green-600' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Главная</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/cart">Корзина</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Оформление заказа</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Оформление заказа</h1>
          
          {renderStepIndicator()}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {currentStep === 'shipping' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Truck className="mr-2 h-5 w-5" />
                      Информация о доставке
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleShippingSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">Имя *</Label>
                          <Input
                            id="firstName"
                            value={shippingData.firstName}
                            onChange={(e) => setShippingData(prev => ({ ...prev, firstName: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Фамилия *</Label>
                          <Input
                            id="lastName"
                            value={shippingData.lastName}
                            onChange={(e) => setShippingData(prev => ({ ...prev, lastName: e.target.value }))}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={shippingData.email}
                            onChange={(e) => setShippingData(prev => ({ ...prev, email: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Телефон *</Label>
                          <Input
                            id="phone"
                            value={shippingData.phone}
                            onChange={(e) => setShippingData(prev => ({ ...prev, phone: e.target.value }))}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="street">Адрес *</Label>
                        <Input
                          id="street"
                          value={shippingData.street}
                          onChange={(e) => setShippingData(prev => ({ ...prev, street: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="city">Город *</Label>
                          <Input
                            id="city"
                            value={shippingData.city}
                            onChange={(e) => setShippingData(prev => ({ ...prev, city: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">Область/Регион *</Label>
                          <Input
                            id="state"
                            value={shippingData.state}
                            onChange={(e) => setShippingData(prev => ({ ...prev, state: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="zipCode">Почтовый индекс *</Label>
                          <Input
                            id="zipCode"
                            value={shippingData.zipCode}
                            onChange={(e) => setShippingData(prev => ({ ...prev, zipCode: e.target.value }))}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="country">Страна *</Label>
                        <Select value={shippingData.country} onValueChange={(value) => setShippingData(prev => ({ ...prev, country: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Россия">Россия</SelectItem>
                            <SelectItem value="Беларусь">Беларусь</SelectItem>
                            <SelectItem value="Казахстан">Казахстан</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="notes">Комментарий к заказу</Label>
                        <Textarea
                          id="notes"
                          value={shippingData.notes}
                          onChange={(e) => setShippingData(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="Дополнительная информация о доставке..."
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button type="submit">
                          Продолжить
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {currentStep === 'payment' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="mr-2 h-5 w-5" />
                      Способ оплаты
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePaymentSubmit} className="space-y-6">
                      <RadioGroup
                        value={paymentData.method}
                        onValueChange={(value) => setPaymentData(prev => ({ ...prev, method: value as PaymentFormData['method'] }))}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card" className="cursor-pointer">Банковская карта</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="cash" id="cash" />
                          <Label htmlFor="cash" className="cursor-pointer">Наличные при получении</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="bank" id="bank" />
                          <Label htmlFor="bank" className="cursor-pointer">Банковский перевод</Label>
                        </div>
                      </RadioGroup>

                      {paymentData.method === 'card' && (
                        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                          <div>
                            <Label htmlFor="cardName">Имя на карте *</Label>
                            <Input
                              id="cardName"
                              value={paymentData.cardName || ''}
                              onChange={(e) => setPaymentData(prev => ({ ...prev, cardName: e.target.value }))}
                              placeholder="IVAN IVANOV"
                              required={paymentData.method === 'card'}
                            />
                          </div>
                          <div>
                            <Label htmlFor="cardNumber">Номер карты *</Label>
                            <Input
                              id="cardNumber"
                              value={paymentData.cardNumber || ''}
                              onChange={(e) => setPaymentData(prev => ({ ...prev, cardNumber: e.target.value }))}
                              placeholder="0000 0000 0000 0000"
                              maxLength={19}
                              required={paymentData.method === 'card'}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="cardExpiry">Срок действия *</Label>
                              <Input
                                id="cardExpiry"
                                value={paymentData.cardExpiry || ''}
                                onChange={(e) => setPaymentData(prev => ({ ...prev, cardExpiry: e.target.value }))}
                                placeholder="MM/YY"
                                maxLength={5}
                                required={paymentData.method === 'card'}
                              />
                            </div>
                            <div>
                              <Label htmlFor="cardCvc">CVC *</Label>
                              <Input
                                id="cardCvc"
                                value={paymentData.cardCvc || ''}
                                onChange={(e) => setPaymentData(prev => ({ ...prev, cardCvc: e.target.value }))}
                                placeholder="000"
                                maxLength={3}
                                required={paymentData.method === 'card'}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setCurrentStep('shipping')}
                        >
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Назад
                        </Button>
                        <Button type="submit">
                          Продолжить
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {currentStep === 'review' && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Подтверждение заказа</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">Доставка</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p>{shippingData.firstName} {shippingData.lastName}</p>
                          <p>{shippingData.street}</p>
                          <p>{shippingData.city}, {shippingData.state} {shippingData.zipCode}</p>
                          <p>{shippingData.country}</p>
                          <p className="mt-2">Телефон: {shippingData.phone}</p>
                          <p>Email: {shippingData.email}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2">Оплата</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p>
                            {paymentData.method === 'card' && 'Банковская карта'}
                            {paymentData.method === 'cash' && 'Наличные при получении'}
                            {paymentData.method === 'bank' && 'Банковский перевод'}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2">Товары</h3>
                        <div className="space-y-2">
                          {items.map((item) => (
                            <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                              <div>
                                <p className="font-medium">{item.product.name}</p>
                                <p className="text-sm text-gray-600">
                                  {item.variant && `${item.variant.name}: ${item.variant.value}`}
                                </p>
                                <p className="text-sm text-gray-600">Количество: {item.quantity}</p>
                              </div>
                              <p className="font-semibold">
                                ${((item.variant ? item.product.price + item.variant.priceAdjust : item.product.price) * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep('payment')}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Назад
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {loading ? 'Обработка...' : 'Подтвердить заказ'}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Состав заказа
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <div className="flex-1">
                          <p className="font-medium line-clamp-2">{item.product.name}</p>
                          <p className="text-gray-600">× {item.quantity}</p>
                        </div>
                        <p className="font-semibold">
                          ${((item.variant ? item.product.price + item.variant.priceAdjust : item.product.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Товары</span>
                      <span>${getTotalPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Доставка</span>
                      <span className="text-green-600">Бесплатно</span>
                    </div>
                    <div className="flex justify-between">
                      <span>НДС</span>
                      <span>${(getTotalPrice() * 0.2).toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Итого</span>
                      <span>${getTotalPrice().toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-start">
                      <Shield className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-semibold mb-1">Безопасная покупка</p>
                        <p>Ваши данные защищены и не передаются третьим лицам</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}