import db from "../../db";
import { riders, reviews } from "../../db/src/db/schema";
import { eq } from "drizzle-orm";

class Rider {
    id: number;
    name: string;
    email: string;
    password: string;
    phone: string;
    bike_name: string;
    bike_number: string;
    total_earnings: string;
    is_available: boolean;
    current_lat: string | null;
    current_long: string | null;
    created_at: Date;
    updated_at: Date;

    constructor(
        id: number,
        name: string,
        email: string,
        password: string,
        phone: string,
        bike_name: string,
        bike_number: string,
        total_earnings: string | number,
        is_available: boolean,
        current_lat: string | number | null,
        current_long: string | number | null,
        created_at: Date,
        updated_at: Date
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.bike_name = bike_name;
        this.bike_number = bike_number;
        this.total_earnings = String(total_earnings);
        this.is_available = is_available;
        this.current_lat = current_lat ? String(current_lat) : null;
        this.current_long = current_long ? String(current_long) : null;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    /**
     * Create a new rider in the database
     */
    async createRider(
        name: string,
        email: string,
        password: string,
        phone: string,
        bike_name: string,
        bike_number: string,
        current_lat?: string | number | null,
        current_long?: string | number | null
    ): Promise<Rider | null> {
        try {
            const result = await db.insert(riders)
                .values({
                    name,
                    email,
                    password,
                    phone,
                    bike_name,
                    bike_number,
                    total_earnings: "0",
                    is_available: true,
                    current_lat: current_lat ? String(current_lat) : null,
                    current_long: current_long ? String(current_long) : null,
                })
                .returning();
            
            if (!result || result.length === 0) return null;
            
            const newRiderData = result[0];
            if (!newRiderData) return null;

            return new Rider(
                newRiderData.id,
                newRiderData.name,
                newRiderData.email,
                newRiderData.password,
                newRiderData.phone,
                newRiderData.bike_name,
                newRiderData.bike_number,
                newRiderData.total_earnings,
                newRiderData.is_available,
                newRiderData.current_lat,
                newRiderData.current_long,
                newRiderData.created_at,
                newRiderData.updated_at
            );
        } catch (error) {
            console.error("Error creating rider:", error);
            return null;
        }
    }

    /**
     * Get all available riders
     */
    async getAvailableRiders(): Promise<Rider[]> {
        try {
            const availableRiders = await db
                .select()
                .from(riders)
                .where(eq(riders.is_available, true));
            
            return availableRiders.map((riderData) => new Rider(
                riderData.id,
                riderData.name,
                riderData.email,
                riderData.password,
                riderData.phone,
                riderData.bike_name,
                riderData.bike_number,
                riderData.total_earnings,
                riderData.is_available,
                riderData.current_lat,
                riderData.current_long,
                riderData.created_at,
                riderData.updated_at
            ));
        } catch (error) {
            console.error("Error fetching available riders:", error);
            return [];
        }
    }

    /**
     * Get details of the current rider
     */
    getDetails(): string {
        return `Rider ID: ${this.id}, Name: ${this.name}, Email: ${this.email}, Phone: ${this.phone}, Bike: ${this.bike_name} (${this.bike_number}), Total Earnings: ${this.total_earnings}, Available: ${this.is_available}, Location: (${this.current_lat}, ${this.current_long}), Created: ${this.created_at}, Updated: ${this.updated_at}`;
    }

    /**
     * Get a specific rider by ID
     */
    async getDetail(id: number): Promise<Rider | null> {
        try {
            const riderData = await db
                .select()
                .from(riders)
                .where(eq(riders.id, id))
                .limit(1);
            
            if (!riderData || riderData.length === 0) return null;
            
            const rd = riderData[0];
            if (!rd) return null;

            return new Rider(
                rd.id,
                rd.name,
                rd.email,
                rd.password,
                rd.phone,
                rd.bike_name,
                rd.bike_number,
                rd.total_earnings,
                rd.is_available,
                rd.current_lat,
                rd.current_long,
                rd.created_at,
                rd.updated_at
            );
        } catch (error) {
            console.error("Error fetching rider details:", error);
            return null;
        }
    }

    /**
     * Get total earnings of a rider
     */
    async getTotalEarnings(id: number): Promise<string> {
        try {
            const riderData = await db
                .select()
                .from(riders)
                .where(eq(riders.id, id))
                .limit(1);
            
            if (!riderData || riderData.length === 0) return "0";
            
            const rd = riderData[0];
            return rd ? String(rd.total_earnings) : "0";
        } catch (error) {
            console.error("Error fetching earnings:", error);
            return "0";
        }
    }

    /**
     * Get average rating of a rider from reviews
     */
    async getAverageRating(riderId: number): Promise<number> {
        try {
            const reviewData = await db
                .select()
                .from(reviews)
                .where(eq(reviews.rider_id, riderId));
            
            if (!reviewData || reviewData.length === 0) return 0;
            
            const ratings = reviewData.map((review) => review.rating);
            const totalRating = ratings.reduce((acc: number, rating: number) => acc + rating, 0);
            return Number((totalRating / ratings.length).toFixed(2));
        } catch (error) {
            console.error("Error fetching rider rating:", error);
            return 0;
        }
    }

    /**
     * Update rider's current location
     */
    async updateLocation(id: number, lat: string | number, long: string | number): Promise<boolean> {
        try {
            await db
                .update(riders)
                .set({
                    current_lat: String(lat),
                    current_long: String(long),
                    updated_at: new Date(),
                })
                .where(eq(riders.id, id));
            return true;
        } catch (error) {
            console.error("Error updating location:", error);
            return false;
        }
    }

    /**
     * Update rider's availability status
     */
    async updateAvailability(id: number, isAvailable: boolean): Promise<boolean> {
        try {
            await db
                .update(riders)
                .set({
                    is_available: isAvailable,
                    updated_at: new Date(),
                })
                .where(eq(riders.id, id));
            return true;
        } catch (error) {
            console.error("Error updating availability:", error);
            return false;
        }
    }

    /**
     * Add earnings to a rider
     */
    async addEarnings(id: number, amount: string | number): Promise<boolean> {
        try {
            const rider = await this.getDetail(id);
            if (!rider) return false;
            
            const currentEarnings = parseFloat(rider.total_earnings) || 0;
            const newAmount = parseFloat(String(amount)) || 0;
            const totalEarnings = (currentEarnings + newAmount).toFixed(2);
            
            await db
                .update(riders)
                .set({
                    total_earnings: totalEarnings,
                    updated_at: new Date(),
                })
                .where(eq(riders.id, id));
            return true;
        } catch (error) {
            console.error("Error adding earnings:", error);
            return false;
        }
    }

}

export default Rider;