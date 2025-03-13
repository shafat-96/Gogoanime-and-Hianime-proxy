import { Request, Response } from "express";
import axios from "axios";

export const hlsProxy = async (req: Request, res: Response) => {
  try {
    const url = req.query.url as string;
    const response = await axios.get(url, {
      responseType: 'text',
    });
    const originalContent = response.data as string;
    const proxyBaseUrl = `${process.env.BASE_URL}/quality-proxy?url=${encodeURIComponent(url.split('/ep')[0])}`
    const updatedContent = originalContent
      .split('\n')
      .map(line => {
        if (line.startsWith('ep')) {
          return `${proxyBaseUrl}/${line}`;
        }
        return line;
      })
      .join('\n');

    res.set({
      'Content-Type': 'application/vnd.apple.mpegurl',
      'Cache-Control': 'no-cache',
    });
    res.send(updatedContent);
  } catch (error: any) {
    console.log(error.message);
  }
}

export const qualityProxy = async (req: Request, res: Response) => {
  try {
    const url = req.query.url as string;
    const response = await axios.get(url, {
      responseType: 'text',
    });
    const originalContent = response.data as string;
    const proxyBaseUrl = `${process.env.BASE_URL}/segment-proxy?url=${url.split('/ep')[0]}`
    const updatedContent = originalContent
      .split('\n')
      .map(line => {
        if (line.startsWith('ep')) {
          return `${proxyBaseUrl}/${line}`;
        }
        return line;
      })
      .join('\n');

    res.set({
      'Content-Type': 'application/vnd.apple.mpegurl',
      'Cache-Control': 'no-cache',
    });
    res.send(updatedContent);
  } catch (error: any) {
    console.log(error.message);
  }
}

export const segmentProxy = async (req: Request, res: Response) => {
  try {
    const url = req.query.url as string;
    const response = await axios.get(url, {
      responseType: 'stream',
    });

    res.set({
      'Content-Type': 'application/vnd.apple.mpegurl',
      'Cache-Control': 'no-cache',
    });
    response.data.pipe(res);
  } catch (error: any) {
    console.log(error.message);
  }
}