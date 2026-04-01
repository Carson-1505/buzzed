"use client";

import { useMemo, useState } from "react";

type Choice = {
  name: string;
  price: number;
};

type OptionGroup = {
  name: string;
  choices: Choice[];
};

type Addon = {
  name: string;
  price: number;
};

type DrinkCategory =
  | "Beer"
  | "Cocktails"
  | "Seltzers"
  | "Shots"
  | "Wine";

type Drink = {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  category: DrinkCategory;
  emoji: string;
  options?: OptionGroup[];
  addons?: Addon[];
};

type CartItem = {
  id: string;
  drinkId: number;
  name: string;
  description: string;
  quantity: number;
  selectedOptions: Record<string, Choice>;
  selectedAddons: Addon[];
  unitPrice: number;
};

const drinks: Drink[] = [
  {
    id: 1,
    name: "Beer",
    description: "Choose your beer",
    basePrice: 5,
    category: "Beer",
    emoji: "🍺",
    options: [
      {
        name: "Beer Type",
        choices: [
          { name: "Bud Light", price: 0 },
          { name: "Coors Light", price: 0 },
          { name: "Miller Lite", price: 0 },
          { name: "Michelob Ultra", price: 1 },
          { name: "Modelo", price: 1 },
          { name: "Corona", price: 1 },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Margarita",
    description: "Frozen or rocks with flavor options",
    basePrice: 12,
    category: "Cocktails",
    emoji: "🍹",
    options: [
      {
        name: "Style",
        choices: [
          { name: "On the Rocks", price: 0 },
          { name: "Frozen", price: 1 },
        ],
      },
      {
        name: "Rim",
        choices: [
          { name: "No Rim", price: 0 },
          { name: "Salt Rim", price: 0 },
          { name: "Sugar Rim", price: 0 },
        ],
      },
      {
        name: "Flavor",
        choices: [
          { name: "Classic", price: 0 },
          { name: "Strawberry", price: 1 },
          { name: "Mango", price: 1 },
        ],
      },
    ],
    addons: [
      { name: "Extra Shot", price: 3 },
      { name: "Top Shelf Tequila", price: 4 },
    ],
  },
  {
    id: 3,
    name: "Vodka Soda",
    description: "Light, crisp, and customizable",
    basePrice: 10,
    category: "Cocktails",
    emoji: "🥤",
    options: [
      {
        name: "Vodka",
        choices: [
          { name: "Tito's", price: 0 },
          { name: "Grey Goose", price: 3 },
          { name: "Ketel One", price: 2 },
        ],
      },
      {
        name: "Lime",
        choices: [
          { name: "With Lime", price: 0 },
          { name: "No Lime", price: 0 },
        ],
      },
    ],
    addons: [
      { name: "Extra Shot", price: 3 },
      { name: "Splash of Cranberry", price: 1 },
    ],
  },
  {
    id: 4,
    name: "Old Fashioned",
    description: "A classic whiskey cocktail",
    basePrice: 13,
    category: "Cocktails",
    emoji: "🥃",
    options: [
      {
        name: "Whiskey",
        choices: [
          { name: "House Bourbon", price: 0 },
          { name: "Woodford Reserve", price: 3 },
          { name: "Maker's Mark", price: 2 },
        ],
      },
    ],
  },
  {
    id: 5,
    name: "White Claw",
    description: "Choose your flavor",
    basePrice: 6,
    category: "Seltzers",
    emoji: "🫧",
    options: [
      {
        name: "Flavor",
        choices: [
          { name: "Black Cherry", price: 0 },
          { name: "Mango", price: 0 },
          { name: "Lime", price: 0 },
          { name: "Watermelon", price: 0 },
        ],
      },
    ],
  },
  {
    id: 6,
    name: "Lemon Drop Shot",
    description: "Sweet, tart, and quick",
    basePrice: 7,
    category: "Shots",
    emoji: "🥂",
    options: [
      {
        name: "Sugar Rim",
        choices: [
          { name: "Yes", price: 0 },
          { name: "No", price: 0 },
        ],
      },
    ],
  },
];

const categories: ("All" | DrinkCategory)[] = [
  "All",
  "Beer",
  "Cocktails",
  "Seltzers",
  "Shots",
  "Wine",
];

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, Choice>>(
    {}
  );
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [activeCategory, setActiveCategory] = useState<"All" | DrinkCategory>(
    "All"
  );

  function openCustomizer(drink: Drink) {
    const defaultOptions: Record<string, Choice> = {};

    drink.options?.forEach((group) => {
      defaultOptions[group.name] = group.choices[0];
    });

    setSelectedDrink(drink);
    setSelectedOptions(defaultOptions);
    setSelectedAddons([]);
  }

  function closeCustomizer() {
    setSelectedDrink(null);
    setSelectedOptions({});
    setSelectedAddons([]);
  }

  function chooseOption(groupName: string, choice: Choice) {
    setSelectedOptions((current) => ({
      ...current,
      [groupName]: choice,
    }));
  }

  function toggleAddon(addon: Addon) {
    setSelectedAddons((current) => {
      const exists = current.some((item) => item.name === addon.name);

      if (exists) {
        return current.filter((item) => item.name !== addon.name);
      }

      return [...current, addon];
    });
  }

  function addCustomizedDrinkToCart() {
    if (!selectedDrink) return;

    const optionsPrice = Object.values(selectedOptions).reduce(
      (sum, choice) => sum + choice.price,
      0
    );

    const addonsPrice = selectedAddons.reduce(
      (sum, addon) => sum + addon.price,
      0
    );

    const unitPrice = selectedDrink.basePrice + optionsPrice + addonsPrice;

    const cartId = `${selectedDrink.id}-${JSON.stringify(
      selectedOptions
    )}-${JSON.stringify(selectedAddons.map((addon) => addon.name).sort())}`;

    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === cartId);

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === cartId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [
        ...currentCart,
        {
          id: cartId,
          drinkId: selectedDrink.id,
          name: selectedDrink.name,
          description: selectedDrink.description,
          quantity: 1,
          selectedOptions: { ...selectedOptions },
          selectedAddons: [...selectedAddons],
          unitPrice,
        },
      ];
    });

    closeCustomizer();
  }

  function increaseQuantity(cartId: string) {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === cartId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }

  function decreaseQuantity(cartId: string) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === cartId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  const filteredDrinks = useMemo(() => {
    if (activeCategory === "All") return drinks;
    return drinks.filter((drink) => drink.category === activeCategory);
  }, [activeCategory]);

  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const totalPrice = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }, [cart]);

  const customizerPrice = useMemo(() => {
    if (!selectedDrink) return 0;

    const optionsPrice = Object.values(selectedOptions).reduce(
      (sum, choice) => sum + choice.price,
      0
    );

    const addonsPrice = selectedAddons.reduce(
      (sum, addon) => sum + addon.price,
      0
    );

    return selectedDrink.basePrice + optionsPrice + addonsPrice;
  }, [selectedDrink, selectedOptions, selectedAddons]);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {!showCart ? (
        <div className="mx-auto flex min-h-screen w-full max-w-md flex-col">
          <section className="relative overflow-hidden rounded-b-[2rem] bg-gradient-to-b from-yellow-300 via-yellow-400 to-amber-500 px-5 pb-6 pt-6 text-black shadow-xl">
            <div className="absolute left-0 right-0 top-0 h-6 bg-yellow-200 opacity-60 blur-md" />
            <div className="absolute -bottom-3 left-6 h-10 w-16 rounded-b-full bg-yellow-300" />
            <div className="absolute -bottom-4 left-24 h-12 w-20 rounded-b-full bg-yellow-300" />
            <div className="absolute -bottom-2 right-10 h-8 w-14 rounded-b-full bg-yellow-300" />

            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-black/70">
                    Buzzed
                  </p>
                  <h1 className="mt-1 text-4xl font-black tracking-tight">
                    Order Drinks
                  </h1>
                  <p className="mt-2 max-w-[220px] text-sm text-black/70">
                    Fast mobile ordering with a honey-smooth vibe.
                  </p>
                </div>

                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-black text-4xl shadow-lg">
                  🐝
                </div>
              </div>

              <div className="mt-5 rounded-3xl bg-black/10 p-4 backdrop-blur">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-black/60">
                      Location
                    </p>
                    <p className="mt-1 text-lg font-bold">Table 12</p>
                  </div>

                  <div className="rounded-2xl bg-black px-4 py-2 text-sm font-semibold text-yellow-300 shadow-md">
                    {totalItems} item{totalItems === 1 ? "" : "s"}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="px-4 pt-5">
            <div className="rounded-3xl border border-yellow-500/20 bg-[#121212] p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Current Cart</p>
                  <p className="mt-1 text-2xl font-bold text-white">
                    ${totalPrice.toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={() => setShowCart(true)}
                  className="rounded-2xl bg-yellow-400 px-4 py-3 text-sm font-bold text-black shadow-[0_0_25px_rgba(250,204,21,0.35)] transition hover:scale-[1.02]"
                >
                  View Cart
                </button>
              </div>
            </div>
          </section>

          <section className="px-4 pt-5">
            <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
              {categories.map((category) => {
                const active = activeCategory === category;

                return (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      active
                        ? "border-yellow-400 bg-yellow-400 text-black"
                        : "border-yellow-500/20 bg-[#121212] text-zinc-300"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="flex-1 px-4 pb-28 pt-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Menu</h2>
              <p className="text-sm text-zinc-500">{filteredDrinks.length} items</p>
            </div>

            <div className="space-y-4">
              {filteredDrinks.map((drink) => (
                <button
                  key={drink.id}
                  onClick={() => openCustomizer(drink)}
                  className="w-full rounded-[1.75rem] border border-yellow-500/15 bg-[#121212] p-4 text-left shadow-lg transition hover:-translate-y-0.5 hover:border-yellow-400/40"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 to-amber-500 text-3xl shadow-md">
                      {drink.emoji}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-yellow-400/70">
                            {drink.category}
                          </p>
                          <h3 className="mt-1 text-lg font-bold">{drink.name}</h3>
                        </div>

                        <div className="rounded-full bg-black px-3 py-1 text-sm font-bold text-yellow-300">
                          From ${drink.basePrice}
                        </div>
                      </div>

                      <p className="mt-2 text-sm leading-5 text-zinc-400">
                        {drink.description}
                      </p>

                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-sm font-medium text-zinc-500">
                          Tap to customize
                        </p>
                        <div className="rounded-full bg-yellow-400 px-4 py-2 text-sm font-bold text-black">
                          Add
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <div className="fixed bottom-4 left-1/2 z-40 w-full max-w-md -translate-x-1/2 px-4">
            <button
              onClick={() => setShowCart(true)}
              className="flex w-full items-center justify-between rounded-[1.5rem] bg-yellow-400 px-5 py-4 text-black shadow-[0_12px_35px_rgba(250,204,21,0.35)] transition hover:scale-[1.01]"
            >
              <span className="font-black">Cart</span>
              <span className="rounded-full bg-black px-3 py-1 text-sm font-bold text-yellow-300">
                {totalItems} item{totalItems === 1 ? "" : "s"}
              </span>
            </button>
          </div>
        </div>
      ) : (
        <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 py-6">
          <header className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-yellow-400/70">
                Buzzed
              </p>
              <h1 className="mt-1 text-3xl font-black">Your Cart</h1>
            </div>

            <button
              onClick={() => setShowCart(false)}
              className="rounded-2xl border border-yellow-500/20 bg-[#121212] px-4 py-2 text-sm font-semibold"
            >
              Back
            </button>
          </header>

          <section className="flex-1">
            {cart.length === 0 ? (
              <div className="rounded-[2rem] border border-yellow-500/15 bg-[#121212] p-8 text-center shadow-lg">
                <div className="text-5xl">🐝</div>
                <p className="mt-4 text-xl font-bold">Your cart is empty</p>
                <p className="mt-2 text-sm text-zinc-400">
                  Add some drinks and get the buzz started.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[1.75rem] border border-yellow-500/15 bg-[#121212] p-4 shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-bold">{item.name}</h3>
                        <p className="mt-1 text-sm text-zinc-400">
                          {item.description}
                        </p>

                        <div className="mt-3 space-y-1 text-sm text-zinc-300">
                          {Object.entries(item.selectedOptions).map(
                            ([groupName, choice]) => (
                              <p key={groupName}>
                                <span className="text-zinc-500">{groupName}:</span>{" "}
                                {choice.name}
                              </p>
                            )
                          )}

                          {item.selectedAddons.length > 0 && (
                            <p>
                              <span className="text-zinc-500">Add-ons:</span>{" "}
                              {item.selectedAddons
                                .map((addon) => addon.name)
                                .join(", ")}
                            </p>
                          )}
                        </div>

                        <p className="mt-3 text-sm font-semibold text-yellow-300">
                          ${item.unitPrice.toFixed(2)} each
                        </p>
                      </div>

                      <div className="flex items-center gap-3 rounded-full bg-black px-2 py-2">
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-lg"
                        >
                          -
                        </button>

                        <span className="min-w-[20px] text-center font-bold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => increaseQuantity(item.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400 text-lg text-black"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-yellow-500/10 pt-3 text-right">
                      <p className="text-lg font-black">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="mt-6 rounded-[2rem] border border-yellow-500/15 bg-[#121212] p-4 shadow-lg">
            <div className="mb-2 flex items-center justify-between text-sm text-zinc-400">
              <span>Items</span>
              <span>{totalItems}</span>
            </div>

            <div className="flex items-center justify-between text-2xl font-black">
              <span>Total</span>
              <span className="text-yellow-300">${totalPrice.toFixed(2)}</span>
            </div>

            <button className="mt-4 w-full rounded-[1.25rem] bg-yellow-400 px-4 py-4 text-base font-black text-black shadow-[0_12px_35px_rgba(250,204,21,0.35)] transition hover:scale-[1.01]">
              Checkout
            </button>
          </div>
        </div>
      )}

      {selectedDrink && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/70 backdrop-blur-sm sm:items-center sm:justify-center">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-[2rem] border border-yellow-500/15 bg-[#0f0f0f] p-5 shadow-2xl sm:rounded-[2rem]">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 to-amber-500 text-3xl">
                  {selectedDrink.emoji}
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-yellow-400/70">
                    Customize
                  </p>
                  <h2 className="mt-1 text-2xl font-black">
                    {selectedDrink.name}
                  </h2>
                  <p className="mt-1 text-sm text-zinc-400">
                    {selectedDrink.description}
                  </p>
                </div>
              </div>

              <button
                onClick={closeCustomizer}
                className="rounded-2xl border border-yellow-500/20 bg-[#121212] px-3 py-2 text-sm font-semibold"
              >
                Close
              </button>
            </div>

            <div className="space-y-6">
              {selectedDrink.options?.map((group) => (
                <div key={group.name}>
                  <h3 className="mb-3 text-lg font-bold">{group.name}</h3>

                  <div className="space-y-2">
                    {group.choices.map((choice) => {
                      const isSelected =
                        selectedOptions[group.name]?.name === choice.name;

                      return (
                        <button
                          key={choice.name}
                          onClick={() => chooseOption(group.name, choice)}
                          className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                            isSelected
                              ? "border-yellow-400 bg-yellow-400/10"
                              : "border-yellow-500/15 bg-[#121212]"
                          }`}
                        >
                          <span className="font-medium">{choice.name}</span>
                          <span className="text-sm text-zinc-400">
                            {choice.price === 0 ? "+$0" : `+$${choice.price}`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {selectedDrink.addons && selectedDrink.addons.length > 0 && (
                <div>
                  <h3 className="mb-3 text-lg font-bold">Add-ons</h3>

                  <div className="space-y-2">
                    {selectedDrink.addons.map((addon) => {
                      const isSelected = selectedAddons.some(
                        (item) => item.name === addon.name
                      );

                      return (
                        <button
                          key={addon.name}
                          onClick={() => toggleAddon(addon)}
                          className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                            isSelected
                              ? "border-yellow-400 bg-yellow-400/10"
                              : "border-yellow-500/15 bg-[#121212]"
                          }`}
                        >
                          <span className="font-medium">{addon.name}</span>
                          <span className="text-sm text-zinc-400">
                            +${addon.price}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-yellow-500/15 bg-[#121212] p-4">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-yellow-300">
                  ${customizerPrice.toFixed(2)}
                </span>
              </div>

              <button
                onClick={addCustomizedDrinkToCart}
                className="mt-4 w-full rounded-[1.25rem] bg-yellow-400 px-4 py-4 text-base font-black text-black shadow-[0_12px_35px_rgba(250,204,21,0.35)] transition hover:scale-[1.01]"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}