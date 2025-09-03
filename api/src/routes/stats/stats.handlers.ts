/* eslint-disable style/operator-linebreak */
/* eslint-disable style/arrow-parens */
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import prisma from "prisma/db";

import type { BriefItemsRoute, ListRoute } from "./stats.routes";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  // Calculate statistics
  // const auth = getAuth(c);

  // if (!auth?.userId) {
  //   return c.json(
  //     {
  //       message: "You are not logged in.",
  //     },
  //     HttpStatusCodes.UNAUTHORIZED
  //   );
  // }
  // Products per category
  const categories = await prisma.category.findMany({
    include: {
      products: true,
    },
  });
  const products = await prisma.product.findMany();
  const totalCategories = categories.length;
  const totalProducts = products.length;
  const productsPerCategory = categories.map((category) => ({
    categoryId: category.id,
    categoryName: category.name,
    productCount: products.filter(
      (product) => product.categoryId === category.id
    ).length,
  }));

  // Price statistics
  const prices = products.map((product) => product.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const avgPrice =
    prices.reduce((sum, price) => sum + price, 0) / prices.length;

  const stats = {
    totalCategories,
    totalProducts,
    productsPerCategory,
    priceStats: {
      min: minPrice,
      max: maxPrice,
      average: Math.round(avgPrice * 100) / 100,
    },
    lastUpdated: new Date().toISOString(),
  };
  return c.json(stats, HttpStatusCodes.OK);
};
export const briefItems: AppRouteHandler<BriefItemsRoute> = async (c) => {
  // Products per category
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  const brands = await prisma.brand.findMany({
    select: {
      id: true,
      title: true,
    },
  });
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  const categoryOptions = categories.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
  const brandOptions = brands.map((item) => {
    return {
      label: item.title,
      value: item.id,
    };
  });
  const productOptions = products.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });

  return c.json(
    { productOptions, brandOptions, categoryOptions },
    HttpStatusCodes.OK
  );
};
