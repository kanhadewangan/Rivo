import { pgTable, integer, varchar, boolean, timestamp } from "drizzle-orm/pg-core";
import db from "../../db";
import { riders, reviews } from "../../db/src/db/schema";
import { eq } from "drizzle-orm";

class rider {
    id: number;
    name: string;
    bike_name: string;
    bike_number: number;
    totalEarnings: number;
    isAvailable: boolean;
    currentLat: string;
    currentLong: string;
    created_at: Date;
    update_at: Date;

    constructor(
        id: number,
        name: string,
        bike_name: string,
        bike_number: number,
        totalEarnings: number,
        isAvailable: boolean,
        currentLat: string,
        currentLong: string,
        created_at: Date,
        update_at: Date
    ) {
        this.id = id;
        this.name = name;
        this.bike_name = bike_name;
        this.bike_number = bike_number;
        this.totalEarnings = totalEarnings;
        this.isAvailable = isAvailable;
        this.currentLat = currentLat;
        this.currentLong = currentLong;
        this.created_at = created_at;
        this.update_at = update_at;
    }

    createRider(
        name: string,
        bike_name: string,
        bike_number: number,
        currentLat: string,
        currentLong: string
    ): rider {
        const newRider = new rider(
            0,
            name,
            bike_name,
            bike_number,
            0,
            true,
            currentLat,
            currentLong,
            new Date(),
            new Date()
        );
        db.insert(riders)
            .values({
                name: newRider.name,
                bike_name: newRider.bike_name,
                bike_number: newRider.bike_number,
                totalEarnings: newRider.totalEarnings,
                isAvailable: newRider.isAvailable,
                currentLat: newRider.currentLat,
                currentLong: newRider.currentLong,
                created_at: newRider.created_at,
                update_at: newRider.update_at,
            })
            .returning();
        return newRider;    
    }

    async getAvailableRiders(): Promise<rider[]> {
        const availableRiders = await db
            .select()
            .from(riders)
            .where(eq(riders.isAvailable, true));
        return availableRiders.map((riderData) => new rider(
            riderData.id,
            riderData.name,
            riderData.bike_name,
            riderData.bike_number,
            riderData.totalEarnings,
            riderData.isAvailable,
            riderData.currentLat,
            riderData.currentLong,
            riderData.created_at,
            riderData.update_at
        ));
    } 

    getDetails(): string {
        return `Rider ID: ${this.id}, Name: ${this.name}, Bike Name: ${this.bike_name}, Bike Number: ${this.bike_number}, Total Earnings: ${this.totalEarnings}, Is Available: ${this.isAvailable}, Current Location: (${this.currentLat}, ${this.currentLong}), Created At: ${this.created_at}, Updated At: ${this.update_at}`;
    }
     async getDetail(id: number): Promise<rider | null> {
        const riderData = await db
            .select()
            .from(riders)
            .where(eq(riders.id, id))
            .limit(1);
        const rd = riderData[0];
        if (!rd) return null;
        return new rider(
            rd.id,
            rd.name,
            rd.bike_name,
            rd.bike_number,
            rd.totalEarnings,
            rd.isAvailable,
            rd.currentLat,
            rd.currentLong,
            rd.created_at,
            rd.update_at
        );
    }

    getEarnings(id:number): number {
        const riderData = db
            .select()
            .from(riders)
            .where(eq(riders.id, id))
            .limit(1);
        const rd: any = riderData[0];
        if (!rd) return 0;
        return rd.totalEarnings;
    }

    getRating(id:number): number {
        const reviewData = db
            .select()
            .from(reviews)
            .where(eq(reviews.ride_id, id));
        const ratings = reviewData.map((review: { rating: number }) => review.rating);
        if (ratings.length === 0) return 0;
        const totalRating = ratings.reduce((acc: number, rating: number) => acc + rating, 0);
        return totalRating / ratings.length;
    }



}