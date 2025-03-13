import axios from "axios";
import { Request, Response } from "express";

export const hianimeHlsProxy = async (req: Request, res: Response) => {
  try {
    const url = req.query.url as string;
    const response = await axios.get(url, {
      responseType: 'text',
    });
    const originalContent = response.data as string;
    const proxyBaseUrl = `${process.env.BASE_URL}/hianime-quality-proxy?url=${encodeURIComponent(url.split('/master')[0])}`
    const updatedContent = originalContent
    .split('\n')
    .map((line) => {
      if(line.startsWith('index')) {
        return `${proxyBaseUrl}/${line}`;
      };
      return line;
    })
    .join('\n');

    res.set({
      "Content-Type": "application/vnd.apple.mpegurl",
      "Cache-Control": "no-cache",
    })
    res.send(updatedContent);
  } catch(error: any) {
    console.log(error.message);
  }
}

export const hianimeQaulityProxy = async (req: Request, res: Response) => {
  try {
    const url = req.query.url as string;
    const response = await axios.get(url, {
      responseType: 'text',
    });
    const originalContent = response.data as string;
    const proxyBaseUrl = `${process.env.BASE_URL}/hianime-segment-proxy?url=${encodeURIComponent(url.split('/index')[0])}`
    const updatedContent = originalContent
    .split('\n')
    .map((line) => {
      if(line.startsWith('seg')) {
        return `${proxyBaseUrl}/${line}`;
      };
      return line;
    })
    .join('\n');

    res.set({
      "Content-Type": "application/vnd.apple.mpegurl",
      "Cache-Control": "no-cache",
    })
    res.send(updatedContent);
  } catch(error: any) {
    console.log(error.message);
  }
}

export const hianimeSegmentProxy = async (req: Request, res: Response) => {
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