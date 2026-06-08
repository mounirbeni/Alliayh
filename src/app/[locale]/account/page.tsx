"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  Settings,
  LogOut,
  Package,
  CheckCircle2,
  Truck,
  Clock,
  Edit2,
  Crown,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { isValidLocale, type Locale } from "@/i18n/config";
import { localizedPath } from "@/lib/locale-path";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import { PRODUCTS } from "@/app/lib/products";

const MOCK_ORDERS = [
  {
    id: "LS-A7X2Q1",
    date: "28 May 2025",
    items: ["Aura Glow Concentrate", "Luminous Dew Layer"],
    total: 164,
    status: "delivered",
  },
  {
    id: "LS-B3K8M2",
    date: "14 Apr 2025",
    items: ["Silk Radiance Cleanser"],
    total: 48,
    status: "delivered",
  },
  {
    id: "LS-C9P4R3",
    date: "2 Jun 2025",
    items: ["Celestial Recovery Mask"],
    total: 84,
    status: "shipped",
  },
];

const STATUS_ICON: Record<string, React.ElementType> = {
  delivered: CheckCircle2,
  shipped: Truck,
  processing: Clock,
};

const STATUS_COLOR: Record<string, string> = {
  delivered: "text-emerald-600",
  shipped: "text-blue-600",
  processing: "text-amber-600",
};

const PLAN_LABELS: Record<string, { label: string; color: string }> = {
  starter: { label: "Starter", color: "bg-muted text-muted-foreground" },
  growth: { label: "Growth", color: "bg-primary/10 text-primary" },
  elite: { label: "Elite", color: "bg-primary text-primary-foreground" },
};

type Tab = "orders" | "wishlist" | "profile" | "plan";

export default function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = use(params);
  if (!isValidLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const { user, isAuthenticated, logout, updateUser } = useAuthStore();
  const { items: wishlistItems, toggle } = useWishlistStore();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>("orders");
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(localizedPath("/auth/login", locale));
    } else if (user) {
      setEditName(user.name);
      setEditEmail(user.email);
    }
  }, [isAuthenticated, user, router, locale]);

  if (!isAuthenticated || !user) return null;

  const pt = locale === "pt-PT";

  function handleLogout() {
    logout();
    router.push(localizedPath("/", locale));
  }

  function handleSaveProfile() {
    updateUser({ name: editName });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  }

  const planInfo = PLAN_LABELS[user.plan];

  const tabs: Array<{ key: Tab; icon: React.ElementType; label: string }> = [
    { key: "orders", icon: ShoppingBag, label: pt ? "Encomendas" : "Orders" },
    { key: "wishlist", icon: Heart, label: pt ? "Lista de desejos" : "Wishlist" },
    { key: "profile", icon: User, label: pt ? "Perfil" : "Profile" },
    { key: "plan", icon: Crown, label: pt ? "Plano" : "Plan" },
  ];

  const wishedProducts = PRODUCTS.filter((p) => wishlistItems.includes(p.id));

  return (
    <div className="container mx-auto max-w-4xl px-4 py-14">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="font-headline text-3xl">{user.name}</h1>
            <div className="mt-1 flex items-center gap-2">
              <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider", planInfo.color)}>
                {planInfo.label}
              </span>
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="hidden gap-2 text-muted-foreground hover:text-destructive sm:flex"
        >
          <LogOut className="h-4 w-4" />
          {pt ? "Sair" : "Sign out"}
        </Button>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex gap-1 rounded-2xl border border-primary/10 bg-muted/30 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-all",
              activeTab === tab.key
                ? "bg-white shadow-sm text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          <h2 className="font-headline text-2xl">{pt ? "As minhas encomendas" : "My orders"}</h2>
          {MOCK_ORDERS.map((order) => {
            const StatusIcon = STATUS_ICON[order.status];
            return (
              <div key={order.id} className="rounded-2xl border border-primary/10 bg-white/80 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">{order.id}</p>
                    <p className="mt-1 font-semibold">{order.items.join(", ")}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-headline text-xl">€{order.total}</p>
                    <div className={cn("mt-1 flex items-center justify-end gap-1 text-xs font-medium", STATUS_COLOR[order.status])}>
                      <StatusIcon className="h-3.5 w-3.5" />
                      <span className="capitalize">{order.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {MOCK_ORDERS.length === 0 && (
            <div className="py-16 text-center">
              <Package className="mx-auto h-10 w-10 text-muted-foreground/30" />
              <p className="mt-4 text-muted-foreground">{pt ? "Ainda sem encomendas." : "No orders yet."}</p>
              <Button asChild className="mt-4 rounded-full" variant="outline">
                <Link href={localizedPath("/products", locale)}>
                  {pt ? "Ver coleção" : "Browse collection"}
                </Link>
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Wishlist Tab */}
      {activeTab === "wishlist" && (
        <div className="space-y-4">
          <h2 className="font-headline text-2xl">{pt ? "Lista de desejos" : "Wishlist"}</h2>
          {wishedProducts.length === 0 ? (
            <div className="py-16 text-center">
              <Heart className="mx-auto h-10 w-10 text-muted-foreground/30" />
              <p className="mt-4 text-muted-foreground">
                {pt ? "A sua lista de desejos está vazia." : "Your wishlist is empty."}
              </p>
              <Button asChild className="mt-4 rounded-full" variant="outline">
                <Link href={localizedPath("/products", locale)}>
                  {pt ? "Explorar produtos" : "Explore products"}
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {wishedProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-4 rounded-2xl border border-primary/10 bg-white/80 p-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-secondary/40">
                    <Star className="h-5 w-5 text-primary/50" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">Product #{product.id}</p>
                    <p className="text-sm text-primary">€{product.price}</p>
                  </div>
                  <button
                    onClick={() => toggle(product.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Heart className="h-4 w-4 fill-primary text-primary" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="space-y-6 max-w-md">
          <h2 className="font-headline text-2xl">{pt ? "O meu perfil" : "My profile"}</h2>
          <div className="rounded-2xl border border-primary/10 bg-white/80 p-6 space-y-4">
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {pt ? "Nome" : "Name"}
              </label>
              <Input
                className="mt-1 rounded-xl"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Email
              </label>
              <Input
                className="mt-1 rounded-xl"
                value={editEmail}
                disabled
                readOnly
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {pt ? "O email não pode ser alterado." : "Email cannot be changed."}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {pt ? "Membro desde" : "Member since"}
              </label>
              <p className="mt-1 text-sm">{user.createdAt}</p>
            </div>

            {saveSuccess && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                {pt ? "Perfil atualizado." : "Profile updated."}
              </div>
            )}

            <Button onClick={handleSaveProfile} className="rounded-full">
              <Edit2 className="mr-2 h-4 w-4" />
              {pt ? "Guardar alterações" : "Save changes"}
            </Button>
          </div>
        </div>
      )}

      {/* Plan Tab */}
      {activeTab === "plan" && (
        <div className="space-y-6">
          <h2 className="font-headline text-2xl">{pt ? "O meu plano" : "My plan"}</h2>
          <div className="rounded-2xl bg-primary p-7 text-primary-foreground">
            <Crown className="h-8 w-8 text-secondary mb-4" />
            <h3 className="font-headline text-3xl capitalize">{user.plan}</h3>
            <p className="mt-2 text-primary-foreground/70">
              {user.plan === "starter"
                ? (pt ? "Plano gratuito" : "Free plan")
                : user.plan === "growth"
                ? "€49/month"
                : "€199/month"}
            </p>
            <div className="mt-5 flex gap-3">
              <Button
                variant="outline"
                className="rounded-full border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                asChild
              >
                <Link href={localizedPath("/pricing", locale)}>
                  {pt ? "Ver todos os planos" : "View all plans"}
                </Link>
              </Button>
              {user.plan !== "elite" && (
                <Button
                  className="rounded-full bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                  asChild
                >
                  <Link href={localizedPath("/pricing", locale)}>
                    {pt ? "Fazer upgrade" : "Upgrade"}
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-primary/10 bg-white/80 p-5">
            <h3 className="font-semibold mb-3">{pt ? "Recursos do seu plano" : "Your plan includes"}</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              {user.plan === "starter" && ["1 store", "20 products", "10 AI queries/month", "Community support"].map((f) => (
                <p key={f} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {f}
                </p>
              ))}
              {user.plan === "growth" && ["3 stores", "200 products", "Unlimited AI Advisor", "Custom domain", "Priority support"].map((f) => (
                <p key={f} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {f}
                </p>
              ))}
              {user.plan === "elite" && ["Unlimited stores", "Unlimited products", "AI Advisor + training", "White-label", "API access", "24/7 support"].map((f) => (
                <p key={f} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {f}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
