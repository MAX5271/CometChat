import React, { useEffect, useState, createContext, useContext } from "react";
import { CometChatUIKit, UIKitSettingsBuilder } from "@cometchat/chat-uikit-react";

interface CometChatContextValue {
  isReady: boolean;
  error: string | null;
}

const CometChatContext = createContext<CometChatContextValue>({
  isReady: false,
  error: null,
});

export const useCometChat = () => useContext(CometChatContext);

// Module-level state prevents both double-init AND double-login in React StrictMode
let initialized = false;
let loginInFlight: Promise<unknown> | null = null;

async function ensureLoggedIn(uid: string, authToken?: string): Promise<void> {
  const existing = await CometChatUIKit.getLoggedinUser();
  if (existing) {
    if (existing.getUid() === uid) {
      return;
    } else {
      await CometChatUIKit.logout();
    }
  }
  if (loginInFlight) {
    await loginInFlight;
    return;
  }
  loginInFlight = authToken
    ? CometChatUIKit.loginWithAuthToken(authToken)
    : CometChatUIKit.login(uid);
  try {
    await loginInFlight;
  } finally {
    loginInFlight = null;
  }
}

interface CometChatProviderProps {
  uid: string;
  children: React.ReactNode;
}

export function CometChatProvider({ uid, children }: CometChatProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function setup() {
      try {
        if (!initialized) {
          initialized = true;

          const appId = import.meta.env.VITE_COMETCHAT_APP_ID;
          const region = import.meta.env.VITE_COMETCHAT_REGION;
          const authKey = import.meta.env.VITE_COMETCHAT_AUTH_KEY;

          if (!appId || appId === "YOUR_APP_ID_HERE") {
             throw new Error("Missing CometChat credentials. Please update your .env file.");
          }

          const settings = new UIKitSettingsBuilder()
            .setAppId(appId)
            .setRegion(region)
            .setAuthKey(authKey)
            .subscribePresenceForAllUsers()
            .build();

          await CometChatUIKit.init(settings);
        }

        // Using the passed uid
        await ensureLoggedIn(uid);

        setIsReady(true);
      } catch (e) {
        setError(String(e));
      }
    }

    setup();
  }, [uid]);

  if (error) {
    return (
      <div style={{ color: "red", padding: 16, fontFamily: "monospace" }}>
        CometChat Error: {error}
      </div>
    );
  }

  if (!isReady) return null;

  return (
    <CometChatContext.Provider value={{ isReady, error }}>
      {children}
    </CometChatContext.Provider>
  );
}
