import { boolean, integer, numeric, pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const rideStatusEnum = pgEnum("ride_status", [
  "requested",
  "accepted",
  "in_progress",
  "completed",
  "cancelled",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "cash",
  "upi",
  "card",
]);

export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 15 }).notNull().unique(), // ✅ varchar, not integer
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const riders = pgTable("riders", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 15 }).notNull().unique(),
  bike_name: varchar("bike_name", { length: 255 }).notNull(),
  bike_number: varchar("bike_number", { length: 20 }).notNull().unique(), // ✅ varchar
  total_earnings: numeric("total_earnings", { precision: 10, scale: 2 }).notNull().default("0"), // ✅ numeric
  is_available: boolean("is_available").notNull().default(true),
  current_lat: numeric("current_lat", { precision: 10, scale: 7 }),  // ✅ numeric, nullable
  current_long: numeric("current_long", { precision: 10, scale: 7 }), // ✅ numeric, nullable
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const rides = pgTable("rides", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer("user_id").notNull().references(() => users.id),
  rider_id: integer("rider_id").references(() => riders.id), // nullable — no rider assigned yet
  pickup_location: varchar("pickup_location", { length: 255 }).notNull(),
  pickup_lat: numeric("pickup_lat", { precision: 10, scale: 7 }).notNull(),
  pickup_long: numeric("pickup_long", { precision: 10, scale: 7 }).notNull(),
  drop_location: varchar("drop_location", { length: 255 }).notNull(),
  drop_lat: numeric("drop_lat", { precision: 10, scale: 7 }).notNull(),
  drop_long: numeric("drop_long", { precision: 10, scale: 7 }).notNull(),
  status: rideStatusEnum("status").notNull().default("requested"), // ✅ enum instead of 2 booleans
  otp: varchar("otp", { length: 6 }).notNull(),
  fare: numeric("fare", { precision: 10, scale: 2 }).notNull(),
  started_at: timestamp("started_at"),   // ✅ nullable
  ended_at: timestamp("ended_at"),       // ✅ nullable
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const payments = pgTable("payments", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  ride_id: integer("ride_id").notNull().references(() => rides.id),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(), // ✅ numeric
  payment_method: paymentMethodEnum("payment_method").notNull(),
  is_paid: boolean("is_paid").notNull().default(false),
  transaction_ref: varchar("transaction_ref", { length: 255 }), // for UPI/card txn IDs
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  ride_id: integer("ride_id").notNull().references(() => rides.id),
  user_id: integer("user_id").references(() => users.id),   // ✅ who reviewed
  rider_id: integer("rider_id").references(() => riders.id), // one of these will be null
  rating: integer("rating").notNull(),  // 1–5
  comment: text("comment"),             // ✅ text, not varchar(255) — comments can be long
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const complaints = pgTable("complaints", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  ride_id: integer("ride_id").notNull().references(() => rides.id),
  user_id: integer("user_id").references(() => users.id),
  complaint_text: text("complaint_text").notNull(), // ✅ text
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const support_tickets = pgTable("support_tickets", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer("user_id").references(() => users.id),
  rider_id: integer("rider_id").references(() => riders.id), // ✅ riders can raise tickets too
  subject: varchar("subject", { length: 255 }).notNull(),
  description: text("description").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("open"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});