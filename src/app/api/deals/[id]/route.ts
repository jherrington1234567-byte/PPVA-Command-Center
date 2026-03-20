import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deal = await prisma.deal.findUnique({ where: { id } });
  if (!deal) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(deal);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const deal = await prisma.deal.update({
    where: { id },
    data: {
      name: body.name,
      policyOwner: body.policyOwner,
      policyIssueDate: body.policyIssueDate,
      totalDeposit: body.totalDeposit,
      inputsJson: body.inputs ? JSON.stringify(body.inputs) : undefined,
      resultsJson: body.results ? JSON.stringify(body.results) : undefined,
      status: body.status,
    },
  });
  return NextResponse.json(deal);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.deal.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
