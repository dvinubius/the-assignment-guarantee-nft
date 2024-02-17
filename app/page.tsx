import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-start p-48 gap-16">
      <h1 className='text-5xl font-medium capitalize'>Borrow against your NFTs</h1>
      <h1 className='text-4xl font-medium text-gray-400 tracking-widest'>Peer 2 Peer</h1>
      <h1 className='text-5xl font-medium capitalize'>Lend on your own terms</h1>
    </main>
  );
}
