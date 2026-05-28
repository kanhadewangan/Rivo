import { test, expect } from '@playwright/test';






test("Users can log in with valid credentials", async ({ request }) => {
  const new_user = await request.post("/users/register", {
    data: {
      name: "Test User",
      email: "kanhadew@example.com",
      password: "password123",
      phone: "9109342349"
    }
  });
  expect(new_user.status()).toBe(201);

  const login_response = await request.post("/users/login", {
    data: {
      email: "kanha@example.com",
      password: "password123"
    }
  });
  expect(login_response.status()).toBe(200);
  const login_data = await login_response.json();
  expect(login_data).toHaveProperty("email", "kanha@example.com");

});

