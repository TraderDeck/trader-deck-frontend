import { S3Client, GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: import.meta.env.VITE_LOCAL_AWS === "true"
    ? {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID as string,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY as string,
      }
    : undefined,
});

const BUCKET_NAME = import.meta.env.VITE_S3_BUCKET_NAME as string;
const METADATA_FILE_KEY = "metadata/info.json";

export interface S3File {
  key: string;
  url: string;
}

const fetchAvailableTickers = async (): Promise<Set<string>> => {
  try {
    const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: METADATA_FILE_KEY });
    const response = await s3.send(command);

    if (!response.Body) {
      console.error("Failed to fetch metadata file.");
      return new Set();
    }

    const body = await response.Body.transformToString();
    const data = JSON.parse(body);

    return new Set(data.available_tickers || []);
  } catch (error) {
    console.error("Error fetching metadata file:", error);
    return new Set();
  }
};

export const fetchTickerLogosPresignedUrls = async (tickers: string[]): Promise<S3File[]> => {
  try {
    if (!tickers.length) return [];

    const availableTickers = await fetchAvailableTickers();
    const filteredTickers = tickers.filter((ticker) => availableTickers.has(ticker));

    if (!filteredTickers.length) return [];

    const urls = await Promise.all(
      filteredTickers.map(async (ticker) => {
        const key = `${ticker}.png`;

        try {
          const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key });
          const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
          return { key, url: signedUrl };
        } catch (error) {
          console.warn(`Failed to generate URL for ${ticker}`);
          return null;
        }
      })
    );

    return urls.filter((url): url is S3File => url !== null);
  } catch (error) {
    console.error("Error fetching pre-signed URLs:", error);
    throw new Error("Failed to load images");
  }
};
