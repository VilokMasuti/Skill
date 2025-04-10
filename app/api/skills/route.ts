/* eslint-disable @typescript-eslint/no-explicit-any */
import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "../../../lib/auth"
import { connectToDatabase } from "../../../lib/mongodb"

import { z } from "zod"
import { Skill } from "../../../lib/models/skill"

// Input validation schema for GET requests
const GetQuerySchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).optional().default(50),
  page: z.coerce.number().min(1).optional().default(1),
})

// Input validation schema for POST requests
const CreateSkillSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must not exceed 100 characters"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(500, "Description must not exceed 500 characters"),
  category: z.string().min(1, "Category is required"),
  contactPreference: z.enum(["email", "whatsapp", "both"], {
    required_error: "Contact preference is required",
  }),
  whatsapp: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true
        return /^\+?[0-9]{10,15}$/.test(val)
      },
      { message: "Please enter a valid WhatsApp number" },
    ),
})

export async function GET(request: NextRequest) {
  try {
    // Parse and validate query parameters
    const searchParams = request.nextUrl.searchParams
    const validatedQuery = GetQuerySchema.safeParse({
      category: searchParams.get("category"),
      search: searchParams.get("search"),
      limit: searchParams.get("limit"),
      page: searchParams.get("page"),
    })

    if (!validatedQuery.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: validatedQuery.error.format() },
        { status: 400 },
      )
    }

    const { category, search, limit, page } = validatedQuery.data

    await connectToDatabase()

    const query: any = {}

    if (category) {
      query.category = category
    }

    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    const skills = await Skill.find(query)
      .populate("user", "name image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    // Get total count for pagination
    const total = await Skill.countDocuments(query)

    return NextResponse.json({
      skills,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching skills:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch skills",
        message: "An unexpected error occurred while fetching skills. Please try again later.",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    // Parse and validate request body
    const body = await request.json()
    const validatedData = CreateSkillSchema.safeParse(body)

    if (!validatedData.success) {
      return NextResponse.json({ error: "Validation failed", details: validatedData.error.format() }, { status: 400 })
    }

    const { title, description, category, contactPreference, whatsapp } = validatedData.data

    // Check for duplicate skills by this user
    const existingSkill = await Skill.findOne({
      user: session.userId,
      title: { $regex: new RegExp(`^${title}$`, "i") },
    })

    if (existingSkill) {
      return NextResponse.json(
        { error: "Duplicate skill", message: "You already have a skill with this title" },
        { status: 409 },
      )
    }

    // Create new skill
    const newSkill = new Skill({
      title,
      description,
      category,
      user: session.userId,
      contactPreference,
      whatsapp: contactPreference !== "email" ? whatsapp : undefined,
      createdAt: new Date(),
    })

    await newSkill.save()

    return NextResponse.json(newSkill)
  } catch (error) {
    console.error("Error creating skill:", error)
    return NextResponse.json(
      {
        error: "Failed to create skill",
        message: "An unexpected error occurred while creating your skill. Please try again later.",
      },
      { status: 500 },
    )
  }
}
