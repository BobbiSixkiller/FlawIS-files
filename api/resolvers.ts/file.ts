import { Arg, Authorized, Mutation, Resolver } from "type-graphql";
import { GraphQLUpload } from "graphql-upload";
import { FileType, Upload } from "./types/file";
import { createWriteStream } from "fs";
import * as path from "path";
import { v4 as uuid } from "uuid";
import { UserInputError } from "apollo-server-core";

@Resolver()
export class FileResolver {
	@Authorized()
	@Mutation(() => String)
	async uploadFile(
		@Arg("file", () => GraphQLUpload)
		{ createReadStream, filename, mimetype }: Upload,
		@Arg("type", () => FileType) filetype: FileType
	): Promise<string> {
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

		const url =
			filetype +
			"/" +
			uuid() +
			"-" +
			filename.toLowerCase().split(" ").join("-");

		return new Promise(async (resolve, reject) =>
			createReadStream()
				.pipe(createWriteStream(path.join(process.cwd(), "/public", url)))
				.on("finish", () =>
					resolve(
						`${
							process.env.BASE_URL || "http://localhost:5000/" + "public/" + url
						}`
					)
				)
				.on("error", () => reject(new Error("File upload failed!")))
		);
	}
}
