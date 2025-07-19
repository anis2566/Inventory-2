"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image
} from "@react-pdf/renderer";

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

export const InvoiceView = () => {
  const items = [
    { product: "Product A", qty: 2, rate: 50, amount: 100 },
    { product: "Product B", qty: 1, rate: 150, amount: 150 },
  ];

  const subtotal = items.reduce((acc, i) => acc + i.amount, 0);
  const discount = 20;
  const total = subtotal - discount;

  return (
    <Document>
      <Page
        size={{ width: 420.945, height: 595.28 }}
        style={styles.page}
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
            <Text style={{marginBottom: 4, fontWeight: "bold"}}>Invoice No: #INV-001</Text>
            <Text>Date: 2025-07-19</Text>
          </View>
          <View style={styles.row}>
            <Text>Shop: Anis Shop</Text>
          </View>
          <View>
            <Text style={{ marginBottom: 2 }}>armanitola, dhaka</Text>
            <Text style={{ marginBottom: 2 }}>01719-111111</Text>
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
        {items.map((item, idx) => (
          <View style={styles.tableRow} key={idx}>
            <Text style={styles.cell}>{idx + 1}</Text>
            <Text style={styles.cell}>{item.product}</Text>
            <Text style={styles.cell}>{item.qty}</Text>
            <Text style={styles.cell}>{2}</Text>
            <Text style={styles.cell}>{item.rate}</Text>
            <Text style={styles.cell}>{item.amount}</Text>
          </View>
        ))}

        {/* Summary */}
        <View style={styles.summary}>
          <View style={styles.row}>
            <Text>Subtotal:</Text>
            <Text>{subtotal}</Text>
          </View>
          <View style={styles.row}>
            <Text>Total:</Text>
            <Text>{total}</Text>
          </View>
          <Text>In Words: One Hundred Thirty Taka Only</Text>
        </View>

        {/* Footer */}
        <View style={[styles.section, styles.centerText]}>
          <Text>Thank you for your purchase!</Text>
        </View>
      </Page>
    </Document>
  );
};
