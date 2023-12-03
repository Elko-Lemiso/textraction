// pages/api/extract.js
import multer from "multer";
import {
  TextractClient,
  AnalyzeDocumentCommand,
} from "@aws-sdk/client-textract";

const upload = multer({ storage: multer.memoryStorage() });
const uploadMiddleware = upload.single("file");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  uploadMiddleware(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      res.status(500).send("Multer error during upload");
      return;
    } else if (err) {
      res.status(500).send("Unknown error during upload");
      return;
    }

    const textractClient = new TextractClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const { buffer } = req.file;

    const command = new AnalyzeDocumentCommand({
      Document: { Bytes: buffer },
      FeatureTypes: ["FORMS"],
    });

    try {
      const textractResponse = await textractClient.send(command);

      // Process the response to extract lines of text
      const linesOfText = textractResponse.Blocks.filter(
        (block) => block.BlockType === "LINE"
      ).map((line) => line.Text);

      res.status(200).json({ lines: linesOfText });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error processing the file");
    }
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
