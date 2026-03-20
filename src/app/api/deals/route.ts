import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const deals = await prisma.deal.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      policyOwner: true,
      totalDeposit: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return NextResponse.json(deals);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const deal = await prisma.deal.create({
    data: {
      name: body.name,
      policyOwner: body.policyOwner || "",
      policyIssueDate: body.policyIssueDate || null,
      totalDeposit: body.totalDeposit,
      inputsJson: JSON.stringify(body.inputs),
      resultsJson: body.results ? JSON.stringify(body.results) : null,
      status: body.status || "draft",
    },
  });
  return NextResponse.json(deal, { status: 201 });
}
