import dotenv from "dotenv";
dotenv.config();
import { users } from "../../db/src/db/schema";
import { eq } from "drizzle-orm";
import db from "../../db/index";

class Users {
  name: string;
  email: string;
  password: string;
  phone: number;
  created_at: Date;
  update_at: Date;

  constructor(
    name: string,
    email: string,
    password: string,
    phone: number,
    created_at: Date,
    update_at: Date,
  ) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.created_at = created_at;
    this.update_at = update_at;

  }
  async createUser(name: string, email: string, password: string, phone: number): Promise<Users> {
    const newUser = new Users( name, email, password, phone, new Date(), new Date());
      await db.insert(users)
      .values({
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        phone: newUser.phone.toString(),
        created_at: newUser.created_at,
        updated_at: newUser.update_at,
      })
      .returning();
      

    return newUser;
  }
  async loginUser(email: string): Promise<Users | null> {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
    if (user && user.length > 0) {
      const userData = user[0];
      if (!userData) {
        return null;
      }
      return new Users(
        userData.name,
        userData.email,
        userData.password,
        parseInt(userData.phone),
        userData.created_at,
        userData.updated_at,
      );
    }
    return null;
  }
}


export default Users;