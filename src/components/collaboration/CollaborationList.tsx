"use client"
import { useCollaborations } from "@/app/(clients)/misc/api";
import Link from "next/link";

export default function CollaborationList() {
  const { data: collaborations, isLoading, error } = useCollaborations();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error.message}</div>;
  if (!collaborations?.data.length) return <div>No collaborations found.</div>;
  return (
    <div className="space-y-2">
      {/* {collaborations.data.map(collab => (
        <Link key={collab.id} href={`/businesses/saved/collaboration/${collab.id}`} className="block border rounded p-4 hover:bg-gray-50">
          <div className="font-bold">{collab.name}</div>
          <div className="text-sm text-gray-600">{collab.name}</div>
          <div className="text-xs text-gray-400">{collab.number_of_members} members</div>
        </Link>
      ))} */}
    </div>
  );
}
