"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Search, Eye, User, Calendar, Mail, Phone, MapPin, ShoppingCart } from "lucide-react"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { toast } from "sonner"

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  role: string
  createdAt: string
  orders: {
    id: string
    status: string
    total: number
    createdAt: string
  }[]
  addresses: {
    id: string
    street: string
    city: string
    state: string
    zipCode: string
    country: string
    isDefault: boolean
  }[]
  _count: {
    orders: number
  }
}

const roleLabels = {
  CUSTOMER: "Покупатель",
  ADMIN: "Администратор",
}

const roleColors = {
  CUSTOMER: "bg-blue-100 text-blue-800",
  ADMIN: "bg-red-100 text-red-800",
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/admin/customers")
      if (response.ok) {
        const data = await response.json()
        setCustomers(data)
      }
    } catch (error) {
      console.error("Error fetching customers:", error)
      toast.error("Ошибка при загрузке клиентов")
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsDetailDialogOpen(true)
  }

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getTotalSpent = (orders: Customer['orders']) => {
    return orders.reduce((total, order) => total + order.total, 0)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Клиенты</h1>
          <p className="text-gray-600">Управление клиентами магазина</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Список клиентов
          </CardTitle>
          <CardDescription>
            Всего клиентов: {filteredCustomers.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Поиск по имени, email или телефону..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Имя</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Телефон</TableHead>
                  <TableHead>Роль</TableHead>
                  <TableHead>Заказы</TableHead>
                  <TableHead>Дата регистрации</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">
                      {customer.name}
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone || "-"}</TableCell>
                    <TableCell>
                      <Badge className={roleColors[customer.role as keyof typeof roleColors]}>
                        {roleLabels[customer.role as keyof typeof roleLabels]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="h-4 w-4 text-gray-400" />
                        <span>{customer._count.orders}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {format(new Date(customer.createdAt), "dd.MM.yyyy", { locale: ru })}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewCustomer(customer)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredCustomers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Клиенты не найдены
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Информация о клиенте</DialogTitle>
            <DialogDescription>
              Детальная информация о клиенте и его активности
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Личная информация
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Имя:</strong> {selectedCustomer.name}</div>
                    <div className="flex items-center gap-2">
                      <strong>Email:</strong> 
                      <Mail className="h-4 w-4 text-gray-400" />
                      {selectedCustomer.email}
                    </div>
                    {selectedCustomer.phone && (
                      <div className="flex items-center gap-2">
                        <strong>Телефон:</strong> 
                        <Phone className="h-4 w-4 text-gray-400" />
                        {selectedCustomer.phone}
                      </div>
                    )}
                    <div><strong>Роль:</strong> 
                      <Badge className={`ml-2 ${roleColors[selectedCustomer.role as keyof typeof roleColors]}`}>
                        {roleLabels[selectedCustomer.role as keyof typeof roleLabels]}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <strong>Дата регистрации:</strong> 
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {format(new Date(selectedCustomer.createdAt), "dd.MM.yyyy", { locale: ru })}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Статистика заказов
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Всего заказов:</strong> {selectedCustomer._count.orders}</div>
                    <div>
                      <strong>Общая сумма заказов:</strong> 
                      {getTotalSpent(selectedCustomer.orders).toLocaleString("ru-RU")} ₽
                    </div>
                    <div>
                      <strong>Средний чек:</strong> 
                      {selectedCustomer._count.orders > 0 
                        ? Math.round(getTotalSpent(selectedCustomer.orders) / selectedCustomer._count.orders).toLocaleString("ru-RU") 
                        : 0} ₽
                    </div>
                  </div>
                </div>
              </div>

              {selectedCustomer.addresses.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Адреса
                  </h4>
                  <div className="space-y-3">
                    {selectedCustomer.addresses.map((address) => (
                      <div key={address.id} className="p-3 border rounded-lg">
                        <div className="text-sm">
                          {address.street}, {address.city},<br />
                          {address.state}, {address.zipCode}, {address.country}
                          {address.isDefault && (
                            <Badge className="ml-2" variant="secondary">
                              По умолчанию
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedCustomer.orders.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Последние заказы</h4>
                  <div className="space-y-3">
                    {selectedCustomer.orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">Заказ #{order.id.slice(-8)}</div>
                          <div className="text-sm text-gray-500">
                            {format(new Date(order.createdAt), "dd.MM.yyyy HH:mm", { locale: ru })}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{order.total.toLocaleString("ru-RU")} ₽</div>
                          <Badge variant="outline">{order.status}</Badge>
                        </div>
                      </div>
                    ))}
                    {selectedCustomer.orders.length > 5 && (
                      <p className="text-sm text-gray-500 text-center">
                        Показано 5 из {selectedCustomer.orders.length} заказов
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}