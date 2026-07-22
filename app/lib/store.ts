// app/lib/store.ts
// Simple JSON-file store for businesses. Local-first, same approach as the other
// Southline tools — no DB needed for the install MVP. Seeds one sample taqueria.

import { promises as fs } from "node:fs";
import path from "node:path";
import { Business } from "./types";

const DATA = path.join(process.cwd(), "data", "businesses.json");

const SAMPLE: Business[] = [
  {
    slug: "la-placita",
    name: "La Placita Taquería",
    tagline: "Auténtico · Fresco · Cada día",
    primaryColor: "#E8B23A",
    bgColor: "#1A0E08",
    textColor: "#FFF7EC",
    slides: [
      {
        kind: "menu",
        section: {
          title: "Tacos",
          items: [
            { name: "Al Pastor", price: "$3.25", note: "pineapple, onion, cilantro" },
            { name: "Carne Asada", price: "$3.50" },
            { name: "Carnitas", price: "$3.25" },
            { name: "Pollo", price: "$3.00" },
            { name: "Lengua", price: "$3.75" },
          ],
        },
      },
      {
        kind: "menu",
        section: {
          title: "Platillos",
          items: [
            { name: "Burrito Supremo", price: "$9.50", note: "rice, beans, choice of meat" },
            { name: "Quesadilla", price: "$7.00" },
            { name: "Torta", price: "$8.50" },
            { name: "Nachos Especiales", price: "$8.00" },
          ],
        },
      },
      { kind: "special", headline: "Taco Tuesday", subtext: "All tacos", price: "$2.00", },
      { kind: "hours", lines: ["Mon–Thu · 10a – 9p", "Fri–Sat · 10a – 11p", "Sun · 11a – 8p"] },
    ],
    slideSeconds: 8,
    promoBar: "🌮 Taco Tuesday — $2 tacos all day  ·  Catering available — ask inside  ·  Scan to order ahead 📲",
    qrUrl: "https://snaplink.southlineone.com/en/p/la-placita",
    qrLabel: "Scan to order ahead",
    showClock: true,
  },
  {
    slug: "la-morelita",
    name: "La Morelita de Morelia",
    tagline: "Paletas Gourmet · Handmade · Fresh",
    primaryColor: "#E8B23A",
    bgColor: "#2A0E16",
    textColor: "#FBEFE0",
    slides: [],
    slideSeconds: 10,
    showClock: false,
    qrUrl: "https://snaplink.southlineone.com/en/p/la-morelita",
    qrLabel: "Order ahead",
    panels: [
      {
        kind: "grid",
        stepNumber: "1",
        title: "PICK IT",
        subtitle: "Choose from 20+ paleta flavors, handmade with gelato or sorbet and 100% fresh, natural ingredients.",
        columns: 6,
        ctaLabel: "PLACE ORDER",
        items: [
          { name: "Greek Yogurt & Berries" }, { name: "Strawberry Cheesecake" }, { name: "Mango Sorbet" },
          { name: "Pistachio" }, { name: "Chocolate Fudgy Brownie" }, { name: "Coconut", tag: "(v)" },
          { name: "Cookies & Cream" }, { name: "Passion Fruit Sorbet" }, { name: "Dulce de Leche filled" },
          { name: "Strawberry Sorbet" }, { name: "Banana filled with Nutella" }, { name: "Passion Fruit filled" },
          { name: "Lime Sorbet" }, { name: "Raspberry Sorbet" }, { name: "Pineapple Mint Sorbet" },
          { name: "Belgian Chocolate" }, { name: "Reese's Peanut Butter Cup" }, { name: "Mint Choc Chip" },
          { name: "Dubai Chocolate" }, { name: "Dubai White Chocolate" }, { name: "Coffee" },
          { name: "Chocolate Hazelnut Cookies & Cream", tag: "(v)" }, { name: "Greek Yogurt" }, { name: "Vanilla Bean" },
        ],
      },
      {
        kind: "hero",
        heroKicker: "PALETAS GOURMET",
        heroName: "LA MORELITA",
        heroSub: "DE MORELIA",
        heroBanner: "HANDMADE · FRESH · NATURAL INGREDIENTS",
        heroFooter: "VOTED A TOP DESTINATION FOR PALETAS!",
      },
      {
        kind: "grid",
        stepNumber: "2",
        title: "DIP IT",
        subtitle: "Add a rich, creamy dipping to elevate your paleta.",
        columns: 4,
        items: [
          { name: "Dark Chocolate", tag: "(v)" }, { name: "White Chocolate" },
          { name: "Crunchy Hazelnut" }, { name: "Cookie Butter" },
        ],
        title2: "3  TOP IT",
        subtitle2: "Finish it off with your favorite toppings for deliciousness in every bite.",
        items2: [
          { name: "Oreo Crumbs" }, { name: "Peanuts" }, { name: "Pistachios" }, { name: "Almonds" },
          { name: "Rainbow Sprinkles" }, { name: "Graham Crackers" }, { name: "Toasted Coconut Flakes" }, { name: "…and more!" },
        ],
      },
    ],
  },
];

async function read(): Promise<Business[]> {
  try {
    return JSON.parse(await fs.readFile(DATA, "utf8"));
  } catch {
    await write(SAMPLE);
    return SAMPLE;
  }
}

async function write(list: Business[]): Promise<void> {
  await fs.mkdir(path.dirname(DATA), { recursive: true });
  await fs.writeFile(DATA, JSON.stringify(list, null, 2));
}

export const store = {
  all: read,
  async get(slug: string) {
    return (await read()).find((b) => b.slug === slug) || null;
  },
  async save(biz: Business) {
    const list = await read();
    const i = list.findIndex((b) => b.slug === biz.slug);
    if (i >= 0) list[i] = biz;
    else list.push(biz);
    await write(list);
    return biz;
  },
};
