'use client';
import CollaborationDetails from "@/app/(clients)/misc/components/CollaborationDetails";
import { useParams } from "next/navigation";

export default function CollaborationDetailsPage() {
  const params = useParams();
  const collabId = params?.['collabId'];
  if (!collabId) return null;
  return (
      <CollaborationDetails collabId={Number(collabId)} />
  );
}
