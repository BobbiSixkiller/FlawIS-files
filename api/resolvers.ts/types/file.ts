import { Stream } from "stream";
import { Field, InputType, registerEnumType } from "type-graphql";

export interface Upload {
	filename: string;
	mimetype: string;
	encoding: string;
	createReadStream: () => Stream;
}

export enum FileType {
	IMAGE = "images",
	SUBMISSION = "submissions",
}

registerEnumType(FileType, {
	name: "FileType", // this one is mandatory
	description: "Supported file types for upload mutation", // this one is optional
});

@InputType({ description: "Input file for graphql file upload mutation" })
class FileTypeInput {
	@Field(() => FileType) // it's very important
	filetype: FileType;
}
