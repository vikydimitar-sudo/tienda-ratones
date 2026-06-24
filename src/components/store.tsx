"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  Address,
  CartItem,
  MailMessage,
  Order,
  User,
} from "@/lib/types";
import type { MouseProduct } from "@/lib/types";
import {
  addItem,
  cartCount,
  cartTotal,
  removeItem,
  setQuantity,
} from "@/lib/cart";
import {
  autenticar,
  loginGoogleSimulado,
  registrarUsuario,
  type RegistroInput,
} from "@/lib/auth";
import { crearPedido } from "@/lib/orders";
import { correoBienvenida, reconciliarCorreos } from "@/lib/mail";
import { readJSON, writeJSON } from "@/lib/storage";

const K_USERS = "rs-users";
const K_SESSION = "rs-session";
const K_CARTS = "rs-carts";
const K_ORDERS = "rs-orders";
const K_WISH = "rs-wishlists";
const K_MAIL = "rs-mailboxes";

type Map<T> = Record<string, T>;

function mergeCarts(base: CartItem[], extra: CartItem[]): CartItem[] {
  let out = base;
  for (const item of extra) {
    const existing = out.find((i) => i.id === item.id);
    out = existing
      ? out.map((i) =>
          i.id === item.id ? { ...i, cantidad: i.cantidad + item.cantidad } : i
        )
      : [...out, item];
  }
  return out;
}

interface StoreValue {
  ready: boolean;
  // auth
  user: User | null;
  register: (input: RegistroInput) => User;
  login: (email: string, password: string) => User;
  loginGoogle: () => User;
  logout: () => void;
  saveAddress: (address: Address) => void;
  // cart
  cart: CartItem[];
  cartTotal: number;
  cartCount: number;
  addToCart: (product: MouseProduct, cantidad?: number) => void;
  removeFromCart: (id: string) => void;
  setCartQty: (id: string, cantidad: number) => void;
  clearCart: () => void;
  // wishlist
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  isWished: (id: string) => boolean;
  // orders
  orders: Order[];
  getOrder: (id: string) => Order | undefined;
  checkout: (data: {
    direccion: Address;
    carrierId: string;
    cardLast4: string;
  }) => Order;
  // mail
  mail: MailMessage[];
  unreadMail: number;
  markMailRead: (id: string) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [carts, setCarts] = useState<Map<CartItem[]>>({});
  const [orders, setOrders] = useState<Map<Order[]>>({});
  const [wishlists, setWishlists] = useState<Map<string[]>>({});
  const [mailboxes, setMailboxes] = useState<Map<MailMessage[]>>({});

  // Hidratar desde localStorage en el cliente.
  useEffect(() => {
    setUsers(readJSON<User[]>(K_USERS, []));
    setSessionId(readJSON<string | null>(K_SESSION, null));
    setCarts(readJSON<Map<CartItem[]>>(K_CARTS, {}));
    setOrders(readJSON<Map<Order[]>>(K_ORDERS, {}));
    setWishlists(readJSON<Map<string[]>>(K_WISH, {}));
    setMailboxes(readJSON<Map<MailMessage[]>>(K_MAIL, {}));
    setReady(true);
  }, []);

  // Persistencia.
  useEffect(() => { if (ready) writeJSON(K_USERS, users); }, [ready, users]);
  useEffect(() => { if (ready) writeJSON(K_SESSION, sessionId); }, [ready, sessionId]);
  useEffect(() => { if (ready) writeJSON(K_CARTS, carts); }, [ready, carts]);
  useEffect(() => { if (ready) writeJSON(K_ORDERS, orders); }, [ready, orders]);
  useEffect(() => { if (ready) writeJSON(K_WISH, wishlists); }, [ready, wishlists]);
  useEffect(() => { if (ready) writeJSON(K_MAIL, mailboxes); }, [ready, mailboxes]);

  const user = useMemo(
    () => users.find((u) => u.id === sessionId) ?? null,
    [users, sessionId]
  );
  const scope = user?.id ?? "guest";

  const cart = useMemo(() => carts[scope] ?? [], [carts, scope]);
  const wishlist = useMemo(() => wishlists[scope] ?? [], [wishlists, scope]);
  const myOrders = useMemo(
    () => (user ? orders[user.id] ?? [] : []),
    [user, orders]
  );
  const mail = useMemo(
    () => (user ? mailboxes[user.id] ?? [] : []),
    [user, mailboxes]
  );

  // Reconciliar correos (confirmación/envío/entrega) según avanza el tiempo.
  useEffect(() => {
    if (!ready || !user) return;
    const run = () => {
      setMailboxes((prev) => {
        const current = prev[user.id] ?? [];
        const next = reconciliarCorreos(orders[user.id] ?? [], current);
        if (next.length === current.length) return prev;
        return { ...prev, [user.id]: next };
      });
    };
    run();
    const t = setInterval(run, 15000);
    return () => clearInterval(t);
  }, [ready, user, orders]);

  const setCartFor = useCallback(
    (s: string, updater: (prev: CartItem[]) => CartItem[]) => {
      setCarts((prev) => ({ ...prev, [s]: updater(prev[s] ?? []) }));
    },
    []
  );

  const afterAuth = useCallback((u: User, baseUsers: User[]) => {
    // Mezcla el carrito de invitado en el del usuario y limpia el de invitado.
    setCarts((prev) => {
      const guest = prev["guest"] ?? [];
      const mine = prev[u.id] ?? [];
      return { ...prev, [u.id]: mergeCarts(mine, guest), guest: [] };
    });
    // Asegura correo de bienvenida.
    setMailboxes((prev) => {
      const mine = prev[u.id] ?? [];
      if (mine.some((m) => m.kind === "bienvenida")) return prev;
      return { ...prev, [u.id]: [correoBienvenida(u), ...mine] };
    });
    setSessionId(u.id);
    void baseUsers;
  }, []);

  const register = useCallback(
    (input: RegistroInput) => {
      const { users: nu, user: u } = registrarUsuario(users, input);
      setUsers(nu);
      afterAuth(u, nu);
      return u;
    },
    [users, afterAuth]
  );

  const login = useCallback(
    (email: string, password: string) => {
      const u = autenticar(users, email, password);
      afterAuth(u, users);
      return u;
    },
    [users, afterAuth]
  );

  const loginGoogle = useCallback(() => {
    const { users: nu, user: u } = loginGoogleSimulado(users);
    setUsers(nu);
    afterAuth(u, nu);
    return u;
  }, [users, afterAuth]);

  const logout = useCallback(() => setSessionId(null), []);

  const saveAddress = useCallback(
    (address: Address) => {
      if (!user) return;
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, direccion: address } : u))
      );
    },
    [user]
  );

  const addToCart = useCallback(
    (product: MouseProduct, cantidad = 1) =>
      setCartFor(scope, (prev) => addItem(prev, product, cantidad)),
    [scope, setCartFor]
  );
  const removeFromCart = useCallback(
    (id: string) => setCartFor(scope, (prev) => removeItem(prev, id)),
    [scope, setCartFor]
  );
  const setCartQty = useCallback(
    (id: string, cantidad: number) =>
      setCartFor(scope, (prev) => setQuantity(prev, id, cantidad)),
    [scope, setCartFor]
  );
  const clearCart = useCallback(
    () => setCartFor(scope, () => []),
    [scope, setCartFor]
  );

  const toggleWishlist = useCallback(
    (id: string) =>
      setWishlists((prev) => {
        const list = prev[scope] ?? [];
        return {
          ...prev,
          [scope]: list.includes(id)
            ? list.filter((x) => x !== id)
            : [...list, id],
        };
      }),
    [scope]
  );
  const isWished = useCallback((id: string) => wishlist.includes(id), [wishlist]);

  const checkout = useCallback(
    (data: { direccion: Address; carrierId: string; cardLast4: string }) => {
      if (!user) throw new Error("Debes iniciar sesión para comprar.");
      const order = crearPedido({
        user,
        items: carts[user.id] ?? [],
        direccion: data.direccion,
        carrierId: data.carrierId,
        cardLast4: data.cardLast4,
      });
      setOrders((prev) => ({
        ...prev,
        [user.id]: [order, ...(prev[user.id] ?? [])],
      }));
      setMailboxes((prev) => {
        const current = prev[user.id] ?? [];
        return { ...prev, [user.id]: reconciliarCorreos([order], current) };
      });
      setCartFor(user.id, () => []);
      return order;
    },
    [user, carts, setCartFor]
  );

  const getOrder = useCallback(
    (id: string) => myOrders.find((o) => o.id === id),
    [myOrders]
  );

  const markMailRead = useCallback(
    (id: string) => {
      if (!user) return;
      setMailboxes((prev) => ({
        ...prev,
        [user.id]: (prev[user.id] ?? []).map((m) =>
          m.id === id ? { ...m, leido: true } : m
        ),
      }));
    },
    [user]
  );

  const value: StoreValue = {
    ready,
    user,
    register,
    login,
    loginGoogle,
    logout,
    saveAddress,
    cart,
    cartTotal: cartTotal(cart),
    cartCount: cartCount(cart),
    addToCart,
    removeFromCart,
    setCartQty,
    clearCart,
    wishlist,
    toggleWishlist,
    isWished,
    orders: myOrders,
    getOrder,
    checkout,
    mail,
    unreadMail: mail.filter((m) => !m.leido).length,
    markMailRead,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore debe usarse dentro de <StoreProvider>");
  return ctx;
}
