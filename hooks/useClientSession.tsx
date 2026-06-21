"use client";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export const useClientSession = (initialSession: Session | null) => {
  const { data: session, status } = useSession();
  const [currentSession, setCurrentSession] = useState(initialSession);
  useEffect(() => {
    if (session) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentSession(session);
    }
  }, [session]);

  useEffect(() => {
    if (initialSession) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentSession(initialSession);
    }
  }, [initialSession]);
  return { data: currentSession, status };
};
