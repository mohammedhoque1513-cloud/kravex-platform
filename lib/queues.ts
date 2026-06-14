import { Queue } from "bullmq";
import { getRedis } from "@/lib/cache";

type JobPayload = Record<string, unknown>;

const directJobs: Array<{ queue: string; name: string; payload: JobPayload; createdAt: string }> = [];
const queues = new Map<string, Queue>();

export function getQueue(name: "emails" | "pdfs" | "reconciliation" | "backups") {
  const redis = getRedis();
  if (!redis) return null;
  const existing = queues.get(name);
  if (existing) return existing;
  const queue = new Queue(name, { connection: redis as any });
  queues.set(name, queue);
  return queue;
}

export async function enqueueJob(queueName: "emails" | "pdfs" | "reconciliation" | "backups", jobName: string, payload: JobPayload) {
  const queue = getQueue(queueName);
  if (queue) {
    await queue.add(jobName, payload, {
      attempts: 3,
      backoff: { type: "exponential", delay: 5000 },
      removeOnComplete: 100,
      removeOnFail: 1000,
    });
    return { mode: "redis", queue: queueName, job: jobName };
  }
  directJobs.push({ queue: queueName, name: jobName, payload, createdAt: new Date().toISOString() });
  return { mode: "local", queue: queueName, job: jobName };
}

export function listLocalQueuedJobs() {
  return directJobs;
}
