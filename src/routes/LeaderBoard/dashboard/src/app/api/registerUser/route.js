import { connectToDb } from "@/app/lib/db";
import User from "@/app/lib/RegistrationModel";


import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectToDb();

    const data = await request.json();
    const { serviceType, username, phone, email, companyAddress, password, confirmPassword } = data;

    // Check for all required fields
    if (!serviceType || !username || !phone || !email || !password || !confirmPassword) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }
    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists) {
      return res.status(400).json({ message: "You Already Register For The Servise" });
    }

    const newUser = new User({
      serviceType,
      username,
      phone,
      email,
      companyAddress,
      password
    });

    await newUser.save();
    return NextResponse.json({ message: 'Service created successfully', data: newUser }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
