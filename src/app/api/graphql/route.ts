import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { PrismaClient } from "@prisma/client";
import prisma  from "../../../../prisma/db";

export type Context = {
  prisma: PrismaClient
}

const typeDefs = `#graphql
  type User {
    email: String
    name: String
  }

  type Query {
    users: [User]
  }

  type Mutation {
    addUser(email: String, name: String): User
  }
`;

const resolvers = {
  Query: {
    users: async (parent: any, args: any, context: Context) => {
      return await context.prisma.user.findMany();
    },
  },
  Mutation: {
    addUser: async (parent: any, args: any, context: Context) => {
      return await context.prisma.user.create({
        data: {
          email: args.email,
          name: args.name,
        }
      });
    }
  }
};

const apolloServer = new ApolloServer<Context>({
  resolvers,
  typeDefs,
});

const handler = startServerAndCreateNextHandler(apolloServer, {
  context: async(req, res) => ({req, res, prisma})
});

export { handler as GET, handler as POST };
