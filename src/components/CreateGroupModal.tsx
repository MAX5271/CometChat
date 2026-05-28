import { useState, useRef } from "react";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { CometChatUsers } from "@cometchat/chat-uikit-react";
import "./CreateGroupModal.css";

interface CreateGroupModalProps {
  onClose: () => void;
  onSuccess: (group: CometChat.Group) => void;
}

export default function CreateGroupModal({ onClose, onSuccess }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const selectedUsersRef = useRef<Set<string>>(new Set());

  const handleSelect = (user: CometChat.User, selected: boolean) => {
    if (selected) {
      selectedUsersRef.current.add(user.getUid());
    } else {
      selectedUsersRef.current.delete(user.getUid());
    }
  };

  const handleCreate = async () => {
    if (!groupName.trim()) return;

    setIsCreating(true);
    try {
      // Create a unique GUID for the group
      const guid = `group_${Date.now()}`;
      
      const group = new CometChat.Group(guid, groupName.trim(), CometChat.GROUP_TYPE.PUBLIC);
      const createdGroup = await CometChat.createGroup(group);

      const uids = Array.from(selectedUsersRef.current);
      if (uids.length > 0) {
        const members = uids.map(uid => new CometChat.GroupMember(uid, CometChat.GROUP_MEMBER_SCOPE.PARTICIPANT));
        await CometChat.addMembersToGroup(guid, members, []);
      }

      onSuccess(createdGroup);
    } catch (error) {
      console.error("Failed to create group:", error);
      alert("Failed to create group. See console for details.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="create-group-overlay">
      <div className="create-group-modal">
        <div className="create-group-header">
          <h2>Create New Group</h2>
          <button className="create-group-close" onClick={onClose}>&times;</button>
        </div>
        <div className="create-group-content">
          <div className="create-group-input-wrapper">
            <input
              type="text"
              placeholder="Enter Group Name"
              className="create-group-input"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              disabled={isCreating}
            />
          </div>
          <div className="create-group-users">
            <CometChatUsers
              // @ts-ignore - selectionMode exists in v6 typed as enum but 1 is multiple
              selectionMode={1}
              onSelect={handleSelect}
              showSelectedUsersPreview={true}
            />
          </div>
        </div>
        <div className="create-group-footer">
          <button 
            className="create-group-submit"
            onClick={handleCreate}
            disabled={!groupName.trim() || isCreating}
          >
            {isCreating ? "Creating..." : "Create Group"}
          </button>
        </div>
      </div>
    </div>
  );
}
