import express, { type Request, type Response } from "express";
const router = express.Router();
import Rider from "../models/rider";
import { riderSchema } from "../zod/index";

/**
 * POST /riders/register
 * Register a new rider
 */
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, bike_name, bike_number, current_lat, current_long } = riderSchema.parse(req.body);
    const rider = new Rider(
      Math.floor(Math.random() * 1000000),
      name,
      email,
      password,
      phone,
      bike_name,
      bike_number,
      "0",
      true,
      current_lat || null,
      current_long || null,
      new Date(),
      new Date()
    );
    const newRider = await rider.createRider(name, email, password, phone, bike_name, bike_number, current_lat, current_long);
    res.status(201).json(newRider);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /riders/available
 * Get all available riders
 */
router.get("/available", async (req: Request, res: Response) => {
  try {
    const rider = new Rider(0, "", "", "", "", "", "", "0", false, null, null, new Date(), new Date());
    const availableRiders = await rider.getAvailableRiders();
    res.status(200).json(availableRiders);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /riders/:id
 * Get rider details by ID
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id || Array.isArray(id)) {
      res.status(400).json({ error: "Invalid rider ID" });
      return;
    }
    const rider = new Rider(0, "", "", "", "", "", "", "0", false, null, null, new Date(), new Date());
    const riderDetail = await rider.getDetail(parseInt(id));
    if (!riderDetail) {
      res.status(404).json({ error: "Rider not found" });
      return;
    }
    res.status(200).json(riderDetail);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * PUT /riders/:id/location
 * Update rider's current location
 */
router.put("/:id/location", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id || Array.isArray(id)) {
      res.status(400).json({ error: "Invalid rider ID" });
      return;
    }
    const { current_lat, current_long } = req.body;

    if (!current_lat || !current_long) {
      res.status(400).json({ error: "current_lat and current_long are required" });
      return;
    }

    const rider = new Rider(0, "", "", "", "", "", "", "0", false, null, null, new Date(), new Date());
    const success = await rider.updateLocation(parseInt(id), current_lat, current_long);
    
    if (!success) {
      res.status(500).json({ error: "Failed to update location" });
      return;
    }

    res.status(200).json({ message: "Location updated successfully" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * PUT /riders/:id/availability
 * Update rider's availability status
 */
router.put("/:id/availability", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id || Array.isArray(id)) {
      res.status(400).json({ error: "Invalid rider ID" });
      return;
    }
    const { is_available } = req.body;

    if (typeof is_available !== "boolean") {
      res.status(400).json({ error: "is_available must be a boolean" });
      return;
    }

    const rider = new Rider(0, "", "", "", "", "", "", "0", false, null, null, new Date(), new Date());
    const success = await rider.updateAvailability(parseInt(id), is_available);
    
    if (!success) {
      res.status(500).json({ error: "Failed to update availability" });
      return;
    }

    res.status(200).json({ message: "Availability updated successfully" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /riders/:id/earnings
 * Get rider's total earnings
 */
router.get("/:id/earnings", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id || Array.isArray(id)) {
      res.status(400).json({ error: "Invalid rider ID" });
      return;
    }
    const rider = new Rider(0, "", "", "", "", "", "", "0", false, null, null, new Date(), new Date());
    const earnings = await rider.getTotalEarnings(parseInt(id));
    res.status(200).json({ earnings });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /riders/:id/rating
 * Get rider's average rating
 */
router.get("/:id/rating", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id || Array.isArray(id)) {
      res.status(400).json({ error: "Invalid rider ID" });
      return;
    }
    const rider = new Rider(0, "", "", "", "", "", "", "0", false, null, null, new Date(), new Date());
    const rating = await rider.getAverageRating(parseInt(id));
    res.status(200).json({ rating });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /riders/:id/earnings
 * Add earnings to a rider
 */
router.post("/:id/earnings", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id || Array.isArray(id)) {
      res.status(400).json({ error: "Invalid rider ID" });
      return;
    }
    const { amount } = req.body;

    if (!amount || isNaN(parseFloat(amount))) {
      res.status(400).json({ error: "Valid amount is required" });
      return;
    }

    const rider = new Rider(0, "", "", "", "", "", "", "0", false, null, null, new Date(), new Date());
    const success = await rider.addEarnings(parseInt(id), amount);
    
    if (!success) {
      res.status(500).json({ error: "Failed to add earnings" });
      return;
    }

    res.status(200).json({ message: "Earnings added successfully" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

const riderRoute = router;
export default riderRoute;


