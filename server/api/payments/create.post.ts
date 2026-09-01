import { defineEventHandler, readBody, createError } from "h3";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  const { amountHalalas, description, bookingId, guestName, guestEmail, guestPhone, callbackUrl } = body || {};

  if (!amountHalalas || amountHalalas <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Amount in Halalas is required and must be greater than 0",
    });
  }

  const secretKey = config.moyasarSecretKey || "sk_test_mock";
  const isMockSecret = !secretKey || secretKey.includes("mock") || secretKey === "sk_test_YourSecretKeyHere";

  // If running with mock/placeholder test key in dev without live API credentials
  if (isMockSecret) {
    const mockInvoiceId = `inv_test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const targetCallback = callbackUrl || "/booking/callback";
    const redirectUrl = `${targetCallback}?id=mock_pay_${Date.now()}&status=paid&message=Approved&bookingId=${bookingId || ""}&amount=${amountHalalas}`;

    return {
      success: true,
      invoiceId: mockInvoiceId,
      url: redirectUrl,
      isSandbox: true,
      amountHalalas,
      currency: "SAR",
    };
  }

  try {
    const authHeader = "Basic " + Buffer.from(`${secretKey}:`).toString("base64");

    const payload = {
      amount: amountHalalas,
      currency: "SAR",
      description: description || "حجز خدمة فندقية - مؤسسة بروج المميزة للسياحة",
      callback_url: callbackUrl,
      metadata: {
        bookingId: bookingId || "",
        guestName: guestName || "",
        guestEmail: guestEmail || "",
        guestPhone: guestPhone || "",
        licenseNumber: "73103970",
      },
    };

    const response: any = await $fetch("https://api.moyasar.com/v1/invoices", {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: payload,
    });

    return {
      success: true,
      invoiceId: response.id,
      url: response.url,
      status: response.status,
      amountHalalas: response.amount,
      currency: response.currency,
      isSandbox: secretKey.startsWith("sk_test_"),
    };
  } catch (err: any) {
    console.error("Moyasar create invoice error:", err?.data || err?.message || err);
    throw createError({
      statusCode: err?.statusCode || 500,
      statusMessage: err?.data?.message || err?.message || "Failed to create payment invoice with Moyasar gateway",
    });
  }
});
