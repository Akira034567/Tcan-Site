import type { APIRoute, GetStaticPaths } from 'astro';
import { cardFace, FACES, type FaceId } from '../../lib/card/faces.ts';

export const getStaticPaths = (() =>
  FACES.flatMap((face) => [
    { params: { face }, props: { face, uv: false } },
    { params: { face: `${face}-uv` }, props: { face, uv: true } },
  ])) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) =>
  new Response(cardFace(props.face as FaceId, props.uv as boolean), {
    headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' },
  });
