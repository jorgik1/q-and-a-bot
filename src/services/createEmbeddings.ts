import { TextEmbedding } from "../types/file";
import { getEmbeddingsForText } from "./getEmbeddingsForText";

export type Embeddings = {
  meanEmbedding: number[];
  chunks: TextEmbedding[];
};

export async function createEmbeddings({
  text,
  maxCharLength,
}: {
  text: string;
  maxCharLength?: number;
}): Promise<Embeddings> {
  try {
    const textEmbeddings = await getEmbeddingsForText({ text, maxCharLength });

    if (textEmbeddings.length <= 1) {
      return {
        meanEmbedding: textEmbeddings[0]?.embedding ?? [],
        chunks: textEmbeddings,
      };
    }

    const embeddingLength = textEmbeddings[0].embedding.length;
    const meanEmbedding = Array(embeddingLength).fill(0);

    for (const textEmbedding of textEmbeddings) {
      for (let i = 0; i < embeddingLength; i++) {
        meanEmbedding[i] += textEmbedding.embedding[i];
      }
    }

    for (let i = 0; i < embeddingLength; i++) {
      meanEmbedding[i] /= textEmbeddings.length;
    }

    return {
      meanEmbedding,
      chunks: textEmbeddings,
    };
  } catch (error: any) {
    console.log("Error: ", error);
    return {
      meanEmbedding: [],
      chunks: [],
    };
  }
}
