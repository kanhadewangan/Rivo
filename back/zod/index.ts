
import z from "zod";

export const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  phone: z.string().min(10, "Phone number must be at least 10 characters long")
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Invalid email address").optional(),
  password: z.string().min(6, "Password must be at least 6 characters long").optional(),
});

export const riderSchema = z.object({
  name: z.string().min(1, "Rider name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  phone: z.string().min(10, "Phone number must be at least 10 characters long"),
  bike_name: z.string().min(1, "Bike name is required"),
  bike_number: z.string().min(1, "Bike number is required"),
  current_lat: z.number().optional(),
  current_long: z.number().optional(),
});

export const riderLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const updateRiderSchema = z.object({
  name: z.string().min(1, "Rider name is required").optional(),
  email: z.string().email("Invalid email address").optional(),
  password: z.string().min(6, "Password must be at least 6 characters long").optional(),
  bike_name: z.string().min(1, "Bike name is required").optional(),
  bike_number: z.string().min(1, "Bike number is required").optional(),
});


