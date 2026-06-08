"use client";

import { use, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  Settings,
  LogOut,
  Home,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  MoreHorizontal,
  Layers,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { isValidLocale, type Locale } from "@/i18n/config";
import { localizedPath } from "@/lib/locale-path";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const MOCK_STATS = [
  { label: "Revenue (MTD)", value: "€12,847", change: "+18.4%", up: true, icon: TrendingUp },
  { label: "Orders (MTD)", value: "47", change: "+12.1%", up: true, icon: ShoppingBag },
  { label: "Customers", value: "1,284", change: "+5.6%", up: true, icon: Users },
  { label: "Products Active", value: "4", change: "0%", up: true, icon: Package },
];

const MOCK_ORDERS = [
  { id: "LS-A7X2Q1", customer: "Sofia Laurent", product: "Aura Glow Concentrate + Dew Layer", total: 164, status: "delivered", date: "28 May" },
  { id: "LS-B3K8M2", customer: "Marta Silva", product: "Silk Radiance Cleanser", total: 48, status: "shipped", date: "30 May" },
  { id: "LS-C9P4R3", customer: "Ines Carvalho", product: "Celestial Recovery Mask + Serum", total: 176, status: "processing", date: "1 Jun" },
  { id: "LS-D2N6S4", customer: "Ana Rodrigues", product: "Luminous Dew Layer", total: 72, status: "delivered", date: "2 Jun" },
  { id: "LS-E5T1V5", customer: "Clara Mendes", product: "Full Ritual Set (×4)", total: 296, status: "processing", date: "4 Jun" },
  { id: "LS-F8W3Y6", customer: "Beatriz Costa", product: "Aura Glow Concentrate", total: 92, status: "shipped", date: "5 Jun" },
];

const MOCK_PRODUCTS = [
  { id: "1", name: "Aura Glow Concentrate", category: "Serums", price: 92, stock: 48, sales: 312, rating: 4.9 },
  { id: "2", name: "Luminous Dew Layer", category: "Moisturizers", price: 72, stock: 34, sales: 185, rating: 4.7 },
  { id: "3", name: "Silk Radiance Cleanser", category: "Cleansers", price: 48, stock: 62, sales: 124, rating: 4.8 },
  { id: "4", name: "Celestial Recovery Mask", category: "Masks", price: 84, stock: 27, sales: 89, rating: 4.9 },
];

const STATUS_STYLES: Record<string, string> = {
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  shipped: "bg-blue-50 text-blue-700 border-blue-200",
  processing: "bg-amber-50 text-amber-700 border-amber-200",
};

export default function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = use(params);
  if (!isValidLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.replace(localizedPath("/auth/login", locale));
    }
  }, [isAuthenticated, user, router, locale]);

  if (!isAuthenticated || user?.role !== "admin") return null;

  const pt = locale === "pt-PT";

  function handleLogout() {
    logout();
    router.push(localizedPath("/", locale));
  }

  const sidebarItems = [
    { icon: Home, label: pt ? "Início" : "Overview", active: true },
    { icon: ShoppingBag, label: pt ? "Encomendas" : "Orders", count: 3 },
    { icon: Package, label: pt ? "Produtos" : "Products" },
    { icon: Users, label: pt ? "Clientes" : "Customers" },
    { icon: BarChart3, label: pt ? "Analytics" : "Analytics" },
    { icon: Bell, label: pt ? "Notificações" : "Notifications", count: 2 },
    { icon: Settings, label: pt ? "Definições" : "Settings" },
  ];

  return (
    <div className="flex min-h-[calc(100vh-5rem)]">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-primary/10 bg-foreground/[0.02] md:flex">
        <div className="p-5">
          <div className="flex items-center gap-3 rounded-2xl bg-primary/8 px-3 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{user.plan}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                item.active
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.count && (
                <span className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                  item.active ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/10 text-primary"
                )}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-destructive/5 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            {pt ? "Sair" : "Sign out"}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-primary/10 bg-background px-6 py-4">
          <div>
            <h1 className="font-headline text-2xl">{pt ? "Painel de controlo" : "Dashboard"}</h1>
            <p className="text-xs text-muted-foreground">
              {pt ? `Bem-vindo, ${user.name}` : `Welcome back, ${user.name}`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="rounded-full" asChild>
              <Link href={localizedPath("/products", locale)}>
                <Eye className="mr-1.5 h-3.5 w-3.5" />
                {pt ? "Ver loja" : "View store"}
              </Link>
            </Button>
            <Button size="sm" className="rounded-full">
              <Package className="mr-1.5 h-3.5 w-3.5" />
              {pt ? "Novo produto" : "New product"}
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Stats grid */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {MOCK_STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-primary/10 bg-white/80 p-5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/8">
                    <stat.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className={cn(
                    "flex items-center gap-0.5 text-xs font-semibold",
                    stat.up ? "text-emerald-600" : "text-destructive"
                  )}>
                    {stat.up
                      ? <ArrowUpRight className="h-3 w-3" />
                      : <ArrowDownRight className="h-3 w-3" />
                    }
                    {stat.change}
                  </span>
                </div>
                <p className="mt-3 font-headline text-3xl">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Revenue chart placeholder */}
          <div className="rounded-2xl border border-primary/10 bg-white/80 p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-semibold">{pt ? "Receita" : "Revenue"}</h2>
                <p className="text-xs text-muted-foreground">{pt ? "Últimos 30 dias" : "Last 30 days"}</p>
              </div>
              <div className="flex gap-2">
                {["7D", "30D", "90D", "1Y"].map((range, i) => (
                  <button
                    key={range}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-xs font-medium transition",
                      i === 1
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-primary/5"
                    )}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            {/* Bars */}
            <div className="flex h-32 items-end gap-1.5">
              {[40, 65, 45, 80, 55, 90, 72, 85, 60, 95, 78, 88, 70, 92, 65, 84, 74, 96, 68, 88, 76, 91, 62, 85, 79, 93, 67, 87, 73, 97].map((h, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex-1 rounded-sm transition-opacity hover:opacity-80",
                    h > 80 ? "bg-primary" : "bg-primary/30"
                  )}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="mt-3 flex justify-between text-[10px] text-muted-foreground">
              <span>{pt ? "10 Mai" : "10 May"}</span>
              <span>{pt ? "Hoje" : "Today"}</span>
            </div>
          </div>

          {/* Orders + Products side by side */}
          <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
            {/* Recent Orders */}
            <div className="rounded-2xl border border-primary/10 bg-white/80 p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold">{pt ? "Encomendas recentes" : "Recent orders"}</h2>
                <Button variant="ghost" size="sm" className="text-xs text-primary">
                  {pt ? "Ver todas" : "View all"}
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-primary/8 text-xs text-muted-foreground">
                      <th className="pb-2.5 text-left font-medium">ID</th>
                      <th className="pb-2.5 text-left font-medium">{pt ? "Cliente" : "Customer"}</th>
                      <th className="pb-2.5 text-left font-medium hidden sm:table-cell">{pt ? "Produto" : "Product"}</th>
                      <th className="pb-2.5 text-right font-medium">Total</th>
                      <th className="pb-2.5 text-center font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/5">
                    {MOCK_ORDERS.map((order) => (
                      <tr key={order.id} className="hover:bg-primary/2">
                        <td className="py-3 font-mono text-[11px] text-muted-foreground">{order.id}</td>
                        <td className="py-3 font-medium">{order.customer}</td>
                        <td className="py-3 max-w-[200px] truncate text-muted-foreground hidden sm:table-cell">{order.product}</td>
                        <td className="py-3 text-right font-semibold">€{order.total}</td>
                        <td className="py-3 text-center">
                          <span className={cn(
                            "rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                            STATUS_STYLES[order.status]
                          )}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Products */}
            <div className="rounded-2xl border border-primary/10 bg-white/80 p-5 w-full lg:w-72">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold">{pt ? "Produtos top" : "Top products"}</h2>
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-4">
                {MOCK_PRODUCTS.map((product, i) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <span className="w-4 shrink-0 text-xs font-bold text-muted-foreground/40">
                      {i + 1}
                    </span>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/40">
                      <Layers className="h-4 w-4 text-primary/60" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium">{product.name}</p>
                      <p className="text-[10px] text-muted-foreground">{product.sales} {pt ? "vendas" : "sales"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">€{product.price}</p>
                      <div className="flex items-center justify-end gap-0.5">
                        <Star className="h-2.5 w-2.5 fill-primary text-primary" />
                        <span className="text-[10px] text-muted-foreground">{product.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Plan banner */}
          <div className="rounded-2xl bg-primary p-6 text-primary-foreground">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-luxury text-primary-foreground/60 mb-1">
                  {pt ? "Plano atual" : "Current plan"}
                </p>
                <h3 className="font-headline text-2xl capitalize">{user.plan}</h3>
                <p className="mt-1 text-sm text-primary-foreground/70">
                  {pt ? "Acesso total a todas as funcionalidades Elite" : "Full access to all Elite features"}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                asChild
              >
                <Link href={localizedPath("/pricing", locale)}>
                  {pt ? "Ver planos" : "View plans"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
