"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { orders as seedOrders, type Order, type OrderStatus } from "@/lib/data/orders";

function paymentForStatus(status: OrderStatus): Order["paymentStatus"] {
  switch (status) {
    case "completed":
    case "processing":
      return "paid";
    case "refunded":
      return "refunded";
    case "cancelled":
    case "pending":
      return "pending";
  }
}

interface OrdersContextValue {
  orders: Order[];
  getOrder: (id: string) => Order | undefined;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  refundOrder: (id: string) => void;
  cancelOrder: (id: string) => void;
  markOrdersCompleted: (ids: string[]) => void;
}

const OrdersContext = createContext<OrdersContextValue | null>(null);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(seedOrders);

  function getOrder(id: string) {
    return orders.find((o) => o.id === id);
  }

  function updateOrderStatus(id: string, status: OrderStatus) {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, orderStatus: status, paymentStatus: paymentForStatus(status) } : o
      )
    );
  }

  function refundOrder(id: string) {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? { ...o, orderStatus: "refunded", paymentStatus: "refunded" }
          : o
      )
    );
  }

  function cancelOrder(id: string) {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? { ...o, orderStatus: "cancelled", paymentStatus: "pending" }
          : o
      )
    );
  }

  function markOrdersCompleted(ids: string[]) {
    setOrders((prev) =>
      prev.map((o) =>
        ids.includes(o.id)
          ? { ...o, orderStatus: "completed", paymentStatus: "paid" }
          : o
      )
    );
  }

  return (
    <OrdersContext.Provider
      value={{
        orders,
        getOrder,
        updateOrderStatus,
        refundOrder,
        cancelOrder,
        markOrdersCompleted,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
}
