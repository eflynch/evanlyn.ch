import { Tree } from "./immutable-tree";

export type MainState = {
    magnolia:{tree:Tree, headSerial:string|null, focusSerial:string|null},
    whose:'mine'|'yours'|'secret';
    synchronize:'ok'|'pending'|'failed';
};