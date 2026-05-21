"use server";

import {
  skincareAdvisor,
  type SkincareAdvisorInput,
  type SkincareAdvisorOutput,
} from "@/ai/flows/ai-powered-skincare-advisor-flow";

type Result =
  | { success: true; data: SkincareAdvisorOutput }
  | { success: false; error: string };

export async function getSkincareAdvice(input: SkincareAdvisorInput): Promise<Result> {
  try {
    const data = await skincareAdvisor(input);
    return { success: true, data };
  } catch (err) {
    console.error("[skincareAdvisor]", err);
    return { success: false, error: "Unable to generate recommendations. Please try again." };
  }
}
