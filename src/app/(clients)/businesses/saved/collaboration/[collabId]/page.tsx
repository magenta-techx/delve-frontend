
import { useParams } from "next/navigation";
import CollaborationDetails from "@/components/collaboration/CollaborationDetails";

export default function CollaborationDetailsPage() {
  const params = useParams();
  const collabId = params?.['collabId'];
  if (!collabId) return null;
  return (
    <div className="max-w-2xl mx-auto py-8">
      <CollaborationDetails collabId={Number(collabId)} />
    </div>
  );
}
