import { SetMetadata } from "@nestjs/common";
import { GUARD_PUBLIC_KEY } from "@src/core/constants";

export const Public = () => SetMetadata(GUARD_PUBLIC_KEY, true)