import { Arg, Mutation, Resolver } from "type-graphql";
import { GraphQLUpload } from "graphql-upload";
import { FileType, Upload } from "./types/file";
import { createWriteStream } from "fs";
import * as path from "path";
import { v4 as uuid } from "uuid";
import { UserInputError } from "apollo-server-core";

@Resolver()
export class FileResolver {
	@Mutation(() => Boolean)
	async uploadFile(
		@Arg("file", () => GraphQLUpload)
		{ createReadStream, filename, mimetype }: Upload,
		@Arg("type") type: FileType
	): Promise<string | boolean> {
		if (
			mimetype != "application/pdf" &&
			mimetype !=
				"application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
			mimetype !== "image/jpeg" &&
			mimetype !== "image/png"
		) {
			throw new UserInputError(
				"Supported file types: PDF, Word, image/jpeg, image/png"
			);
		}

		const url = `/${type.toLowerCase()}s/${
			uuid() + "-" + filename.toLowerCase().split(" ").join("-")
		}`;

		return new Promise(async (resolve, reject) =>
			createReadStream()
				.pipe(createWriteStream(path.join(process.cwd(), "/public", url)))
				.on("finish", () => resolve(`${process.env.BASE_URL + url}`))
				.on("error", () => reject(false))
		);
	}
}
