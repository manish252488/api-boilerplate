import * as tf from "@tensorflow/tfjs-node";
import "@tensorflow/tfjs-node-gpu";
import * as use from "@tensorflow-models/universal-sentence-encoder";
const stringSimilarity = require("string-similarity");
const Tokenizer = require("sentence-tokenizer");
import path from "path";
import fs from "fs";
const movie_lines = fs
  .readFileSync(path.resolve("src/data/whatsapp.txt"))
  .toString();
let questions = [];
let responses = [];
const lines = movie_lines.split("\n");
lines.forEach((line, index) => {
  if (line) {
    let splitted = line.split("++++++++");
    let current = "";
    if (splitted.length > 1) {
      if (splitted[1].indexOf('$user1')===1) {
          current=splitted[2];
        if (lines[index + 1].split("++++++++").length === 1) {
          current += lines[index + 1];
        }
        questions.push(current);
      } else if (splitted[1].indexOf('$user2')===1) {
        current = splitted[2];
        if (lines[index + 1].split("++++++++").length === 1) {
          current += lines[index + 1];
        }
        responses.push(current);
      }
    }
  }
});

const dotProduct = (xs, ys) => {
  const sum = (xs) => (xs ? xs.reduce((a, b) => a + b, 0) : undefined);

  return xs.length === ys.length
    ? sum(zipWith((a, b) => a * b, xs, ys))
    : undefined;
};

const zipWith = (f, xs, ys) => {
  const ny = ys.length;
  return (xs.length <= ny ? xs : xs.slice(0, ny)).map((x, i) => f(x, ys[i]));
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export async function chat(req, res) {
  try {
        const model = await use.loadQnA();
        const text = req.query.message;
         let getSimilar = [];
        let filteredRes = [];
        let match = stringSimilarity.findBestMatch(text, questions);
        if (match.ratings && match.ratings.length > 0) {
          match.ratings.forEach(async (_, i) => {
            if (match.ratings[i].rating > 0.6) {
              filteredRes.push(responses[i]);
              getSimilar.push(match.ratings[i].target);
            }
          });
          let tokenize = new Tokenizer("Chuck");
          tokenize.setEntry(text);
          let tokens = tokenize.getSentences();
          const numSamples = 10;
          let randomOffset = Math.floor(Math.random() * getSimilar.length);
          const input = {
            queries: tokens,
            responses: getSimilar.slice(
              randomOffset,
              randomOffset + numSamples
            ),
          };
          filteredRes = filteredRes.slice(
            randomOffset,
            randomOffset + numSamples
          );
         let embeddings = model.embed(input);
         let scores =[];
        tf.tidy(() => {
          const embed_query = embeddings["queryEmbedding"].arraySync();
          const embed_responses = embeddings["responseEmbedding"].arraySync();

          embed_responses.forEach(async (response) => {
            scores.push(dotProduct(embed_query[0], response));
          });
        });
        embeddings.queryEmbedding.dispose();
        embeddings.responseEmbedding.dispose();
        let id = scores.indexOf(Math.max(...scores)); 
     return res.status(200).send(filteredRes[id] ? filteredRes[id] : "what?")
    }else 
    return res.status(200).send('unable to process!');
  } catch (err) {
    return res.send("error");
  }
}
