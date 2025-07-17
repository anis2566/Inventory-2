import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Order } from "@/generated/prisma"
import { Eye } from "lucide-react"
import Link from "next/link"

type OrderOmit = Omit<Order, "createdAt" | "updatedAt"> & {
    createdAt: string
    updatedAt: string
    shop: { name: string }
    _count: { orderItems: number }
}

interface RecentOrdersProps {
    orders: OrderOmit[]
}

export const RecentOrders = ({ orders }: RecentOrdersProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-700">
                            <TableHead className="w-[100px]">Shop</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            orders.map(order => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.shop.name}</TableCell>
                                    <TableCell>{order._count.orderItems}</TableCell>
                                    <TableCell>{order.totalQuantity}</TableCell>
                                    <TableCell className="font-bengali tracking-wider">৳{order.totalAmount}</TableCell>
                                    <TableCell>
                                        <Button asChild variant="ghost" size="icon" className="hover:bg-gray-700 group">
                                            <Link href={`/order/${order.id}`} prefetch>
                                                <Eye className="w-4 h-4 group-hover:text-white" />
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}