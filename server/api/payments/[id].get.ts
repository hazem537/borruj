import { defineEventHandler, getRouterParam, createError } from "h3";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const config = useRuntimeConfig();

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Payment or Invoice ID is required",
    });
  }

  // If mock payment ID used for offline sandbox demo
  if (id.startsWith("mock_") || id.startsWith("inv_test_mock")) {
    return {
      success: true,
      id,
      status: "paid",
      isPaid: true,
      amount: 92000,
      currency: "SAR",
      description: "حجز تجريبي - بيئة ميسار Sandbox",
      createdAt: new Date().toISOString(),
      isSandbox: true,
    };
  }

  const secretKey = config.moyasarSecretKey || "";
  const authHeader = "Basic " + Buffer.from(`${secretKey}:`).toString("base64");

  try {
    // Check if ID is a payment ID or an invoice ID
    const endpoint = id.startsWith("inv_")
      ? `https://api.moyasar.com/v1/invoices/${id}`
      : `https://api.moyasar.com/v1/payments/${id}`;

    const response: any = await $fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: authHeader,
      },
    });

    const isPaid = response.status === "paid" || response.status === "authorized";

    return {
      success: true,
      id: response.id,
      status: response.status,
      isPaid,
      amount: response.amount,
      currency: response.currency,
      description: response.description,
      fee: response.fee,
      cardCompany: response.source?.company || response.source?.type || "Card",
      cardMaskedPan: response.source?.masked_number || "",
      createdAt: response.created_at,
      isSandbox: secretKey.startsWith("sk_test_"),
    };
  } catch (err: any) {
    console.error("Moyasar verification error:", err?.data || err?.message || err);
    throw createError({
      statusCode: err?.statusCode || 500,
      statusMessage: err?.data?.message || err?.message || "Failed to verify payment with Moyasar gateway",
    });
  }
});
