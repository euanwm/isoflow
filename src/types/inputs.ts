import z from 'zod';
import {
  iconInput,
  nodeInput,
  connectorAnchorInput,
  connectorInput,
  textBoxInput,
  rectangleInput,
  connectorStyleEnum
} from 'src/validation/sceneItems';
import { Coords } from 'src/types';
import { sceneInput } from 'src/validation/scene';
import type { EditorModeEnum, MainMenuOptions } from './common';

export type ConnectorStyleEnum = z.infer<typeof connectorStyleEnum>;
export type IconInput = z.infer<typeof iconInput>;
export type NodeInput = z.infer<typeof nodeInput>;
export type ConnectorAnchorInput = z.infer<typeof connectorAnchorInput>;
export type ConnectorInput = z.infer<typeof connectorInput>;
export type TextBoxInput = z.infer<typeof textBoxInput>;
export type RectangleInput = z.infer<typeof rectangleInput>;
export type SceneInput = z.infer<typeof sceneInput>;

export type InitialScene = Partial<SceneInput> & {
  zoom?: number;
  scroll?: Coords;
};

export interface IsoflowProps {
  initialScene?: InitialScene;
  mainMenuOptions?: MainMenuOptions;
  onSceneUpdated?: (scene: SceneInput) => void;
  width?: number | string;
  height?: number | string;
  enableDebugTools?: boolean;
  editorMode?: keyof typeof EditorModeEnum;
}
