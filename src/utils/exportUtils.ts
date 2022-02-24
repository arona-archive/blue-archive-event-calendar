import fs from 'fs';
import path from 'path';

export const exportJson = async (data: any, outputPath: string, filename: string) => {
	const filePath = path.resolve(outputPath, filename);
	await fs.promises.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`);
};
