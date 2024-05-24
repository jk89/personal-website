import * as fs from "fs";
import * as process from "process";
import { resolve, sep, join, dirname, basename } from "path";
import isImage from "is-image";
import isVideo from "is-video";
import { getAverageColor } from "fast-average-color-node";
import ffmpeg from "ffmpeg";
import getSize from "image-size";
import sharp from "sharp";
import { extname } from "path";
import FFmpeg from "fluent-ffmpeg";
import * as assetData from "../src/app/assetDescriptors.json" assert { type: "json" };

const argumentsDirectory = process.argv.length > 2 ? process.argv[2] : "../src/assets";
const argumentsDirectoryResolved = resolve(argumentsDirectory);
console.log(argumentsDirectoryResolved, argumentsDirectory);
console.log(argumentsDirectory);
console.log(argumentsDirectoryResolved);

// ---------------- async methods relating to media files.

/**
 * Function to convert a video media file given its media description to an mp4 mov file.
 * @param {MediaDescriptionObj} descriptor The descriptor of a media file.
 * @returns A promise resolving the path to the new video file or rejecting any error.
 */
async function convertVideoToMovMpeg4AAC(descriptor) {
    if (descriptor.extension === ".mov") return null;
    if (descriptor.extension === ".webm") return null;

    const new_descriptor = { ...descriptor };
    new_descriptor.extension = ".mov";
    const newFixedPathMov = `${pathFileNameUnderscorePrefixer(descriptor.fullFixedPath)}.mov`;
    const newRelativePathWebM = `${pathFileNameUnderscorePrefixer(descriptor.fullRelativePath)}.mov`;
    return new Promise((res, rej) => {
        console.log("Processing video file mov mp4 aac", descriptor);
        (new FFmpeg(
            descriptor.fullFixedPath
        ).videoCodec('mpeg4')
            .withAudioCodec('aac')
            .on('error', (err) => {
                console.log('An error occurred: ' + err.message);
                rej(err);
            })
            .on('end', () => {
                console.log('Processing...');
                new_descriptor.id = `${pathFileNameUnderscorePrefixer(new_descriptor.id)}.mov`;
                new_descriptor.fullFixedPath = newFixedPathMov;
                new_descriptor.fullRelativePath = newRelativePathWebM;
                console.log("Resolving new_descriptor metadata", new_descriptor);
                res(new_descriptor);
            })
            .save(newFixedPathMov));
    });
}

/**
 * Function to convert a video media file given its media description to a webm file.
 * @param {MediaDescriptionObj} descriptor The descriptor of a media file.
 * @returns A promise resolving the path to the new video file or rejecting any error.
 */
async function convertVideoToWebM(descriptor) {
    if (descriptor.extension === ".webm") return null;
    if (descriptor.extension === ".mov") return null;

    const new_descriptor = { ...descriptor };
    new_descriptor.extension = ".webm";
    const newFixedPathWebM = `${pathFileNameUnderscorePrefixer(descriptor.fullFixedPath)}.webm`;
    const newRelativePathWebM = `${pathFileNameUnderscorePrefixer(descriptor.fullRelativePath)}.webm`;

    return new Promise((res, rej) => {
        console.log("Processing video file to webM libvpx-vp9", descriptor);
        (new FFmpeg(
            descriptor.fullFixedPath
        ).videoCodec('libvpx-vp9')
            .on('error', (err) => {
                console.log('An error occurred: ' + err.message);
                rej(err);
            })
            .on('end', () => {
                console.log('Processing...');
                new_descriptor.id = `${pathFileNameUnderscorePrefixer(new_descriptor.id)}.webm`;
                new_descriptor.fullFixedPath = newFixedPathWebM;
                new_descriptor.fullRelativePath = newRelativePathWebM;
                console.log("Resolving new_descriptor metadata", new_descriptor);
                res(new_descriptor);
            })
            .save(newFixedPathWebM));
    });
}

/**
 * Function to extract the first frame of a video and save it as a jpg given a video file media description.
 * @param {MediaDescriptionObj} descriptor The descriptor of a media file.
 * @returns A promise resolving the first frame video file path or rejecting any error.
 */
async function extractFirstFrameOfVideo(descriptor) {
    const path = descriptor.fullFixedPath;
    const videoProcess = new ffmpeg(path);
    const video = await videoProcess;

    return new Promise((res, rej) => {
        const destinationFolder = dirname(descriptor.fullFixedPath);
        video.fnExtractFrameToJPG(destinationFolder, {
            frame_rate: 1,
            number: 1,
            file_name: `${descriptor.fullFixedPath}_frameExtract.jpg`//`${pathFileNameUnderscorePrefixer(descriptor.fullFixedPath)}_frameExtract_1.jpg`
        }, function (error, file) {
            if (error) rej(error);
            else {
                fs.renameSync(`${descriptor.fullFixedPath}_frameExtract_1.jpg`, `${pathFileNameUnderscorePrefixer(descriptor.fullFixedPath)}_frameExtract_1.jpg`);
                res(`${pathFileNameUnderscorePrefixer(descriptor.fullFixedPath)}_frameExtract_1.jpg`);
            }
        });
    });
}

/**
 * Function to get the image dimensions of a image file given its path.
 * @param {string} fixedPath Path to the image asset.
 * @returns And object with the width and height attributes of the given image.
 */
function getSizeOfImage(fixedPath) {
    const dimensions = getSize(fixedPath);
    return { width: dimensions.width, height: dimensions.height };
}

/**
 * Function to attempt to auto videos files into web friendly formats, to extract the first frame of those videos, find the dimensions of the video and finally annotate the given media description with
 * the new information
 * @param {{[fileAssetId:string]:MediaFileDescriptionObj}} fileDescriptors A map of media file descriptors.
 */
async function annotateAndAutoConvertVideo(fileDescriptors) {
    await Promise.all(Object.keys(fileDescriptors).map(async (fileDescriptorKey) => {
        const fileDescriptor = fileDescriptors[fileDescriptorKey];
        if (fileDescriptor.type === "Video") {
            if (fileDescriptor.hasOwnProperty("webMPath") || fileDescriptor.hasOwnProperty("movPath")) return;
            const newImagePath = await extractFirstFrameOfVideo(fileDescriptors[fileDescriptorKey]);
            fileDescriptors[fileDescriptorKey].color = (await getAverageColor(newImagePath)).hex;
            const dimensions = getSizeOfImage(newImagePath);
            fileDescriptors[fileDescriptorKey].width = dimensions.width;
            fileDescriptors[fileDescriptorKey].height = dimensions.height;

            // try conversion in parallel
            await Promise.all(
                [
                    Promise.resolve().then(async () => {
                        // attempt to do webM conversion.
                        try {
                            const new_webm_file_id = `${fileDescriptor.id}.webm`;
                            console.log("new file id is", new_webm_file_id);
                            if (fileDescriptors[new_webm_file_id]) {
                                console.log("we already have this in fileDescriptors")
                                return; // skip if we have already converted.... its could be expensive.
                            }
                            const new_webm_file_descriptor = await convertVideoToWebM(fileDescriptor);
                            console.log("converting file got webm file descriptor", new_webm_file_descriptor);
                            if (new_webm_file_descriptor !== null) {
                                // we converted
                                fileDescriptors[fileDescriptorKey].webMPath = `${pathFileNameUnderscorePrefixer(fileDescriptor.id)}.webm`;
                                fileDescriptors[new_webm_file_descriptor.id] = new_webm_file_descriptor;
                            }
                        }
                        catch (e) {
                            console.error("error creating new webM video", e, e.stack);
                        }
                    }),
                    Promise.resolve().then(async () => {
                        // attempt to do mov conversion.
                        try {
                            const new_mov_file_id = `${fileDescriptor.id}.mov`;
                            console.log("new file id is", new_mov_file_id);
                            if (fileDescriptors[new_mov_file_id]) {
                                console.log("we already have this in fileDescriptors")
                                return; // skip if we have already converted.... its could be expensive.
                            }
                            const new_mov_file_descriptor = await convertVideoToMovMpeg4AAC(fileDescriptor);
                            console.log("converting file got mov file descriptor", new_mov_file_descriptor);
                            if (new_mov_file_descriptor !== null) {
                                // we converted
                                fileDescriptors[fileDescriptorKey].movPath = `${pathFileNameUnderscorePrefixer(fileDescriptor.id)}.mov`;
                                fileDescriptors[new_mov_file_descriptor.id] = new_mov_file_descriptor;
                            }
                        }
                        catch (e) {
                            console.error("error creating new mov video", e, e.stack);
                        }
                    })
                ]
            );
        }
    }));
};

/**
 * Function to find the average color of images contained in a media descriptors object 
 * @param {{[fileAssetId:string]:MediaFileDescriptionObj}} fileDescriptors A map of media file descriptors.
 */
async function annotateAverageImageColor(fileDescriptors) {
    await Promise.all(Object.keys(fileDescriptors).map(async (fileDescriptorKey) => {
        const fileDescriptor = fileDescriptors[fileDescriptorKey];
        if (fileDescriptor.type === "Image") {
            try {
                fileDescriptors[fileDescriptorKey].color = (await getAverageColor(fileDescriptor.fullRelativePath)).hex;
            }
            catch (e) {
                console.log("error in average img color", e.stack, fileDescriptor);
            }
            try {
                const dimensions = getSizeOfImage(fileDescriptor.fullRelativePath);
                fileDescriptors[fileDescriptorKey].width = dimensions.width;
                fileDescriptors[fileDescriptorKey].height = dimensions.height;
            }
            catch (e) {
                console.log("error in get size of image", e.stack, fileDescriptor);
            }
        }
    }));
};

/**
 * Function to convert images within the fileDescriptors map into web friendly webp image files.
 * @param {{[fileAssetId:string]:MediaFileDescriptionObj}} fileDescriptors A map of media file descriptors.
 */
async function annotateImageWebPPath(fileDescriptors) {
    await Promise.all(Object.keys(fileDescriptors).map(async (fileDescriptorKey) => {
        const fileDescriptor = fileDescriptors[fileDescriptorKey];
        if (fileDescriptor.type === "Image") {
            if (fileDescriptor.id.toLowerCase().includes(".webp")) return;
            const destinationFile = `${pathFileNameUnderscorePrefixer(fileDescriptor.fullFixedPath)}.webp`;
            const relativeDestinationFile = `${pathFileNameUnderscorePrefixer(fileDescriptor.id)}.webp`;
            await sharp(fileDescriptor.fullFixedPath)
                .webp()
                .toFile(destinationFile).catch((e) => console.error(e.stack));
            fileDescriptors[fileDescriptorKey].webPPath = relativeDestinationFile;
        }
    }));
}

// ---------------- sync methods relating to media files.

/**
 * Function to take a file path, take the filename and prefix it with an underscore
 * @param {string} pathStr A path string to file. 
 * @returns A string of the path with the filename with a prefix.
 */
const pathFileNameUnderscorePrefixer = pathStr => {
    const dirName = dirname(pathStr);
    const fileNameWithPrefix = `_${basename(pathStr)}`;
    const newFileName = join(dirName, fileNameWithPrefix);
    return newFileName;
};

/**
 * Utility method get get a list of files under a path, acts recursively.
 * @param {string} path The path of a folder for which to list the files contained.
 * @returns A list of file strings.
 */
const getFiles = path => {
    const files = []
    for (const file of fs.readdirSync(path)) {
        const fullPath = path + '/' + file
        if (fs.lstatSync(fullPath).isDirectory())
            getFiles(fullPath).forEach(x => files.push(file + '/' + x))
        else files.push(file)
    }
    return files;
}

/**
 * A function to get a list of file description objects given a path.
 * @param {string} rootPath The path to a file directory.
 * @returns A map of media descriptions found from a path.
 */
const getMediaFilesDescObjs = rootPath => {
    const mediaFiles = getFiles(rootPath).reduce((acc, path) => {
        const fullRelativePath = join(argumentsDirectory, path);
        if (assetData.default[path]) {
            acc[path] = {
                id: path,
                fullRelativePath,
                fullFixedPath: `${resolve(fullRelativePath)}`,
                extension: extname(fullRelativePath),
                ...assetData.default[path]
            };
        }
        else {
            acc[path] = {
                id: path,
                fullRelativePath,
                fullFixedPath: `${resolve(fullRelativePath)}`,
                extension: extname(fullRelativePath)
            };
        }
        return acc;
    }, {});
    return mediaFiles;
};

/**
 * A function to extend file media descriptions annotating the medias type attribute.
 * @param {Array<MediaDescriptionObj>} fileDescriptors A map of file media descriptions.
 */
const annotateMediaType = fileDescriptors => {
    Object.keys(fileDescriptors).forEach((fileDescriptorKey) => {
        fileDescriptors[fileDescriptorKey].type = detectMediaType(fileDescriptors[fileDescriptorKey].fullRelativePath);
    });
}

/**
 * Method to detect the media type of a given relative file path.
 * @param {*} fullRelativePath The relative file path of a media file.
 * @returns The media type of the file.
 */
const detectMediaType = fullRelativePath => {
    let type = "Unknown";
    if (isVideo(fullRelativePath)) {
        type = "Video";
    }
    else if (isImage(fullRelativePath)) {
        type = "Image";
    }
    return type;
};

/**
 * Function to reduce the media descriptions in a format suitable for saving.
 * @param {Array<MediaDescriptionObj>} mediaFilesDescObjs 
 * @returns 
 */
function reduceDescription(mediaFilesDescObjs) {
    const returnValue = {};
    Object.keys(mediaFilesDescObjs).forEach((descriptorKey) => {
        const descriptorObj = mediaFilesDescObjs[descriptorKey];
        if (descriptorObj.type === "Unknown") return;
        returnValue[descriptorKey] = {
            type: descriptorObj.type,
            color: descriptorObj.color,
            height: descriptorObj.height,
            width: descriptorObj.width,
            aspectRatio: descriptorObj.width / descriptorObj.height
        };
        if (descriptorObj.hasOwnProperty("webPPath")) {
            returnValue[descriptorKey].webPPath = descriptorObj.webPPath;
        }
        if (descriptorObj.hasOwnProperty("webMPath")) {
            returnValue[descriptorKey].webMPath = descriptorObj.webMPath;
        }
        if (descriptorObj.hasOwnProperty("movPath")) {
            returnValue[descriptorKey].movPath = descriptorObj.movPath;
        }
        if (descriptorObj.hasOwnProperty("extension")) {
            returnValue[descriptorKey].extension = descriptorObj.extension;
        }
    });

    return returnValue;
}

// ---------------- define the processing routine to define and transform media assets.

const mediaFiles = getMediaFilesDescObjs(argumentsDirectory);
annotateMediaType(mediaFiles);

// async methods
async function doAsyncRoutines(fileDescriptors) {
    console.log("about to do async");
    await annotateAverageImageColor(fileDescriptors).catch(err => console.error("Failed to annotate average image color", err));
    console.log("done average image color");
    await annotateAndAutoConvertVideo(fileDescriptors).catch(err => console.error("Failed to annotate average video color", err));;
    console.log("done average video color");
    await annotateImageWebPPath(fileDescriptors).catch(err => console.error("Failed to annotate image webp path", err));;
    console.log("done webp");
}

console.log("about to do async");

doAsyncRoutines(mediaFiles).then(() => {
    const filteredDescriptors = reduceDescription(mediaFiles);
    const pathToWrite = process.argv.length > 2 ? `./src/app/assetDescriptors.json` : "../src/app/assetDescriptors.json";
    console.log(pathToWrite);
    fs.writeFileSync(pathToWrite, JSON.stringify(filteredDescriptors, null, 4));
    console.log("done");
}).catch((e) => console.log(e.stack));
