import prisma from "@/lib/db";

export default async function Home() {
  const users= await prisma.user.findMany();
  
  return (
    <div className="bg-gray-100 font-bold">
      {JSON.stringify({users})}
    </div>
  );
}
