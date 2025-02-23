import { getBaseURL } from "@/lib/actions";

export async function clearProducts() {
  try {
    const baseURL = await getBaseURL();

    const response = await fetch(`${baseURL}/api/user/clear-products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to toggle like");

    const data = await response.json();

    if (!data.success) {
      throw new Error("Server failed to update like status");
    }
  } catch (error: any) {
    console.error(error);
  }
}
