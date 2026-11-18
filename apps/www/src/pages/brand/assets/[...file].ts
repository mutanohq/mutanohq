import type { APIRoute, GetStaticPaths } from "astro";

import { findRepositoryRoot, listAssets, serveAsset } from "../../../lib/brand.ts";

export const getStaticPaths = (() =>
  listAssets(findRepositoryRoot()).map((file) => ({ params: { file } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ params }) => serveAsset(params.file!);
