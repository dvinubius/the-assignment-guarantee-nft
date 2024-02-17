import prisma from "@/lib/prisma";

export const POST = async (req: Request) => {
  const body = await req.json();
  await prisma.listing.create({
    data: {
      nftContractAddress: body.nftContractAddress,
      nftTokenId: body.nftTokenId,
      nftOwner: body.nftOwner,
      },
    });
  
  return new Response(
    JSON.stringify({message: "Posted!"}), {status: 200, headers: {'Content-Type': 'application/json'}}
  );
}