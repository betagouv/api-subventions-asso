import { FileStatus } from "./FileStatus";

const FileTags = { ...FileStatus } as const;
type FileTags = (typeof FileTags)[keyof typeof FileTags];
export default FileTags;
