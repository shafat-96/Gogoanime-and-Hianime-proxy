import axios from "axios";
import { Request, Response } from "express";

const allowedExtensions = ['.ts', '.png', '.jpg', '.webp', '.ico', '.html', '.js', '.css', '.txt'];

export const m3u8Proxy = async (req: Request, res: Response) => {
  try {
    const url = req.query.url as string;

    if (!url) return res.status(400).json("url is required");

    if (allowedExtensions.some(ext => url.endsWith(ext))) {
      const response = await axios.get(url, {
        responseType: 'stream',
        headers: {
          Accept: "*/*",
          Referer: "https://megacloud.club/",
        }
      });
      const headers = Object.fromEntries(response.headers as any);
      res.cacheControl = { maxAge: headers['cache-control'] }
      res.set(headers);
      return response.data.pipe(res);
    }

    const response = await axios.get(url, {
      responseType: 'text',
      headers: {
        Accept: "*/*",
        Referer: "https://megacloud.club/",
      }
    });
    const headers = Object.fromEntries(response.headers as any);
    const originalContent = response.data as string;
    const modifiedContent = originalContent.split("\n").map((line) => {
      if (line.endsWith('.m3u8') || line.endsWith('.ts')) {
        return `m3u8-proxy?url=${url.replace(/[^/]+$/, "")}${line}`;
      }

      if (allowedExtensions.some(ext => line.endsWith(ext))) {
        return `m3u8-proxy?url=${line}`
      }

      return line;
    }).join("\n");

    res.cacheControl = { maxAge: headers['cache-control'] }
    res.set(headers);
    return res.status(200).send(modifiedContent);
  } catch (error: any) {
    console.log(error.message)
  }
}