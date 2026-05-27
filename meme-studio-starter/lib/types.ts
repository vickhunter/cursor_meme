import { z } from "zod"
import type { SocialFormatId } from "./formats"

export const SceneNodeSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("image"),
    id: z.string(),
    src: z.string(),
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
    rotation: z.number().default(0),
  }),
  z.object({
    type: z.literal("text"),
    id: z.string(),
    text: z.string(),
    x: z.number(),
    y: z.number(),
    fontFamily: z.string(),
    fontSize: z.number(),
    fill: z.string(),
    stroke: z.string().nullable(),
    strokeWidth: z.number().default(0),
    fontStyle: z.string().default("normal"),
    align: z.enum(["left", "center", "right"]).default("center"),
    width: z.number().default(600),
    rotation: z.number().default(0),
  }),
  z.object({
    type: z.literal("rect"),
    id: z.string(),
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
    fill: z.string(),
    rotation: z.number().default(0),
  }),
])

export type SceneNode = z.infer<typeof SceneNodeSchema>

export const SceneSchema = z.object({
  background: z.string().default("#ffffff"),
  nodes: z.array(SceneNodeSchema).default([]),
})

export type Scene = z.infer<typeof SceneSchema>

export type MemeRecord = {
  id: string
  title: string
  scene: Scene
  workingFormat: SocialFormatId
  updatedAt: number
}

export const EMPTY_SCENE: Scene = {
  background: "#ffffff",
  nodes: [],
}
