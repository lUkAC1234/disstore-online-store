/* eslint-disable @typescript-eslint/no-explicit-any */
import { PureComponent } from "react";

export interface IReactService<P = object, S = object, SS = any> extends PureComponent<P, S, SS> {}
