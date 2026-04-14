import { baseProcedure, createTRPCRouter,protectedProcedure } from '../init';
 import prisma from '@/lib/db';
export const appRouter = createTRPCRouter({
  getWorkflows: protectedProcedure.query(({ctx})=>{
    // console.log({userId:ctx.auth.user.id})
    return prisma.user.findMany();
  }),
  createWorkflow:protectedProcedure.mutation(()=>{
    return prisma.workflow.create({
      data:{
        name:"test-workflow "
      }
    })
  })
});
 
// export type definition of API
export type AppRouter = typeof appRouter;