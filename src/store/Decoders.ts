import { resourceDecoder } from "../exo_modules/Resource/Decoders";
import Decoder, { array, field, oneOf, string, succeed, number } from "jsonous";
import { Card, CardResource, CardType } from "./Types";
import { stringLiteral } from "@execonline-inc/decoders";
import Task from "taskarian";
import { noop } from "@kofno/piper";

export const fromDecoderAny =
  <T>(decoder: Decoder<T>) =>
  (value: unknown): Task<string, T> =>
    new Task((reject, resolve) => {
      decoder.decodeAny(value).cata({ Ok: resolve, Err: reject });
      return noop;
    });

export const cardTypeDecoder: Decoder<CardType> = oneOf<CardType>([
  stringLiteral<CardType>("TODO"),
  stringLiteral<CardType>("DONE"),
  stringLiteral<CardType>("IN_PROGRESS"),
]);

export const cardDecoder: Decoder<Card> = succeed({})
  .assign("id", field("id", string))
  .assign("name", field("name", string))
  .assign("description", field("description", string))
  .assign("status", field("status", cardTypeDecoder))
  .assign("created", field("created", number))
  .assign("lastUpdated", field("lastUpdated", number));

export const anyCardDecoder = fromDecoderAny(cardDecoder);

export const cardResourceDecoder: Decoder<CardResource> =
  resourceDecoder(cardDecoder);

export const cardArrayDecoder: Decoder<Card[]> = array(cardDecoder);

export const decodeCards = (cards: unknown) =>
  fromDecoderAny(cardArrayDecoder)(cards).mapError((e) => ({
    err: `decoder error ${e}`,
  }));

export const idDecoder: Decoder<string> = string;

export const decodeId = (id: unknown) =>
  fromDecoderAny(idDecoder)(id).mapError((e) => ({
    err: `decoder error ${e}`,
  }));
