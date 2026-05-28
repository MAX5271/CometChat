import { useState } from "react";
import {
  CometChatConversations,
  CometChatUsers,
  CometChatGroups,
  CometChatMessageHeader,
  CometChatMessageList,
  CometChatMessageComposer,
} from "@cometchat/chat-uikit-react";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import CreateGroupModal from "../components/CreateGroupModal";
import GroupDetails from "../components/GroupDetails";
import "./ChatPage.css";

type Tab = "chats" | "users" | "groups";

export default function ChatPage() {
  const [activeTab, setActiveTab] = useState<Tab>("chats");
  const [activeConversation, setActiveConversation] = useState<CometChat.Conversation>();
  const [selectedUser, setSelectedUser] = useState<CometChat.User>();
  const [selectedGroup, setSelectedGroup] = useState<CometChat.Group>();
  
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showGroupDetails, setShowGroupDetails] = useState(false);

  function selectUser(user: CometChat.User) {
    setSelectedUser(user);
    setSelectedGroup(undefined);
    setShowGroupDetails(false);
  }

  function selectGroup(group: CometChat.Group) {
    setSelectedUser(undefined);
    setSelectedGroup(group);
    setShowGroupDetails(false);
  }

  return (
    <div className="chat-page-container">
      <div className="chat-sidebar">
        
        {/* Tab content */}
        <div className="chat-tab-content">
          {activeTab === "chats" && (
            <CometChatConversations
              activeConversation={activeConversation}
              onItemClick={(conv) => {
                setActiveConversation(conv);
                const entity = conv.getConversationWith();
                if (entity instanceof CometChat.User) selectUser(entity);
                else if (entity instanceof CometChat.Group) selectGroup(entity);
              }}
            />
          )}
          {activeTab === "users" && (
            <div className="chat-tab-pane">
              <div className="chat-tab-header">Users</div>
              <CometChatUsers
                activeUser={selectedUser}
                onItemClick={selectUser}
              />
            </div>
          )}
          {activeTab === "groups" && (
            <div className="chat-tab-pane">
              <div className="chat-tab-header">
                <span>Groups</span>
                <button 
                  className="chat-add-btn" 
                  onClick={() => setShowCreateGroup(true)}
                  title="Create Group"
                >
                  +
                </button>
              </div>
              <CometChatGroups
                activeGroup={selectedGroup}
                onItemClick={selectGroup}
              />
            </div>
          )}
        </div>

        {/* Tab bar at the bottom */}
        <div className="chat-tab-bar">
          {(["chats", "users", "groups"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`chat-tab-button ${activeTab === tab ? "active" : ""}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      <div className="chat-main-area">
        {(selectedUser || selectedGroup) ? (
          <>
            <div className="chat-header-container">
              {selectedUser && <CometChatMessageHeader user={selectedUser} />}
              {selectedGroup && (
                <CometChatMessageHeader 
                  group={selectedGroup} 
                  onItemClick={() => setShowGroupDetails(true)} 
                />
              )}
            </div>
            <div className="chat-list-container">
              {selectedUser && <CometChatMessageList user={selectedUser} />}
              {selectedGroup && <CometChatMessageList group={selectedGroup} />}
            </div>
            <div className="chat-composer-container">
              {selectedUser && <CometChatMessageComposer user={selectedUser} />}
              {selectedGroup && <CometChatMessageComposer group={selectedGroup} />}
            </div>
          </>
        ) : (
          <div className="chat-empty-state">
            <svg className="chat-empty-icon" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <h2 className="chat-empty-title">Your Messages</h2>
            <p>Select a user or group from the left to start chatting</p>
          </div>
        )}
      </div>

      {/* Group Details Sidebar */}
      {showGroupDetails && selectedGroup && (
        <GroupDetails 
          group={selectedGroup}
          onClose={() => setShowGroupDetails(false)}
          onDeleteSuccess={() => {
            setShowGroupDetails(false);
            setSelectedGroup(undefined);
            setActiveConversation(undefined);
          }}
        />
      )}

      {/* Create Group Modal */}
      {showCreateGroup && (
        <CreateGroupModal 
          onClose={() => setShowCreateGroup(false)}
          onSuccess={(group: CometChat.Group) => {
            setShowCreateGroup(false);
            selectGroup(group);
            setActiveTab("groups");
          }}
        />
      )}
    </div>
  );
}
