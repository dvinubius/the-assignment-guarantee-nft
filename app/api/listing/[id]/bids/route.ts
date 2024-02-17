import prisma from "@/lib/prisma";

export const GET = async (req: Request, { params } : {params: { id: string }}) => {
  const id = parseInt(params.id);
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { bids: true },
  });

  return new Response(
    JSON.stringify({bids: listing!.bids}), {status: 200, headers: {'Content-Type': 'application/json'}}
  );
};