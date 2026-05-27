import { is } from "drizzle-orm";
import { timestamp } from "drizzle-orm/pg-core";
import { boolean } from "drizzle-orm/pg-core";
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  number: integer("number").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  update_at: timestamp("update_at").notNull().defaultNow(),
});

export const riders = pgTable("riders", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  bike_name: varchar("bike_name", { length: 255 }).notNull(),
  bike_number: integer("bike_number").notNull(),
  totalEarnings: integer("totalEarnings").notNull().default(0),
  isAvailable: boolean("isAvailable").notNull().default(true),
  currentLat: varchar("currentLat", { length: 255 }).notNull(),
  currentLong: varchar("currentLong", { length: 255 }).notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  update_at: timestamp("update_at").notNull().defaultNow(),
});

export const rides = pgTable("rides", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer("user_id")
    .notNull()
    .references(() => users.id),
  rider_id: integer("rider_id")
    .notNull()
    .references(() => riders.id),
  pickup_location: varchar("pickup_location", { length: 255 }).notNull(),
  drop_location: varchar("drop_location", { length: 255 }).notNull(),
  otp: integer("otp").notNull(),
  fare: integer("fare").notNull(),
  started_at: timestamp("started_at").notNull().defaultNow(),
  ended_at: timestamp("ended_at").notNull().defaultNow(),
  isCompleted: boolean("isCompleted").notNull().default(false),
  isCancelled: boolean("isCancelled").notNull().default(false),
  created_at: timestamp("created_at").notNull().defaultNow(),
  update_at: timestamp("update_at").notNull().defaultNow(),
});

export const payments = pgTable("payments", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  ride_id: integer("ride_id")
    .notNull()
    .references(() => rides.id),
  amount: integer("amount").notNull(),
  payment_method: varchar("payment_method", { length: 255 }).notNull(),
  isPaid: boolean("isPaid").notNull().default(false),
  created_at: timestamp("created_at").notNull().defaultNow(),
  update_at: timestamp("update_at").notNull().defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  ride_id: integer("ride_id")
    .notNull()
    .references(() => rides.id),
  rating: integer("rating").notNull(),
  comment: varchar("comment", { length: 255 }).notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  update_at: timestamp("update_at").notNull().defaultNow(),
});

export const complaints = pgTable("complaints", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  ride_id: integer("ride_id")
    .notNull()
    .references(() => rides.id),
  complaint_text: varchar("complaint_text", { length: 255 }).notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  update_at: timestamp("update_at").notNull().defaultNow(),
});

export const support_tickets = pgTable("support_tickets", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer("user_id")
    .notNull()
    .references(() => users.id),
  subject: varchar("subject", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  status: varchar("status", { length: 255 }).notNull().default("open"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  update_at: timestamp("update_at").notNull().defaultNow(),
});
