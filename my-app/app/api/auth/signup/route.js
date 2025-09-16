import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getPool } from '@/lib/database';

export async function POST(request) {
  try {
    const { username, email, password, role } = await request.json();

    // Validation
    if (!username || !email || !password || !role) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    if (!['admin', 'staff'].includes(role)) {
      return NextResponse.json(
        { message: 'Invalid role' },
        { status: 400 }
      );
    }

    // Connect to database
    const pool = getPool();

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT email FROM Users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Save to database
    const result = await pool.query(
      'INSERT INTO Users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING user_id, username, email, role',
      [username, email, hashedPassword, role]
    );

    const newUser = result.rows[0];

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: {
        user_id: newUser.user_id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}