import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

interface LogActivityParams {
  userId: string;
  action: string;
  details?: string;
  entityId?: string;
  entityType?: string;
}

export const logActivity = async ({
  userId,
  action,
  details = "",
  entityId = "",
  entityType = ""
}: LogActivityParams) => {
  try {
    const logRef = collection(db, "activityLogs");
    await addDoc(logRef, {
      userId,
      action,
      details,
      entityId,
      entityType,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("Error logging activity:", error);
  }
}; 