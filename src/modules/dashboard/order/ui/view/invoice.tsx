"use client";

import { format } from "date-fns";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image
} from "@react-pdf/renderer";

import { Order } from "@/generated/prisma";
import { numberToWords } from "@/lib/utils";

const styles = StyleSheet.create({
    page: {
        padding: 12,
        fontSize: 10,
        backgroundColor: "#fff",
    },
    centerText: {
        textAlign: "center",
    },
    bold: {
        fontWeight: "bold",
    },
    header: {
        marginBottom: 5,
        position: "relative"
    },
    divider: {
        borderBottomWidth: 1,
        marginVertical: 2,
    },
    section: {
        marginVertical: 4,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 2,
    },
    tableHeader: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderTopWidth: 1,
        paddingVertical: 2,
        backgroundColor: "black",
        color: "white",
    },
    tableRow: {
        flexDirection: "row",
        border: "1px solid black",
        paddingVertical: 2,
        marginBottom: 2,
    },
    cell: {
        flex: 1,
        textAlign: "center",
    },
    summary: {
        marginTop: 8,
        paddingTop: 4,
        borderTopWidth: 1,
    },
});

type OrderOmit = Omit<Order, "createdAt" | "updatedAt" | "date" | "deliveryDate"> & {
    createdAt: string;
    updatedAt: string;
    date: string;
    deliveryDate: string | null;
    shop: {
        name: string,
        address: string,
        phone: string | null
    },
    orderItems: {
        quantity: number
        price: number
        product: {
            name: string
        }
        freeQuantity: number
        total: number
    }[]
};

interface InvoiceProps {
    orders: OrderOmit[]
}

export const Invoice = ({ orders }: InvoiceProps) => {
    return (
        <Document>
            {
                orders.map((order, index) => (
                    <Page
                        size={{ width: 420.945, height: 595.28 }}
                        style={styles.page}
                        key={index}
                    >
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={[styles.centerText, styles.bold, { fontSize: 18 }]}>
                                Hayat Haven Enterprise
                            </Text>
                            <Text style={[styles.centerText, { fontSize: 11 }]}>
                                Dealer: Danish Foods Bangladesh Limited
                            </Text>
                            <Text style={styles.centerText}>11/1, A.C. Roy Road, Armanitola, Dhaka-1100</Text>
                            <Text style={styles.centerText}>Phone: 01887-070720</Text>
                            <Image
                                source="/logo.png"
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 30,
                                    width: 50,
                                    height: 50,
                                }}
                            />
                        </View>

                        <View style={styles.divider} />

                        {/* Customer Info */}
                        <View style={styles.section}>
                            <View style={styles.row}>
                                <Text style={{ marginBottom: 4, fontWeight: "bold" }}>Invoice No: {order.orderId}</Text>
                                <Text>Date: {format(order.date, "dd/MM/yyyy")}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text>Shop: {order.shop.name}</Text>
                            </View>
                            <View>
                                <Text style={{ marginBottom: 2 }}>{order.shop.address}</Text>
                                <Text style={{ marginBottom: 2 }}>{order.shop.phone}</Text>
                            </View>
                        </View>

                        {/* Table Header */}
                        <View style={styles.tableHeader}>
                            <Text style={[styles.cell, styles.bold]}>No</Text>
                            <Text style={[styles.cell, styles.bold]}>Product</Text>
                            <Text style={[styles.cell, styles.bold]}>Qty</Text>
                            <Text style={[styles.cell, styles.bold]}>F. Qty</Text>
                            <Text style={[styles.cell, styles.bold]}>Rate</Text>
                            <Text style={[styles.cell, styles.bold]}>Amount</Text>
                        </View>

                        {/* Table Rows */}
                        {order.orderItems.map((item, idx) => (
                            <View style={styles.tableRow} key={idx}>
                                <Text style={styles.cell}>{idx + 1}</Text>
                                <Text style={styles.cell}>{item.product.name}</Text>
                                <Text style={styles.cell}>{item.quantity}</Text>
                                <Text style={styles.cell}>{item.freeQuantity}</Text>
                                <Text style={styles.cell}>{item.price}</Text>
                                <Text style={styles.cell}>{item.total}</Text>
                            </View>
                        ))}

                        {/* Summary */}
                        <View style={styles.summary}>
                            <View style={styles.row}>
                                <Text>Subtotal:</Text>
                                <Text>{order.totalAmount}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text>Total:</Text>
                                <Text>{order.totalAmount}</Text>
                            </View>
                            <Text>In Words: {numberToWords(order.totalAmount)}</Text>
                        </View>

                        {/* Footer */}
                        <View style={[styles.section, styles.centerText]}>
                            <Text>Thank you for your purchase!</Text>
                        </View>
                    </Page>
                ))
            }
        </Document>
    );
};
