"use client";

import { AccentProvider } from "@/contexts/AccentContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { CustomersProvider } from "@/contexts/CustomersContext";
import { ProductsProvider } from "@/contexts/ProductsContext";
import { OrdersProvider } from "@/contexts/OrdersContext";
import { FinanceProvider } from "@/contexts/FinanceContext";
import { MarketingProvider } from "@/contexts/MarketingContext";
import { TeamProvider } from "@/contexts/TeamContext";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AccentProvider>
      <CurrencyProvider>
        <SidebarProvider>
          <CustomersProvider>
            <ProductsProvider>
              <OrdersProvider>
              <FinanceProvider>
                <MarketingProvider>
                <TeamProvider>
                  <NotificationsProvider>
                    <SettingsProvider>{children}</SettingsProvider>
                  </NotificationsProvider>
                </TeamProvider>
              </MarketingProvider>
              </FinanceProvider>
              </OrdersProvider>
            </ProductsProvider>
          </CustomersProvider>
        </SidebarProvider>
      </CurrencyProvider>
    </AccentProvider>
  );
}
