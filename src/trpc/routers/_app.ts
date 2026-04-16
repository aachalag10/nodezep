import { createTRPCRouter, protectedProcedure } from "../init";
import prisma from "@/lib/db";
export const appRouter = createTRPCRouter({
  getWorkflows: protectedProcedure.query(({ ctx }) => {
    // console.log({userId:ctx.auth.user.id})
    return prisma.user.findMany();
  }),
  createWorkflow: protectedProcedure.mutation(() => {
    //fetch the video
    await new Promise((resolve) => setTimeout(resolve, 3000));

    //Transcribe the video
    await new Promise((resolve) => setTimeout(resolve, 3000));

    //Send the transcription to OpenAI
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return prisma.workflow.create({
      data: {
        name: "test-workflow ",
      },
    });
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
