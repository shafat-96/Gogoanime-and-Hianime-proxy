import axios from "axios";
import { Request, Response } from "express";
import { editUrl } from "../utils/helper";

export const m3u8Proxy = async (req: Request, res: Response) => {
  try {
    const url = req.query.url as string;
    const response = await axios.get(url, {
      responseType: 'text',
    });
    const editedUrl = editUrl(url);
    const proxyUrl = `${process.env.BASE_URL}/m3u8-quality-proxy?url=${editedUrl}`;
    const originalContent = response.data as string;
    const updatedContent = originalContent
      .split('\n')
      .map((line) => {
        if (line.startsWith('#EXT-X-MEDIA') && line.includes('URI=')) {
          return line.replace(/URI="(.*?)"/, (match, p1) => {
            // Update the URI with the proxy URL
            console.log({ match, p1 })
            return `URI="${proxyUrl}${p1}"`;
          });
        }

        if (line.startsWith('#EXT') || line.startsWith('http')) return line;
        return line ? `${proxyUrl}${line}` : '';
      })
      .join('\n');

    res.set({
      'Content-Type': 'application/vnd.apple.mpegurl',
      'Cache-Control': response.headers['cache-control'],
    });
    res.status(200).send(updatedContent);
  } catch (error: any) {
    console.log(error.message);
  }
};

export const m3u8QualityProxy = async (req: Request, res: Response) => {
  try {
    const url = req.query.url as string;
    const response = await axios.get(url, {
      responseType: 'text',
    });
    const editedUrl = editUrl(url);
    const proxyUrl = `${process.env.BASE_URL}/m3u8-segment-proxy?url=${editedUrl}`;
    const originalContent = response.data as string;
    const updatedContent = originalContent
      .split('\n')
      .map(line => {
        if (line.startsWith('#EXT')) return line;
        return line ? `${proxyUrl}${line}` : '';
      })
      .join('\n');

    res.set({
      'Content-Type': 'application/vnd.apple.mpegurl',
      'Cache-Control': response.headers['cache-control'],
    });
    res.status(200).send(updatedContent);
  } catch (error: any) {
    console.log(error.message);
  }
};

export const m3u8SegmentProxy = async (req: Request, res: Response) => {
  try {
    const url = req.query.url as string;
    const response = await axios.get(url, {
      responseType: 'stream',
    });

    res.set({
      'Content-Type': 'application/vnd.apple.mpegurl',
      'Cache-Control': response.headers['cache-control'],
    });
    response.data.pipe(res);
  } catch (error: any) {
    console.log(error.message);
  }
};