import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { AssetService } from "../asset.service";
import { OrderService } from "../order.service";
import { WalletService } from "../wallet.service";
import { PrismaService } from "src/@orm/prisma/prisma.service";
import { WalletAsset as WalletAssetSchema } from "src/@mongoose/wallet-asset.schema";
import { AssetDaily as AssetDailySchema } from "src/@mongoose/asset-daily.schema";
import { Asset as AssetSchema } from "src/@mongoose/asset.schema";
import { Order as OrderSchema } from "src/@mongoose/order.schema";
import { Model } from "mongoose";
import { ClientKafka, Transport } from "@nestjs/microservices";

const prismaService = new PrismaService();
const kafkaOptions: any = {
  client: {
    clientId: "orders",
    brokers: ["improved-lemur-14028-us1-kafka.upstash.io:9092"],
    sasl: {
      mechanism: "scram-sha-256",
      username: process.env.UPSTASH_KAFKA_USERNAME,
      password: process.env.UPSTASH_KAFKA_PASSWORD,
    },
    ssl: true,
  },
};
let walletService: WalletService;
let assetService: AssetService;
let orderService: OrderService;

describe("UserService", () => {
  beforeEach(async () => {
    walletService = new WalletService(prismaService, Model<WalletAssetSchema>);
    assetService = new AssetService(
      prismaService,
      Model<AssetSchema>,
      Model<AssetDailySchema>
    );
    orderService = new OrderService(
      prismaService,
      new ClientKafka(kafkaOptions),
      Model<OrderSchema>
    );
  });

  afterEach(async () => {
    // deletar todas infomações do banco de dados
    // for (const repositoryKey in repositories) {
    //   if (repositories.hasOwnProperty(repositoryKey)) {
    //     const repository = repositories[repositoryKey];
    //     await repository.deleteAll();
    //   }
    // }
  });

  // it("must be able create an instance of User", async () => {
  //   const user = factory.getUser();
  //   expect(await userService.createUser(user)).toBeInstanceOf(User);
  // });

  // it("must be not able to create a user with an email already existing in the repository", async () => {
  //   const user1 = factory.getUser({
  //     username: "link",
  //     email: "example@email.com",
  //   });
  //   const user2 = factory.getUser({
  //     username: "zelda",
  //     email: "example@email.com",
  //   });
  //   expect(await userService.createUser(user1)).toBeInstanceOf(User);
  //   await expect(userService.createUser(user2)).rejects.toThrowError(
  //     userErrors.emailAlreadyExists
  //   );
  // });

  // it("must be not able to create a user with an username already existing in the repository", async () => {
  //   const user1 = factory.getUser({
  //     username: "gameboy",
  //     email: "satoshitajiri@email.com",
  //   });
  //   const user2 = factory.getUser({
  //     username: "gameboy",
  //     email: "pokemoncompany@email.com",
  //   });
  //   expect(await userService.createUser(user1)).toBeInstanceOf(User);
  //   await expect(userService.createUser(user2)).rejects.toThrowError(
  //     userErrors.usernameAlreadyExists
  //   );
  // });

  // it("must be mandatory to use the id when updating a user", async () => {
  //   const user = factory.getUser();
  //   const newSocialLinks: ISocialLinks = {
  //     email: "email@example.com",
  //     github: "https://github.com/stardusteight-d4c",
  //   };
  //   await expect(
  //     userService.updateUser({
  //       ...user,
  //       socialLinks: newSocialLinks,
  //     })
  //   ).rejects.toThrowError(userErrors.userNotFoundWithId(undefined));
  // });

  // it("must be able to update a user partially", async () => {
  //   const user = factory.getUser();
  //   const userInstance = await userService.createUser(user);
  //   const userId = userInstance.reflect.id;
  //   const newSocialLinks: ISocialLinks = {
  //     email: "email@example.com",
  //     github: "https://github.com/stardusteight-d4c",
  //   };
  //   delete user.password;
  //   delete user.username;
  //   delete user.email;
  //   delete user.avatar;
  //   delete user.userRole;
  //   const updatedUser = await userService.updateUser({
  //     ...user,
  //     id: userId,
  //     socialLinks: newSocialLinks,
  //   });
  //   delete user.socialLinks;
  //   const newUpdatedUser = await userService.updateUser({
  //     ...user,
  //     id: userId,
  //   });
  //   const finalUserState = await userService.getUserById(userId);
  //   const initialState = userInstance.reflect;
  //   const finalState = finalUserState.reflect;
  //   expect(updatedUser.reflect.socialLinks).toStrictEqual(newSocialLinks);
  //   expect(updatedUser.reflect.id).toStrictEqual(userInstance.reflect.id);
  //   expect(finalState["id"]).toStrictEqual(initialState["id"]);
  //   expect(finalState["password"]).toStrictEqual(initialState["password"]);
  //   expect(finalState["username"]).toStrictEqual(initialState["username"]);
  //   expect(finalState["email"]).toStrictEqual(initialState["email"]);
  //   expect(finalState["avatar"]).toStrictEqual(initialState["avatar"]);
  //   expect(finalState["userRole"]).toStrictEqual(initialState["userRole"]);
  //   expect(newUpdatedUser.reflect["socialLinks"]).toStrictEqual(
  //     finalState["socialLinks"]
  //   );
  // });

  // it("must be able to delete a user", async () => {
  //   const user = factory.getUser();
  //   const userInstance = await userService.createUser(user);
  //   const userId = userInstance.reflect.id;
  //   await userService.deleteUser(userId);
  //   expect(await userService.getUserById(userId)).toStrictEqual(undefined);
  // });

  // it("must be able get a user by id", async () => {
  //   const user = factory.getUser();
  //   const userInstance = await userService.createUser(user);
  //   const userId = userInstance.reflect.id;
  //   expect(await userService.getUserById(userId)).toStrictEqual(userInstance);
  // });

  // it("must be able get a user by email", async () => {
  //   const user = factory.getUser();
  //   const userInstance = await userService.createUser(user);
  //   const userEmail = userInstance.reflect.email;
  //   expect(await userService.getUserByEmail(userEmail)).toStrictEqual(
  //     userInstance
  //   );
  // });

  // it("must be able get a user by username", async () => {
  //   const user = factory.getUser();
  //   const userInstance = await userService.createUser(user);
  //   const username = userInstance.reflect.username;
  //   expect(await userService.getUserByUsername(username)).toStrictEqual(
  //     userInstance
  //   );
  // });

  // it("must be able get a users by username", async () => {
  //   const user1 = factory.getUser({
  //     username: "browser",
  //     email: "supermario@email.com",
  //   });
  //   const user2 = factory.getUser({
  //     username: "browsernavigator",
  //     email: "firefox@email.com",
  //   });
  //   const user3 = factory.getUser({
  //     username: "crash",
  //     email: "crashbandicoot@email.com",
  //   });
  //   await userService.createUser(user1);
  //   await userService.createUser(user2);
  //   await userService.createUser(user3);
  //   expect(await userService.getUsersByUsername("browser")).toHaveLength(2);
  // });
});
