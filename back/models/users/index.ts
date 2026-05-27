import dotenv from "dotenv";
dotenv.config();
import { drizzle } from "drizzle-orm/node-postgres";
import { users } from "../../db/src/db/schema";
import { eq } from "drizzle-orm";
const db = drizzle(process.env.DATABASE_URL!);

class Users {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: number;
  created_at: Date;
  update_at: Date;

  constructor(
    id: number,
    name: string,
    email: string,
    password: string,
    phone: number,
    created_at: Date,
    update_at: Date,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.created_at = created_at;
    this.update_at = update_at;

  }
  createUser(name: string, email: string, password: string, phone: number): Users {
    const newUser = new Users(0, name, email, password, phone, new Date(), new Date());
    db.insert(users)
      .values({
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        phone: newUser.phone,
        password: newUser.password,
        created_at: newUser.created_at,
        update_at: newUser.update_at,
      })
      .returning();
    return newUser;
  }
  async loginUser(email: string): Promise<Users | null> {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (user && user.length > 0) {
      const userData = user[0];
      if (!userData) {
        return null;
      }
      return new Users(
        userData.id,
        userData.name,
        userData.email,
        userData.password,
        userData.phone,
        userData.created_at,
        userData.update_at,
      );
    }
    return null;
  }
}


export default Users;