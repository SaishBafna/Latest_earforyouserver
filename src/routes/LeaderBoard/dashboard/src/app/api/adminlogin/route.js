import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import { connectToDb } from "../../lib/db";
import Admin from "../../lib/AdminModal";

export async function POST(req) {
  connectToDb();

  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email) {
      return NextResponse.json(
        { status: 400, message: "Email is required." },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { status: 400, message: "Password is required." },
        { status: 400 }
      );
    }

    const user = await Admin.findOne({ email });

    if (user) {
      const checkPassword = bcrypt.compareSync(password, user.password);

      if (checkPassword) {
        return NextResponse.json(
          { status: 200, message: "User logged in successfully." },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          {
            status: 400,
            message: "Incorrect password. Please check your credentials.",
          },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { status: 404, message: "No account found with this email." },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        status: 500,
        message: "Internal server error. Please try again later.",
      },
      { status: 500 }
    );
  }
}
