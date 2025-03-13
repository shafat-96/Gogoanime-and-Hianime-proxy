import express from 'express';
import { hlsProxy, qualityProxy, segmentProxy } from '../controllers/proxy';
import { hianimeHlsProxy, hianimeQaulityProxy, hianimeSegmentProxy } from '../controllers/hianime-proxy';
import { m3u8Proxy, m3u8QualityProxy, m3u8SegmentProxy } from '../controllers/m3u8-proxy';

export const router = express.Router();

router.get('/hls-proxy', hlsProxy);

router.get('/quality-proxy', qualityProxy);

router.get('/segment-proxy', segmentProxy);

router.get('/hianime-hls-proxy', hianimeHlsProxy);

router.get('/hianime-quality-proxy', hianimeQaulityProxy);

router.get('/hianime-segment-proxy', hianimeSegmentProxy);

router.get('/m3u8-proxy', m3u8Proxy);

router.get('/m3u8-quality-proxy', m3u8QualityProxy);

router.get('/m3u8-segment-proxy', m3u8SegmentProxy);