import { prisma } from "./prisma";
import type { ANALYTICS_EVENT_TYPES } from "./constants";

type EventType = (typeof ANALYTICS_EVENT_TYPES)[number];

export async function logEvent(input: {
  eventType: EventType;
  productId?: string | null;
  userId?: string | null;
  sessionId?: string | null;
  metadata?: Record<string, unknown> | null;
}) {
  try {
    await prisma.analyticsEvent.create({
      data: {
        eventType: input.eventType,
        productId: input.productId ?? null,
        userId: input.userId ?? null,
        sessionId: input.sessionId ?? null,
        metadata: input.metadata ? JSON.stringify(input.metadata) : null,
      },
    });
  } catch (error) {
    console.error("analytics log failed", error);
  }
}
