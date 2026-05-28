import { useState } from "react";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import "./GroupDetails.css";

interface GroupDetailsProps {
  group: CometChat.Group;
  onClose: () => void;
  onDeleteSuccess: () => void;
}

export default function GroupDetails({ group, onClose, onDeleteSuccess }: GroupDetailsProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete the group "${group.getName()}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await CometChat.deleteGroup(group.getGuid());
      onDeleteSuccess();
    } catch (error) {
      console.error("Failed to delete group:", error);
      alert("Failed to delete group. You might not be the owner.");
    } finally {
      setIsDeleting(false);
    }
  };

  const initial = group.getName() ? group.getName().charAt(0).toUpperCase() : "G";

  return (
    <div className="group-details-panel">
      <div className="group-details-header">
        <h3>Group Details</h3>
        <button className="group-details-close" onClick={onClose}>&times;</button>
      </div>
      <div className="group-details-content">
        <div className="group-details-avatar">{initial}</div>
        <div className="group-details-name">{group.getName()}</div>
        <div className="group-details-guid">GUID: {group.getGuid()}</div>
        
        <div className="group-details-actions">
          <button 
            className="group-details-delete-btn"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Group"}
          </button>
        </div>
      </div>
    </div>
  );
}
