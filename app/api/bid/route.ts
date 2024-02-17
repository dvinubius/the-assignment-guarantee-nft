import prisma from "@/lib/prisma";

export const POST = async (req: Request) => {
  const body = await req.json();
  const bid = body.bid;
  const listingId = body.listingId;
  console.log('body', body);
  const createdBid = await prisma.bid.create({
    data: {
      ...bid,
      listing: {
        connect: {
          id: listingId,
        },
      },
    },
  });
  await prisma.bid.update({
    where : {id: createdBid.id},
    data: { listingId }
  })

  return new Response(
    JSON.stringify({message: "Posted!"}), {status: 200, headers : {'Content-Type': 'application/json'}}
  );
}